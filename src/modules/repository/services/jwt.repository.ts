import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { JwtRegister } from '../../db/entities/jwt.register.entity';

@Injectable()
export class JwtRegisterRepository extends Repository<JwtRegister> {
  constructor(private readonly dataSource: DataSource) {
    super(JwtRegister, dataSource.manager);
  }
}
