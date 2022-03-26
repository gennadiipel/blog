import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { from, map, Observable, of } from 'rxjs';
import { User } from 'src/modules/user/decorators/user.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AuthGuard } from 'src/modules/user/guards/auth.guard';
import { CreateArticleDTO } from '../DTOs/create-article.dto';
import { ArticleService } from '../services/article.service';
import { ArticleResponse } from '../types/article-response.interface';

@Controller()
export class ArticleController {
  constructor(private _articleService: ArticleService) {}

  @Post('article')
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
}
