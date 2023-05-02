import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
  @Field(() => String)
  @Column()
  @Field(() => String)
  name: string;
  @Column()
  @Field(() => Date)
  birth: Date;
  @Column()
  @Field(() => String)
  email: string;
  @Column()
  // @Field(() => String, { nullable: true })
  password: string;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;

  @DeleteDateColumn()
  DeletedAt: Date;
}
