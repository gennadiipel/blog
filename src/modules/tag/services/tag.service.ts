import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { TagEntity } from '../entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly _tagRepository: Repository<TagEntity>,
  ) {}

  findTags(): Observable<TagEntity[]> {
    return from(this._tagRepository.find());
  }
}
