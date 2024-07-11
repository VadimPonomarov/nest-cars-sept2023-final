import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CurrenciesEnum } from '../../../common/enums/currencies.enum';
import { AdsPhotoEntity } from './ads.photo.entity';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity({ name: 'ads' })
export class CarAdsEntity extends BaseModel {
  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  locality: string;

  @Column()
  address: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  mark: string;

  @Column()
  model: string;

  @Column({ type: 'int', default: null, nullable: true })
  year?: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ enum: CurrenciesEnum, type: 'enum' })
  currency: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.ads, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => AdsPhotoEntity, (entity) => entity.carAds)
  photos?: AdsPhotoEntity[];

  @Column({ default: false })
  isActive: boolean;
}
