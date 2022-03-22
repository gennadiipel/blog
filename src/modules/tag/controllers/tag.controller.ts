import { Controller, Get } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { TagService } from '../services/tag.service';

@Controller('tags')
export class TagController {
  constructor(private _tagService: TagService) {}

  @Get()
  findTags(): Observable<string[]> {
    return this._tagService
      .findTags()
      .pipe(map((tags) => tags.map((tag) => tag.name)));
  }
}
