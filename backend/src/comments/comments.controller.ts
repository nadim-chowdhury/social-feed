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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CommentQueryDto } from './dto/comment-query.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.create(postId, dto, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.update(id, dto, user);
  }

  @Get()
  findByPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: CommentQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.findByPost(
      postId,
      query.page,
      query.limit,
      user.id,
    );
  }

  @Get(':id/replies')
  getReplies(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Query() query: CommentQueryDto,
  ) {
    return this.commentsService.getReplies(
      id,
      query.page,
      query.limit,
      user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.commentsService.remove(id, user);
  }

  @Post(':id/like')
  like(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.commentsService.like(id, user.id);
  }

  @Delete(':id/like')
  unlike(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.commentsService.unlike(id, user.id);
  }

  @Get(':id/likes')
  whoLiked(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: CommentQueryDto,
  ) {
    return this.commentsService.whoLiked(id, query.page, query.limit);
  }
}
