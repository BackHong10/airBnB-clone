import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from '../../payment/entities/payment.entity';
import { RoomCategory } from '../../roomsCategory/entities/roomCategory.entity';
import { RoomCheckInOut } from '../../roomsCheckIn-Out/entities/roomcheckIn-Out.entity';
import { RoomFacil } from '../../roomsfacil/entities/roomfacil.entity';
import { RoomLocation } from '../../roomsLocations/entities/roomlocation.entity';
import { RoomTags } from '../../roomsTags/entities/roomTags.entity';
import { User } from '../../user/entities/user.entity';
@ObjectType()
@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  price: number;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  @JoinColumn()
  @Field(() => RoomCheckInOut)
  @OneToOne(() => RoomCheckInOut, { onDelete: 'CASCADE' })
  roomCheckInOut: RoomCheckInOut;

  @JoinColumn()
  @Field(() => Payment)
  @OneToOne(() => Payment, { onDelete: 'CASCADE' })
  payment: Payment;

  @JoinColumn()
  @Field(() => RoomLocation)
  @OneToOne(() => RoomLocation, { onDelete: 'CASCADE' })
  roomLocation: RoomLocation;

  @JoinColumn()
  @Field(() => RoomCategory)
  @OneToOne(() => RoomCategory, { onDelete: 'CASCADE' })
  roomCategory: RoomCategory;

  @JoinColumn()
  @Field(() => RoomFacil)
  @OneToOne(() => RoomFacil, { onDelete: 'CASCADE' })
  roomFacil: RoomFacil;

  @JoinTable()
  @ManyToMany(() => RoomTags, (roomTags) => roomTags.room, {
    onDelete: 'CASCADE',
  })
  @Field(() => [RoomTags])
  roomTags: RoomTags[];

  @DeleteDateColumn()
  deletedAt: Date;
}
