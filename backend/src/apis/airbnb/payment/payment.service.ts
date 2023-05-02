import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import {
  Payment,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>, //
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //
    private readonly dataSource: DataSource,
  ) {}
  async create({ impUid, amount, user: _user }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const payment = this.paymentRepository.create({
        impUid,
        amount,
        user: _user,
        pay_status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });
      console.log(payment);
      await queryRunner.manager.save(payment);

      const user = await queryRunner.manager.findOne(User, {
        where: {
          id: _user.id,
        },
        lock: { mode: 'pessimistic_write' },
      });
      const updatedUser = this.userRepository.create({
        ...user,
        point: user.point + amount,
      });

      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();
      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async cancel({ impUid, user, amount }) {
    const queryRunner1 = this.dataSource.createQueryRunner();
    await queryRunner1.connect();
    await queryRunner1.startTransaction('SERIALIZABLE');

    try {
      const user2 = await queryRunner1.manager.findOne(User, {
        where: {
          id: user.id,
        },
      });

      if (user2.point < amount)
        throw new UnprocessableEntityException('포인트가 부족합니다.');

      const user3 = this.userRepository.create({
        ...user2,
        point: user2.point - amount,
      });

      await queryRunner1.manager.save(user3);

      const result = this.paymentRepository.create({
        impUid,
        amount: -amount,
        user,
        pay_status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
      });
      const result2 = await queryRunner1.manager.save(result);
      await queryRunner1.commitTransaction();
      return result2;
    } catch (error) {
      console.log('=========================');
      await queryRunner1.rollbackTransaction();
    } finally {
      await queryRunner1.release();
    }
  }
}
