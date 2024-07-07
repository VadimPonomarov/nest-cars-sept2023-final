import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import {
  configService,
  ConfigType,
} from '../../common/configuration/configuration';

export class DbConnectService implements TypeOrmOptionsFactory {
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.options;
  }

  get options() {
    return configService.get<ConfigType['typeOrm']>('typeOrm');
  }

  get dataSource() {
    return new DataSource(this.options as DataSourceOptions);
  }
}
