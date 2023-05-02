import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { resourceLimits } from 'worker_threads';
import { RoomsService } from '../../rooms/rooms.service';
import { RoomCategory } from '../entities/roomCategory.entity';
import { RoomCategoryService } from '../roomCategory.service';

class MockRoomsCategory {
  mydb = [
    {
      category: '한옥',
    },
    {
      category: '해변마을',
    },
  ];

  save({ category }) {
    this.mydb.push({ category });
    return { category };
  }
  findOne({ where }) {
    const result = this.mydb.filter((el) => el.category === where.category);
    if (result.length) return result[0];
    return null;
  }
  find() {
    return this.mydb;
  }
}

describe('roomsCategoryService', () => {
  let roomCategoryService: RoomCategoryService;

  beforeEach(async () => {
    const roomsModule = await Test.createTestingModule({
      providers: [
        RoomCategoryService,
        {
          provide: getRepositoryToken(RoomCategory),
          useClass: MockRoomsCategory,
        },
      ],
    }).compile();

    roomCategoryService =
      roomsModule.get<RoomCategoryService>(RoomCategoryService);
  });

  describe('find', () => {
    it('카테고리 데이터 조회하기', async () => {
      const result = await roomCategoryService.find();
      console.log(result);
      const db = new MockRoomsCategory();
      expect(result).toStrictEqual(db.mydb);
    });
  });

  describe('create', () => {
    it('에러 검증하기', async () => {
      const category = '한옥';
      //   const result = roomCategoryService.create({ category });
      try {
        await roomCategoryService.create({ category });
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });

    it('회원등록 검증하기', async () => {
      const category = '오두막';
      const result = await roomCategoryService.create({ category });

      expect(result).toStrictEqual({ category });
    });
  });
});
