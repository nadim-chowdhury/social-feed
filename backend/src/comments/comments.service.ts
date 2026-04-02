import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { Post } from '../posts/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CommentLike } from './entities/comment-like.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
  ) {}

  async create(
    postId: string,
    dto: CreateCommentDto,
    author: User,
  ): Promise<Comment> {
    return this.commentRepository.manager.transaction(async (manager) => {
      const post = await manager.findOne(Post, { where: { id: postId } });

      if (!post) {
        throw new NotFoundException(`Post ${postId} not found`);
      }

      if (dto.parentId) {
        const parent = await manager.findOne(Comment, {
          where: { id: dto.parentId, postId },
        });

        if (!parent) {
          throw new NotFoundException(
            `Parent comment ${dto.parentId} not found`,
          );
        }
      }

      const comment = manager.create(Comment, {
        content: dto.content,
        postId,
        authorId: author.id,
        parentId: dto.parentId ?? null,
      });

      const saved = await manager.save(Comment, comment);
      await manager.increment(Post, { id: postId }, 'commentsCount', 1);

      saved.author = author;
      return saved;
    });
  }

  async update(
    commentId: string,
    dto: UpdateCommentDto,
    currentUser: User,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.authorId !== currentUser.id)
      throw new ForbiddenException('You can only update your own comment');

    comment.content = dto.content;
    return this.commentRepository.save(comment);
  }

  async findByPost(
    postId: string,
    page: number,
    limit: number,
    userId: string,
  ): Promise<{ data: Comment[]; total: number }> {
    const [data, total] = await this.commentRepository.findAndCount({
      where: { postId, parentId: IsNull() },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip: page * limit,
      take: limit,
    });

    if (data.length) {
      const ids = data.map((c) => c.id);
      const liked = await this.commentLikeRepository
        .createQueryBuilder('cl')
        .select('cl.commentId')
        .where('cl.userId = :uid', { uid: userId })
        .andWhere('cl.commentId IN (:...ids)', { ids })
        .getMany();

      const set = new Set(liked.map((l) => l.commentId));
      data.forEach((c) => (c.isLikedByMe = set.has(c.id)));
    }

    return { data, total };
  }

  async getreplies(
    commentId: string,
    page: number,
    limit: number,
  ): Promise<{ data: Comment[]; total: number }> {
    const [data, total] = await this.commentRepository.findAndCount({
      where: { parentId: commentId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
      skip: page * limit,
      take: limit,
    });
    return { data, total };
  }

  async remove(commentId: string, currentUser: User): Promise<void> {
    await this.commentRepository.manager.transaction(async (manager) => {
      const comment = await manager.findOne(Comment, {
        where: { id: commentId },
      });

      if (!comment) {
        throw new NotFoundException('Comment Not Found');
      }

      if (comment.authorId !== currentUser.id) {
        throw new ForbiddenException('You can only delete your own comment');
      }

      const descendentCount = await manager
        .createQueryBuilder(Comment, 'c')
        .where('c.parentId = :id', { id: commentId })
        .getCount();
      const totalRemove = 1 + descendentCount;

      await manager.remove(comment);
      await manager.decrement(
        Post,
        { id: comment.postId },
        'commentsCount',
        totalRemove,
      );
    });
  }

  async like(commentId: string, userId: string): Promise<void> {
    await this.commentRepository.manager.transaction(async (manager) => {
      const comment = await manager.findOne(Comment, {
        where: { id: commentId },
      });
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      const existing = await manager.findOne(CommentLike, {
        where: { commentId, userId },
      });
      if (existing) return;

      await manager.save(
        CommentLike,
        manager.create(CommentLike, { commentId, userId }),
      );
      await manager.increment(Comment, { id: commentId }, 'likesCount', 1);
    });
  }

  async unlike(commentId: string, userId: string): Promise<void> {
    await this.commentRepository.manager.transaction(async (manager) => {
      const comment = await manager.findOne(Comment, {
        where: { id: commentId },
      });
      if (!comment) throw new NotFoundException('Comment not found');

      const existing = await manager.findOne(CommentLike, {
        where: { commentId, userId },
      });
      if (!existing) return;

      await manager.remove(existing);
      // await manager.decrement(Comment, { id: commentId }, 'likesCount', 1);
      await manager
        .createQueryBuilder()
        .update(Comment)
        .set({ likesCount: () => 'GREATEST("likesCount" -1, 0)' })
        .where('id = :id', { id: commentId })
        .execute();
    });
  }

  async whoLiked(
    commentId: string,
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    const [likes, total] = await this.commentLikeRepository.findAndCount({
      where: { commentId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: page * limit,
      take: limit,
    });
    return { data: likes.map((l) => l.user), total };
  }
}
