import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { StarbucksModule } from './apis/starbucks/starbucks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoomsModule } from './apis/airbnb/rooms/rooms.module';
import { RoomCategoryModule } from './apis/airbnb/roomsCategory/roomCategory.module';
import { UsersModule } from './apis/airbnb/user/users.module';
import { AuthModule } from './apis/airbnb/auth/auth.module';
import { JWtAccessStrategy } from './commons/auth/jwt-access.strategy';
import { JWtRefreshStrategy } from './commons/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from './commons/auth/jwt-social-google-strategy';
import { JwtKakaoStrategy } from './commons/auth/jwt-social-kakao-strategy';
import { JwtNaverStrategy } from './commons/auth/jwt-social-naver-strategy';
import { PaymentModule } from './apis/airbnb/payment/payment.module';
import { IamportModule } from './apis/iamport/imaport.module';
import { FilesModule } from './apis/airbnb/files/files.module';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    StarbucksModule,
    RoomsModule,
    RoomCategoryModule,
    UsersModule,
    AuthModule,
    PaymentModule,
    IamportModule,
    FilesModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => {
        return {
          req,
          res,
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],
  providers: [
    JWtAccessStrategy,
    JWtRefreshStrategy,
    JwtGoogleStrategy,
    JwtKakaoStrategy,
    JwtNaverStrategy,
  ],
})
export class AppModule {}
