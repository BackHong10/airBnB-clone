import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRoomsInput } from './rooms-create.input';

@InputType()
export class UpdateRoomsInput extends PartialType(CreateRoomsInput) {}
