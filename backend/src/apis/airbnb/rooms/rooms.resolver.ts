import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRoomsInput } from './dto/rooms-create.input';
import { UpdateRoomsInput } from './dto/rooms-update.input';
import { Room } from './entities/room.entity';
import { RoomsService } from './rooms.service';

@Resolver()
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => Room)
  createRoom(
    @Args('createRoomsInput') createRoomsInput: CreateRoomsInput,
    @Args({ name: 'imageurls', type: () => [String] }) imageUrls: string[],
  ): Promise<Room> {
    return this.roomsService.create({ createRoomsInput, imageUrls });
  }

  @Query(() => [Room])
  fetchRooms(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Query(() => Room)
  fetchRoom(@Args('roomId') roomId: string) {
    return this.roomsService.findOne({ roomId });
  }

  @Query(() => [Room])
  fetchRoomsWithDeleted() {
    return this.roomsService.findAllWithDeleted();
  }

  @Mutation(() => Room)
  async updateRooms(
    @Args('roomId') roomId: string,
    @Args('updateRoomsInput') updateRoomsInput: UpdateRoomsInput,
    @Args({ name: 'imageurls', type: () => [String] }) imageUrls: string[],
  ) {
    const room = await this.roomsService.findOne({ roomId });
    return this.roomsService.update({ room, updateRoomsInput, imageUrls });
  }

  @Mutation(() => Boolean)
  deleteRoom(@Args('roomId') roomId: string): Promise<boolean> {
    return this.roomsService.delete({ roomId });
  }

  @Mutation(() => Boolean)
  restoreProduct(@Args('roomId') roomId: string) {
    return this.roomsService.restore({ roomId });
  }
}
