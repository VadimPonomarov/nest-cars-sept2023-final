import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AccountEntity } from '../../db/entities/account.entity';

@Injectable()
export class AccountRepository extends Repository<AccountEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AccountEntity, dataSource.manager);
  }
}
