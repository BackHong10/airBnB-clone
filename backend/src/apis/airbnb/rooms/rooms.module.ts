import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomCategory } from '../roomsCategory/entities/roomCategory.entity';
import { RoomCheckInOut } from '../roomsCheckIn-Out/entities/roomcheckIn-Out.entity';
import { RoomFacil } from '../roomsfacil/entities/roomfacil.entity';
import { RoomImage } from '../roomsImages/entities/roomlmage.entity';
import { RoomLocation } from '../roomsLocations/entities/roomlocation.entity';
import { RoomTags } from '../roomsTags/entities/roomTags.entity';
import { Room } from './entities/room.entity';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Room,
      RoomCategory,
      RoomCheckInOut,
      RoomImage,
      RoomFacil,
      RoomTags,
      RoomLocation,
    ]),
  ],
  providers: [RoomsResolver, RoomsService],
})
export class RoomsModule {}
