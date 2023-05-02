import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { ImaportService } from 'src/apis/iamport/imaport.service';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService, //
    private readonly iamportService: ImaportService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('impUid') impUid: string, //
    @Args({ name: 'amount', type: () => Int }) amount: number,

    @Context() context: IContext,
  ) {
    const user = context.req.user;
    console.log(user);
    const token = await this.iamportService.getToken();
    await this.iamportService.checkUid({ impUid, amount, token });

    return this.paymentService.create({ impUid, amount, user });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async cancelPayment(
    @Args('impUid') impUid: string,
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ) {
    const user = context.req.user;
    const token = await this.iamportService.getToken();
    const result = await this.iamportService.cancel({
      impUid,
      amount,
      user,
      token,
    });
    if (result) {
      const result2 = await this.paymentService.cancel({
        impUid,
        amount,
        user,
      });

      return result2;
    } else {
      throw new UnprocessableEntityException('결제 정보을 다시 확인해주세요');
    }
  }
}
