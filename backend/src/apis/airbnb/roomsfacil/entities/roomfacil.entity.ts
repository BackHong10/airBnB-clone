import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
@ObjectType()
export class RoomFacil {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
  @Column()
  @Field(() => Int)
  bed: number;
  @Column()
  @Field(() => Int)
  bedroom: number;
  @Column()
  @Field(() => Int)
  bathroom: number;
  @DeleteDateColumn()
  deletedAt: Date;
}
