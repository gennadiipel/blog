import { Module } from '@nestjs/common';
import { TagController } from './controllers/tag.controller';
import { TagService } from './services/tag.service';

@Module({
  imports: [],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
