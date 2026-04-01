import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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

  @Get()
  findAll(
    @Query() query: PostQueryDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CursorPaginatedResponse<PostEntity>> {
    throw new Error('Method not implemented.');
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    throw new Error('Method not implemented.');
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @Post(':id/like')
  like(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @Delete(':id/like')
  unlike(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @Get(':id/likes')
  whoLiked(@Param('id', ParseUUIDPipe) id: string): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
}
