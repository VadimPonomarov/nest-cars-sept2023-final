import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  configService,
  ConfigType,
} from '../../common/configuration/configuration';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return configService.get<ConfigType['typeOrm']>('typeOrm');
      },
    }),
  ],
})
export class DbModule {}
