import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportModule } from 'src/apis/iamport/imaport.module';
import { ImaportService } from 'src/apis/iamport/imaport.service';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  providers: [PaymentResolver, PaymentService, ImaportService],
  imports: [TypeOrmModule.forFeature([User, Payment])],
})
export class PaymentModule {}
