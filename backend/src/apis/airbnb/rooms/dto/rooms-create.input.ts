import { Field, InputType, Int } from '@nestjs/graphql';
import { RoomCheckInOutInput } from '../../roomsCheckIn-Out/dto/roomsCheckIn-out.input';
import { RoomFacilInput } from '../../roomsfacil/dto/roomfacil.input';
import { RoomImageInput } from '../../roomsImages/dto/roomsimages.input';
import { RoomLocationInput } from '../../roomsLocations/dto/roomslocation.input';
import { RoomLocation } from '../../roomsLocations/entities/roomlocation.entity';
@InputType()
export class CreateRoomsInput {
  @Field(() => String)
  name: string;
  @Field(() => Int)
  price: number;

  @Field(() => RoomCheckInOutInput)
  roomCheckInOut: RoomCheckInOutInput;
  @Field(() => RoomFacilInput)
  roomFacil: RoomFacilInput;

  @Field(() => [String])
  roomTags: string[];

  @Field(() => RoomLocationInput)
  roomLocation: RoomLocationInput;
}
