import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostVisibility } from '../enums/post-visibility.enum';
import { User } from '../../users/entities/user.entity';
import { PostLike } from './post-like.entity';

@Entity('posts')
@Index(['createdAt', 'id'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
  })
  visibility: PostVisibility;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;

  @Column()
  @Index()
  authorId: string;

  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
