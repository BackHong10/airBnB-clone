import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
@ObjectType()
export class RoomCheckInOut {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
  @Column()
  @Field(() => Date)
  checkIn: Date;
  @Column()
  @Field(() => Date)
  checkout: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
