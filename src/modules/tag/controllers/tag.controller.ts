import { Controller, Get } from '@nestjs/common';
import { TagService } from '../services/tag.service';

@Controller('tags')
export class TagController {
  constructor(private _tagService: TagService) {}

  @Get()
  findTags() {
    return this._tagService.findTags();
  }
}
