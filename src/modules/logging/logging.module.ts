import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import {
  configService,
  ConfigType,
} from '../../common/configuration/configuration';

@Module({
  imports: [
    LoggerModule.forRoot({
      ...configService.get<ConfigType['pinoParams']>('pinoParams'),
    }),
  ],
})
export class LoggingModule {}
