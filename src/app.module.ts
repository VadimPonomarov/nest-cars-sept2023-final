import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import customConfig from './common/configuration/configuration';
import { GptModule } from './modules/./g4f/gpt.module';
import { AdsModule } from './modules/ads/ads.module';
import { AuthModule } from './modules/auth/auth.module';
import { DbModule } from './modules/db/db.module';
import { GoogleModule } from './modules/google/google.module';
import { LoggingModule } from './modules/logging/logging.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    DbModule,
    LoggingModule,
    AuthModule,
    UserModule,
    GptModule,
    GoogleModule,
    AdsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [customConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
