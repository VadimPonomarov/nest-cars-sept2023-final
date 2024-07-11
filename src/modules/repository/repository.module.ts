import { Global, Module } from '@nestjs/common';

import { AccountRepository } from './services/account.repository';
import { AdsRepository } from './services/ads.repository';
import { JwtRegisterRepository } from './services/jwt.repository';
import { UserRepository } from './services/user.repository';
import { AdsPhotoRepository } from './services/ads.photo.repository';

@Global()
@Module({
  providers: [
    UserRepository,
    JwtRegisterRepository,
    AdsRepository,
    AccountRepository,
    AdsPhotoRepository
  ],
  exports: [
    UserRepository,
    JwtRegisterRepository,
    AdsRepository,
    AccountRepository,
    AdsPhotoRepository
  ],
})
export class RepositoryModule {}
