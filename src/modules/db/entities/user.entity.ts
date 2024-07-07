import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { RolesEnum } from '../../../common/enums/roles.enum';
import { AccountEntity } from './account.entity';
import { CarAdsEntity } from './car.ads.entity';
import { BaseModel } from './models/base.model';

@Entity({ name: 'users' })
export class UserEntity extends BaseModel {
  @Column({ name: 'nik_name', nullable: true, default: 'User' })
  nikName?: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ name: 'is_staff', nullable: true, default: false })
  isStaff?: boolean;

  @Column({ name: 'is_admin', nullable: true, default: false })
  isAdmin?: boolean;

  @Column({ name: 'is_active', default: true, nullable: true })
  isActive?: boolean;

  @Column({ name: 'account_id' })
  accountId: string;

  @OneToOne(() => AccountEntity, (entity) => entity.user, { nullable: true })
  @JoinColumn({ name: 'account_id' })
  account?: AccountEntity;

  @Column({ nullable: true })
  roles?: string;

  @OneToMany(() => CarAdsEntity, (entity) => entity.user)
  ads?: CarAdsEntity[];
}
