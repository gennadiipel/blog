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

    return from(this.generateUrlSlug(article)).pipe(
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

  generateUrlSlug(article: ArticleEntity): Observable<ArticleEntity> {
    return this.getByTitleSlug(article.titleSlug).pipe(
      mergeMap((articles: ArticleEntity[]) => {
        if (articles.length) {
          articles.sort((articleA: ArticleEntity, articleB: ArticleEntity) => {
            const articleASlugId: number =
              +articleA.urlSlug.split('-').at(-1) || 0;
            const articleBSlugId: number =
              +articleB.urlSlug.split('-').at(-1) || 0;

            return articleASlugId - articleBSlugId;
          });

          const lastSlugIndex = +articles.at(-1).urlSlug.split('-').at(-1);

          article.urlSlug += isNaN(lastSlugIndex) ? '-1' : '-' + (lastSlugIndex + 1);
          // console.log(articles);
          // console.log(isNaN(lastSlugIndex) ? '-1' : '-' + (lastSlugIndex + 1));
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
    return this.getByUrlSlug(urlSlug).pipe(
      mergeMap((article: ArticleEntity) => {
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

        const updatedArticle: ArticleEntity = new ArticleEntity();
        Object.assign(updatedArticle, article);
        Object.assign(updatedArticle, createArticleDTO);

        if (!updatedArticle.tagList) {
          article.tagList = [];
        }

        if (article.title != createArticleDTO.title) {
          updatedArticle.titleSlug = this.generateSlugString(
            updatedArticle.title,
          );
          updatedArticle.urlSlug = updatedArticle.titleSlug;

          return this.generateUrlSlug(updatedArticle).pipe(
            mergeMap((newArticle: ArticleEntity) => {
              return from(this._articleRepository.save(newArticle));
            }),
          );
        } else {
          return from(this._articleRepository.save(updatedArticle));
        }
      }),
    );
  }

  generateSlugString(title: string): string {
    return slugify(title, { lower: true });
  }
}
