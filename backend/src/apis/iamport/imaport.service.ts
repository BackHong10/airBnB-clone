import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { Payment } from '../airbnb/payment/entities/payment.entity';

@Injectable()
export class ImaportService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}
  async getToken() {
    const result = await axios
      .post('https://api.iamport.kr/users/getToken', {
        imp_key: process.env.IAMPORT_API_KEY,
        imp_secret: process.env.IAMPORT_API_SECRET,
      })
      .catch((error) => {
        throw new UnprocessableEntityException(error.response.data.message);
      });
    return result.data.response.access_token;
  }

  async checkUid({ impUid, amount: amount1, token }) {
    const result = await axios({
      url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
      method: 'get', // GET method
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((error) => {
      throw new UnprocessableEntityException('유효하지 않은 id입니다.');
    });

    const { amount } = result.data.response;
    if (amount !== amount1)
      throw new UnprocessableEntityException('결제 금액이 잘못되었습니다.');

    if (result.data.response.status !== 'paid') {
      throw new ConflictException('결제내역이 존재하지 않습니다.');
    }

    const payment = await this.paymentRepository.findOne({
      where: {
        impUid,
      },
    });

    if (payment) throw new ConflictException('이미 추가된 결제건 입니다.');
  }

  async cancel({ impUid, amount, user, token }) {
    const result = await this.paymentRepository.findOne({
      where: {
        impUid,
      },
    });
    if (!result) {
      throw new UnprocessableEntityException('유효하지 않은 id입니다.');
    }
    if (user === null)
      throw new UnprocessableEntityException('토큰을 확인해 주세요');

    if (result.pay_status === 'CANCEL')
      throw new UnprocessableEntityException('이미 취소된 결제건입니다.');

    const getCancelData = await axios({
      url: 'https://api.iamport.kr/payments/cancel',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // 아임포트 서버로부터 발급받은 엑세스 토큰
      },
      data: {
        imp_uid: impUid,
        amount,
      },
    }).catch((error) => {
      throw new UnprocessableEntityException('유효하지 않은 id입니다.');
    });

    const { response } = getCancelData.data;
    return response;
  }
}
