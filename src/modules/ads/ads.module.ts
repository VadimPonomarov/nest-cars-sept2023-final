import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { GoogleModule } from '../google/google.module';
import { RepositoryModule } from '../repository/repository.module';
import { UserModule } from '../user/user.module';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { GptModule } from '../g4f/gpt.module';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
  imports: [RepositoryModule, GoogleModule, GptModule, AuthModule, forwardRef(() => UserModule), FileStorageModule],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService],
})
export class AdsModule {
}
