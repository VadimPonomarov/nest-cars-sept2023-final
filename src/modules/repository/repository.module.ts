import { Global, Module } from '@nestjs/common';

import { AccountRepository } from './services/account.repository';
import { AdsRepository } from './services/ads.repository';
import { JwtRegisterRepository } from './services/jwt.repository';
import { UserRepository } from './services/user.repository';

@Global()
@Module({
  providers: [
    UserRepository,
    JwtRegisterRepository,
    AdsRepository,
    AccountRepository,
  ],
  exports: [
    UserRepository,
    JwtRegisterRepository,
    AdsRepository,
    AccountRepository,
  ],
})
export class RepositoryModule {}
