import { InputType, PartialType } from '@nestjs/graphql';
import { RoomLocation } from '../entities/roomlocation.entity';
@InputType()
export class RoomLocationInput extends PartialType(RoomLocation, InputType) {}
