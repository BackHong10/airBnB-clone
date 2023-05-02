import { InputType, PartialType } from '@nestjs/graphql';
import { RoomCheckInOut } from '../entities/roomcheckIn-Out.entity';
@InputType()
export class RoomCheckInOutInput extends PartialType(
  RoomCheckInOut,
  InputType,
) {}
