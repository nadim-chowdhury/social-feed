import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { Post as PostEntity } from './entities/post.entity';
import { CursorPaginatedResponse } from '../common/interfaces/cursor-paginated.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostQueryDto } from './dto/post-query.dto';
import { PostsService } from './posts.service';
import { WhoLikedQueryDto } from './dto/who-liked-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: UserEntity,
  ): Promise<PostEntity> {
    return this.postsService.create(dto, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: UserEntity,
  ): Promise<PostEntity> {
    return this.postsService.update(id, dto, user);
  }

  @Get()
  findAll(
    @Query() query: PostQueryDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CursorPaginatedResponse<PostEntity>> {
    return this.postsService.findAll(query, user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<PostEntity> {
    return this.postsService.findOne(id, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<void> {
    return this.postsService.remove(id, user);
  }

  @Post(':id/like')
  like(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<void> {
    return this.postsService.like(id, user.id);
  }

  @Delete(':id/like')
  unlike(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<void> {
    return this.postsService.unlike(id, user.id);
  }

  @Get(':id/likes')
  whoLiked(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: WhoLikedQueryDto,
  ): Promise<{ data: UserEntity[]; total: number }> {
    return this.postsService.whoLiked(id, query.page, query.limit);
  }
}
