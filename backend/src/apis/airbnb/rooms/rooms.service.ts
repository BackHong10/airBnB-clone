import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwIfEmpty } from 'rxjs';
import { Repository } from 'typeorm';
import { RoomCheckInOut } from '../roomsCheckIn-Out/entities/roomcheckIn-Out.entity';
import { RoomFacil } from '../roomsfacil/entities/roomfacil.entity';
import { RoomImage } from '../roomsImages/entities/roomlmage.entity';
import { RoomLocation } from '../roomsLocations/entities/roomlocation.entity';
import { RoomTags } from '../roomsTags/entities/roomTags.entity';
import { CreateRoomsInput } from './dto/rooms-create.input';
import { UpdateRoomsInput } from './dto/rooms-update.input';
import { Room } from './entities/room.entity';

interface IRoomsCreate {
  createRoomsInput: CreateRoomsInput;
  imageUrls: string[];
}

interface IRoomFind {
  roomId: string;
}

interface IRoomUpdate {
  room: Room;
  updateRoomsInput: UpdateRoomsInput;
  imageUrls: string[];
}

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
    @InjectRepository(RoomImage)
    private readonly roomsImageRepository: Repository<RoomImage>,
    @InjectRepository(RoomFacil)
    private readonly roomsFacilRepository: Repository<RoomFacil>,
    @InjectRepository(RoomCheckInOut)
    private readonly roomsCheckRepository: Repository<RoomCheckInOut>,
    @InjectRepository(RoomTags)
    private readonly roomsTagsRepository: Repository<RoomTags>,
    @InjectRepository(RoomLocation)
    private readonly roomsLocationRepository: Repository<RoomLocation>,
  ) {}

  async create({ createRoomsInput, imageUrls }: IRoomsCreate): Promise<Room> {
    const { roomCheckInOut, roomFacil, roomTags, roomLocation, ...room } =
      createRoomsInput;

    const result = await this.roomsCheckRepository.save({
      ...roomCheckInOut,
    });

    const result2 = await this.roomsFacilRepository.save({
      ...roomFacil,
    });

    const temp = [];
    for (let i = 0; i < roomTags.length; i++) {
      const tagName = roomTags[i].replace('#', '');

      const prevTag = await this.roomsTagsRepository.findOne({
        where: {
          name: tagName,
        },
      });

      if (prevTag) temp.push(prevTag);
      else {
        const newTag = await this.roomsTagsRepository.save({
          name: tagName,
        });
        temp.push(newTag);
      }
    }
    const roomlocation = await this.roomsLocationRepository.save({
      ...roomLocation,
    });
    const result3 = await this.roomsRepository.save({
      ...room,
      roomCheckInOut: {
        ...result,
      },
      roomFacil: {
        ...result2,
      },
      roomTags: temp,
      roomLocation: {
        ...roomlocation,
      },
    });
    await Promise.all(
      imageUrls.map((el) => {
        this.roomsImageRepository.save({
          room_img: el,
          room: {
            ...result3,
          },
        });
      }),
    );

    // for (let i = 0; i < imageUrls.length; i++) {
    //   await this.roomsImageRepository.save({
    //     room_img: imageUrls[i],
    //     room: {
    //       ...result3,
    //     },
    //   });
    // }

    return result3;
  }

  findAll(): Promise<Room[]> {
    return this.roomsRepository.find({
      relations: ['roomCheckInOut', 'roomFacil', 'roomTags', 'roomLocation'],
    });
  }
  findAllWithDeleted(): Promise<Room[]> {
    return this.roomsRepository.find({
      withDeleted: true,
      relations: ['roomCheckInOut', 'roomFacil', 'roomTags', 'roomLocation'],
    });
  }

  findOne({ roomId }: IRoomFind): Promise<Room> {
    return this.roomsRepository.findOne({
      where: {
        id: roomId,
      },
      relations: ['roomCheckInOut', 'roomFacil', 'roomTags', 'roomLocation'],
    });
  }

  async update({
    room,
    updateRoomsInput,
    imageUrls,
  }: IRoomUpdate): Promise<Room> {
    const { roomCheckInOut, roomFacil, roomTags, roomLocation, ...rooms } =
      updateRoomsInput;
    console.log(roomLocation);
    const result = await this.roomsImageRepository.find({
      where: {
        room,
      },
      relations: ['room'],
    });

    if (result) {
      await Promise.all(
        result.map((el) => {
          this.roomsImageRepository.delete(el.id);
        }),
      );
      // for (let i = 0; i < result.length; i++) {
      //   await this.roomsImageRepository.delete(result[i].id);
      // }
    }

    await Promise.all(
      imageUrls.map((el) => {
        this.roomsImageRepository.save({
          room_img: el,
          room: {
            ...room,
          },
        });
      }),
    );
    // for (let i = 0; i < imageUrls.length; i++) {
    //   await this.roomsImageRepository.save({
    //     room_img: imageUrls[i],
    //     room: {
    //       ...room,
    //     },
    //   });
    // }

    const temp = [];
    for (let i = 0; i < roomTags.length; i++) {
      const tagName = roomTags[i].replace('#', '');

      const prevTag = await this.roomsTagsRepository.findOne({
        where: {
          name: tagName,
        },
      });

      if (prevTag) temp.push(prevTag);
      else {
        const newTag = await this.roomsTagsRepository.save({
          name: tagName,
        });
        temp.push(newTag);
      }
    }
    const result3 = await this.roomsRepository.save({
      ...room,
      roomCheckInOut: {
        ...roomCheckInOut,
      },
      roomFacil: {
        ...roomFacil,
      },

      roomLocation: {
        ...roomLocation,
      },
      roomTags: temp,
      ...rooms,
    });
    await this.roomsCheckRepository.update(
      { id: room.roomCheckInOut.id },
      { checkIn: roomCheckInOut.checkIn, checkout: roomCheckInOut.checkout },
    );
    await this.roomsFacilRepository.update(
      { id: room.roomFacil.id },
      {
        bed: roomFacil.bed,
        bathroom: roomFacil.bathroom,
        bedroom: roomFacil.bedroom,
      },
    );
    await this.roomsLocationRepository.update(
      { id: room.roomLocation.id },
      { location: roomLocation.location },
    );
    return result3;
  }

  async delete({ roomId }): Promise<boolean> {
    const result = await this.roomsRepository.softDelete({ id: roomId });
    return result.affected ? true : false;
  }

  async restore({ roomId }) {
    const result = await this.roomsRepository.restore({
      id: roomId,
    });
    return result.affected ? true : false;
  }
}
