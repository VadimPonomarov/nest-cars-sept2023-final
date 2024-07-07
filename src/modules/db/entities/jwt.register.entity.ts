import { Column, Entity, Unique } from 'typeorm';

import { TokensEnum } from '../../../common/enums/tokens.enum';
import { BaseModel } from './models/base.model';

@Unique(['type', 'token'])
@Entity()
export class JwtRegister extends BaseModel {
  @Column({ enum: TokensEnum })
  type: string;

  @Column()
  token: string;

  @Column({ default: false })
  blacklisted: boolean;
}
