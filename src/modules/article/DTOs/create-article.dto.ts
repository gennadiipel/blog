import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateArticleDTO {
  @IsNotEmpty()
  title: string;

  @MaxLength(256)
  excerpt: string;

  @IsNotEmpty()
  @MaxLength(10000)
  @MinLength(4)
  content: string;

  tagList?: string[];
}
