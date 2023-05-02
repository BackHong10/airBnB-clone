import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('birth') birth: Date,
    @Args('password') password: string,
    @Args('name') name: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({ email, birth, hashedPassword, name });
  }

  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  fetchUser(@Args('email') email: string) {
    return this.usersService.find({ email });
  }

  @Mutation(() => User)
  async updateUser(
    @Args('email') email: string,
    @Args('birth') birth: Date,
    @Args('password') password: string,
    @Args('name') name: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    return this.usersService.update({
      user,
      email,
      birth,
      name,
      hashedPassword,
    });
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('userId') userId: string) {
    return this.usersService.delete({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(@Context() context: IContext) {
    console.log(context.req.user.email);
    return this.usersService.findLogin({ context });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async updateLoginUser(
    @Context() context: IContext,
    @Args('password') password: string,
  ) {
    console.log(context.req.user.email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.findOne({
      where: {
        email: context.req.user.email,
      },
    });
    return this.usersService.loginUpdate({ user, hashedPassword });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteLoginUser(@Context() context: IContext) {
    return this.usersService.deleteLogin({ context });
  }
}
