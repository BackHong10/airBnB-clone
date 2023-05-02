import { InputType, PartialType } from '@nestjs/graphql';
import { RoomImage } from '../entities/roomlmage.entity';
@InputType()
export class RoomImageInput extends PartialType(RoomImage, InputType) {}
