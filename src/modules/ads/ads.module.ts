import { Module } from '@nestjs/common';

import { GptModule } from '.././g4f/gpt.module';
import { AuthModule } from '../auth/auth.module';
import { GoogleModule } from '../google/google.module';
import { RepositoryModule } from '../repository/repository.module';
import { UserModule } from '../user/user.module';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';

@Module({
  imports: [RepositoryModule, GptModule, GoogleModule, AuthModule, UserModule],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService],
})
export class AdsModule {}
