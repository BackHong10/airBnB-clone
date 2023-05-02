import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create({ email, birth, hashedPassword: password, name }) {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user) throw new ConflictException('이미 등록된 이메일입니다.');
    return this.usersRepository.save({
      email,
      password,
      name,
      birth,
    });
  }

  findAll() {
    return this.usersRepository.find({
      select: {
        birth: true,
        email: true,
        id: true,
        name: true,
      },
    });
  }

  find({ email }) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
  findLogin({ context }) {
    return this.usersRepository.findOne({
      where: {
        email: context.req.user.email,
      },
    });
  }

  update({ user, email, birth, name, hashedPassword: password }) {
    return this.usersRepository.save({
      ...user,
      email,
      password,
      birth,
      name,
    });
  }
  async loginUpdate({ user, hashedPassword: password }) {
    const result = await this.usersRepository.save({
      ...user,
      password,
    });
    return result ? true : false;
  }

  async delete({ userId }) {
    const result = await this.usersRepository.softDelete({ id: userId });
    return result.affected ? true : false;
  }

  async deleteLogin({ context }) {
    const result = await this.usersRepository.softDelete({
      id: context.req.user.id,
    });
    return result.affected ? true : false;
  }
}
