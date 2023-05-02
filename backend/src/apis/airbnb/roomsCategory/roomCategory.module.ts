import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomCategory } from './entities/roomCategory.entity';
import { RoomCategoryResolver } from './roomCategory.resolver';
import { RoomCategoryService } from './roomCategory.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomCategory])],
  providers: [RoomCategoryResolver, RoomCategoryService],
})
export class RoomCategoryModule {}
