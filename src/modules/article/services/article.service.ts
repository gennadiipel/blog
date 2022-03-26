import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, mergeMap, Observable, of } from 'rxjs';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AuthGuard } from 'src/modules/user/guards/auth.guard';
import { DeleteResult, Repository } from 'typeorm';
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

    return from(this.getAndGenerateUrlSlug(article)).pipe(
      mergeMap((articleWithUrlSlug: ArticleEntity) => {
        return from(this._articleRepository.save(articleWithUrlSlug));
      }),
    );
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponse {
    return { article };
  }

  getByUrlSlug(urlSlug: string): Observable<ArticleEntity> {
    return from(this._articleRepository.findOne({ urlSlug }));
  }

  getByTitleSlug(titleSlug: string): Observable<ArticleEntity[]> {
    return from(
      this._articleRepository.find({
        titleSlug,
      }),
    );
  }

  getAndGenerateUrlSlug(article: ArticleEntity): Observable<ArticleEntity> {
    return this.getByTitleSlug(article.titleSlug).pipe(
      mergeMap((articles: ArticleEntity[]) => {
        if (articles.length) {
          article.urlSlug += '-' + articles.length;
        }

        return of(article);
      }),
    );
  }

  deleteArticle(urlSlug: string, authorId: number): Observable<DeleteResult> {
    return from(this._articleRepository.findOne({ urlSlug })).pipe(
      mergeMap((article) => {
        if (!article) {
          throw new HttpException(
            `Post with slug '${urlSlug}' was not found!`,
            HttpStatus.NOT_FOUND,
          );
        }

        if (article.author.id !== authorId) {
          throw new HttpException(
            `You are not an author.`,
            HttpStatus.FORBIDDEN,
          );
        }

        return from(this._articleRepository.delete({ urlSlug }));
      }),
    );
  }

  updateArticle(
    urlSlug: string,
    createArticleDTO: CreateArticleDTO,
    authorId: number,
  ): Observable<ArticleEntity> {
    return {} as any;
  }
}
