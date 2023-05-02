import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../airbnb/payment/entities/payment.entity';
import { PaymentService } from '../airbnb/payment/payment.service';
import { User } from '../airbnb/user/entities/user.entity';

@Module({
  providers: [PaymentService],
  imports: [TypeOrmModule.forFeature([Payment, User])],
})
export class IamportModule {}
