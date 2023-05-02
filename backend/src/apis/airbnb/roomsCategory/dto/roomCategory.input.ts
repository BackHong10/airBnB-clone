import { Field, InputType, PartialType } from '@nestjs/graphql';
import { RoomCategory } from '../entities/roomCategory.entity';
@InputType()
export class RoomCategoryInput extends PartialType(RoomCategory, InputType) {}
