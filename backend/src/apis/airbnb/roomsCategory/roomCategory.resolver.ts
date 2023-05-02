import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoomCategory } from './entities/roomCategory.entity';
import { RoomCategoryService } from './roomCategory.service';

@Resolver()
export class RoomCategoryResolver {
  constructor(private readonly roomsCategoriesService: RoomCategoryService) {}

  @Mutation(() => RoomCategory)
  createRoomCategory(
    @Args('category') category: string, //
  ): Promise<RoomCategory> {
    return this.roomsCategoriesService.create({ category });
  }

  @Query(() => [RoomCategory])
  fetchCategory(): Promise<RoomCategory[]> {
    return this.roomsCategoriesService.find();
  }
}
