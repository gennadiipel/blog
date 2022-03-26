import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { from, map, Observable } from 'rxjs';
import { User } from 'src/modules/user/decorators/user.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AuthGuard } from 'src/modules/user/guards/auth.guard';
import { DeleteResult } from 'typeorm';
import { CreateArticleDTO } from '../DTOs/create-article.dto';
import { ArticleService } from '../services/article.service';
import { ArticleResponse } from '../types/article-response.interface';

@Controller('article')
export class ArticleController {
  constructor(private _articleService: ArticleService) {}

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createArticle(
    @User() user: UserEntity,
    @Body('article') createArticleDTO: CreateArticleDTO,
  ): Observable<ArticleResponse> {
    return this._articleService
      .createArticle(user, createArticleDTO)
      .pipe(
        map((article) => this._articleService.buildArticleResponse(article)),
      );
  }

  @Get(':urlSlug')
  getBySlug(@Param('urlSlug') urlSlug: string) {
    return this._articleService
      .getByUrlSlug(urlSlug)
      .pipe(
        map((article) => this._articleService.buildArticleResponse(article)),
      );
  }

  @Delete(':urlSlug')
  deleteBySlug(
    @Param('urlSlug') urlSlug: string,
    @User('id') authorId: number,
  ): Observable<DeleteResult> {
    return this._articleService.deleteArticle(urlSlug, authorId);
  }
}
