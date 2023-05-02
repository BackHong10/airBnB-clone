import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomCategory } from './entities/roomCategory.entity';

interface IRoomcategoryService {
  category: string;
}
@Injectable()
export class RoomCategoryService {
  constructor(
    @InjectRepository(RoomCategory)
    private readonly roomCategoryRepository: Repository<RoomCategory>,
  ) {}

  async create({ category }: IRoomcategoryService): Promise<RoomCategory> {
    const resultC = await this.roomCategoryRepository.findOne({
      where: {
        category,
      },
    });
    if (resultC) {
      throw new ConflictException('이미 존재하는 카테고리 입니다.');
    }
    const result = await this.roomCategoryRepository.save({ category });
    return result;
  }

  find(): Promise<RoomCategory[]> {
    return this.roomCategoryRepository.find();
  }
}
