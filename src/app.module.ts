import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [TypeOrmModule.forRoot(), TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
