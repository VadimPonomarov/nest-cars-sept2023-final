import { Column, Entity, OneToOne } from 'typeorm';

import { AccountsEnum } from '../../../common/enums/accounts.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity({ name: 'accounts' })
export class AccountEntity extends BaseModel {
  @Column({
    type: 'enum',
    enum: AccountsEnum,
    default: AccountsEnum.BASE,
  })
  accountType: AccountsEnum;

  @OneToOne(() => UserEntity, (entity) => entity.account, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
