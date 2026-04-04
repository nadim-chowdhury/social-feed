import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Brackets, Repository } from 'typeorm';
import { PostLike } from './entities/post-like.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/entities/user.entity';
import { PostQueryDto } from './dto/post-query.dto';
import { CursorPaginatedResponse } from '../common/interfaces/cursor-paginated.interface';
import { PostVisibility } from './enums/post-visibility.enum';
import { decodeCursor, encodeCursor } from '../common/helpers/cursor';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
  ) {}

  async create(dto: CreatePostDto, author: User): Promise<Post> {
    const post = this.postRepository.create({
      ...dto,
      authorId: author.id,
    });
    const saved = await this.postRepository.save(post);
    saved.author = author;
    return saved;
  }

  async update(
    id: string,
    dto: UpdatePostDto,
    currentUser: User,
  ): Promise<Post> {
    const post = await this.findOne(id, currentUser);

    if (post.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, dto);
    return this.postRepository.save(post);
  }

  async findAll(
    query: PostQueryDto,
    currentUser: User,
  ): Promise<CursorPaginatedResponse<Post>> {
    const limit = query.limit;

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where(
        new Brackets((sub) => {
          sub
            .where('post.visibility = :public', {
              public: PostVisibility.PUBLIC,
            })
            .orWhere('post.authorId = :userId', { userId: currentUser.id });
        }),
      )
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('post.id', 'DESC')
      .take(limit + 1);

    if (query.cursor) {
      const { createdAt, id } = decodeCursor(query.cursor);

      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('post.createdAt<:cursorDate', { cursorDate: createdAt })
            .orWhere(
              new Brackets((tie) => {
                tie
                  .where('post.createdAt = :cursorDate', {
                    cursorDate: createdAt,
                  })
                  .andWhere('post.id < :cursorId', { cursorId: id });
              }),
            );
        }),
      );
    }

    const posts = await qb.getMany();
    const postsIds = posts.map((p) => p.id);

    if (postsIds.length) {
      const likesTab = this.postLikeRepository.metadata.tableName;
      const usersTab =
        this.postLikeRepository.manager.connection.getMetadata(User).tableName;

      const recentLikesRows = await this.postLikeRepository.query(
        `
  SELECT pl."postId", u.id, u."firstName", u."lastName", u."avatar"
  FROM (
    SELECT "postId", "userId", ROW_NUMBER() OVER(PARTITION BY "postId" ORDER BY "createdAt" DESC) as rn
    FROM "${likesTab}" WHERE "postId" = ANY($1)
  ) pl JOIN "${usersTab}" u ON pl."userId" = u.id WHERE pl.rn <= 5
`,
        [postsIds],
      );

      const likesMap = recentLikesRows.reduce(
        (acc, row) => {
          (acc[row.postId] ??= []).push({
            id: row.id,
            firstName: row.firstName,
            lastName: row.lastName,
            avatar: row.avatar,
          });
          return acc;
        },
        {} as Record<string, any[]>,
      );

      posts.forEach((p) => (p.recentLikes = likesMap[p.id] || []));

      const liked = await this.postLikeRepository
        .createQueryBuilder('pl')
        .select('pl.postId')
        .where('pl.userId = :uid', { uid: currentUser.id })
        .andWhere('pl.postId IN (:...postsIds)', { postsIds })
        .getMany();

      const likedSet = new Set(liked.map((l) => l.postId));
      posts.forEach((p) => (p.isLikedByMe = likedSet.has(p.id)));
    }

    const hasNextPage = posts.length > limit;
    if (hasNextPage) {
      posts.pop();
    }

    return {
      data: posts,
      meta: {
        hasNextPage,
        nextCursor: hasNextPage
          ? encodeCursor(
              posts[posts.length - 1].createdAt,
              posts[posts.length - 1].id,
            )
          : null,
      },
    };
  }

  async findOne(id: string, currentUser: User): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    if (
      post.visibility !== PostVisibility.PUBLIC &&
      post.authorId !== currentUser.id
    ) {
      throw new ForbiddenException();
    }

    const liked = await this.postLikeRepository.findOne({
      where: { postId: post.id, userId: currentUser.id },
    });
    post.isLikedByMe = !!liked;

    return post;
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const post = await this.findOne(id, currentUser);

    if (post.authorId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
  }

  async like(postId: string, userId: string): Promise<void> {
    await this.postRepository.manager.transaction(async (manager) => {
      const post = await manager.findOne(Post, { where: { id: postId } });

      if (!post) {
        throw new NotFoundException(`Post ${postId} not found`);
      }

      const existing = await manager.findOne(PostLike, {
        where: { postId, userId },
      });

      if (existing) return;

      await manager.save(
        PostLike,
        manager.create(PostLike, { postId, userId }),
      );
      await manager.increment(Post, { id: postId }, 'likesCount', 1);
    });
  }

  async unlike(postId: string, userId: string): Promise<void> {
    await this.postRepository.manager.transaction(async (manager) => {
      const post = await manager.findOne(Post, { where: { id: postId } });

      if (!post) {
        throw new NotFoundException(`Post ${postId} not found`);
      }

      const existing = await manager.findOne(PostLike, {
        where: { postId, userId },
      });

      if (!existing) return;

      await manager.remove(existing);
      await manager
        .createQueryBuilder()
        .update(Post)
        .set({ likesCount: () => 'GREATEST("likesCount" -1, 0)' })
        .where('id = :id', { id: postId })
        .execute();
    });
  }

  async whoLiked(
    postId: string,
    page = 0,
    limit = 10,
  ): Promise<{ data: User[]; total: number }> {
    const [likes, total] = await this.postLikeRepository.findAndCount({
      where: { postId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: page * limit,
      take: limit,
    });
    return { data: likes.map((like) => like.user), total };
  }
}
