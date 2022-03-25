import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/modules/user/guards/auth.guard';

@Injectable()
export class ArticleService {
  @UseGuards(AuthGuard)
  createPost() {
    return 1;
  }
}
