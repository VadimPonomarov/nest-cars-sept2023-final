import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import {
  configService,
  ConfigType,
} from '../../common/configuration/configuration';
import { AdsModule } from '../ads/ads.module';
import { RepositoryModule } from '../repository/repository.module';
import { AdminService } from '../user/admin/admin.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ActivateUserGuard } from './guards/activate.user.guard';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { JwtSkipAuthGuard } from './guards/jwt.skip.auth.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { RolesGuard } from './guards/roles.guard';
import { SellerAccountGuard } from './guards/seller.account.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    RepositoryModule,
    forwardRef(() => AdsModule),
    JwtModule.registerAsync({
      useFactory: () => configService.get<ConfigType['jwt']>('jwt'),
      global: true,
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtService,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    JwtSkipAuthGuard,
    RefreshGuard,
    ActivateUserGuard,
    RolesGuard,
    SellerAccountGuard,
  ],
  controllers: [AuthController],
  exports: [
    ActivateUserGuard,
    JwtSkipAuthGuard,
    AuthService,
    RolesGuard,
    SellerAccountGuard,
  ],
})
export class AuthModule {}
