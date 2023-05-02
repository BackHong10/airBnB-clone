import { InputType, PartialType } from '@nestjs/graphql';
import { RoomFacil } from '../entities/roomfacil.entity';
@InputType()
export class RoomFacilInput extends PartialType(RoomFacil, InputType) {}
