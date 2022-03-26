import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AuthGuard } from 'src/modules/user/guards/auth.guard';
import { Repository } from 'typeorm';
import { CreateArticleDTO } from '../DTOs/create-article.dto';
import { ArticleEntity } from '../entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private _articleRepository: Repository<ArticleEntity>,
  ) {}

  @UseGuards(AuthGuard)
  createArticle(
    user: UserEntity,
    createArticleDTO: CreateArticleDTO,
  ): Observable<any> {
    const article: ArticleEntity = new ArticleEntity();

    if (!createArticleDTO.tagList) {
      createArticleDTO.tagList = [];
    }

    Object.assign(article, createArticleDTO);

    article.slug = 'sample-slug';

    article.author = user;

    return from(this._articleRepository.save(article));
  }
}
