import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '../user/guards/auth.guard';
import { ArticleController } from './controllers/article.controller';
import { ArticleEntity } from './entities/article.entity';
import { ArticleService } from './services/article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), AuthGuard],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
