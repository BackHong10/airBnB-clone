import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Room } from '../../rooms/entities/room.entity';
@Entity()
@ObjectType()
export class RoomImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
  @Column()
  @Field(() => String)
  room_img: string;

  @ManyToOne(() => Room)
  @Field(() => Room)
  room: Room;
}
