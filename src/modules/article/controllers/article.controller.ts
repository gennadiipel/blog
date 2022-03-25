import { Post } from '@nestjs/common';

export class ArticleController {
  @Post('article/create')
  createArticle() {
    return '1';
  }
}
