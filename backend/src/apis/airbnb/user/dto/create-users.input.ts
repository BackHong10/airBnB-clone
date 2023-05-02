import { InputType, PartialType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

export class CreateUsersInput extends PartialType(User, InputType) {}
