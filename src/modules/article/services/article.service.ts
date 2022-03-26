import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, mergeMap, Observable } from 'rxjs';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AuthGuard } from 'src/modules/user/guards/auth.guard';
import { Repository } from 'typeorm';
import { CreateArticleDTO } from '../DTOs/create-article.dto';
import { ArticleEntity } from '../entities/article.entity';
import { ArticleResponse } from '../types/article-response.interface';
import slugify from 'slugify';

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
  ): Observable<ArticleEntity> {
    const article: ArticleEntity = new ArticleEntity();

    if (!createArticleDTO.tagList) {
      createArticleDTO.tagList = [];
    }

    Object.assign(article, createArticleDTO);

    article.titleSlug = slugify(createArticleDTO.title, {
      lower: true,
    });
    article.urlSlug = article.titleSlug;

    article.author = user;

    return from(
      this._articleRepository.find({
        titleSlug: article.titleSlug,
      }),
    ).pipe(
      mergeMap((articles: ArticleEntity[]) => {
        if (articles.length) {
          article.urlSlug += '-' + articles.length;
        }

        return from(this._articleRepository.save(article));
      }),
    );
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponse {
    return { article };
  }
}
