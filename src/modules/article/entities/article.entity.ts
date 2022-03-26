import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  titleSlug: string;

  @Column()
  urlSlug: string;

  @Column({ default: '' })
  excerpt: string;

  @Column({ default: '' })
  content: string;

  @Column({ type: 'simple-array' })
  tagList: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: 'image' })
  image: string;

  @Column({ default: 0 })
  likesCount: number;

  @ManyToOne(() => UserEntity, (user) => user.articlesList, { eager: true })
  author: UserEntity;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
