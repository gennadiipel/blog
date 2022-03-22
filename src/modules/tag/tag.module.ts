import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './controllers/tag.controller';
import { TagEntity } from './entities/tag.entity';
import { TagService } from './services/tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
