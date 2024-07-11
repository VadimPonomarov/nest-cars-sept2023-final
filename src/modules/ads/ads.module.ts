import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { GptModule } from '../g4f/gpt.module';
import { GoogleModule } from '../google/google.module';
import { RepositoryModule } from '../repository/repository.module';
import { UserModule } from '../user/user.module';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';

@Module({
  imports: [
    RepositoryModule,
    GoogleModule,
    GptModule,
    AuthModule,
    forwardRef(() => UserModule),
    FileStorageModule,
  ],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService],
})
export class AdsModule {}
