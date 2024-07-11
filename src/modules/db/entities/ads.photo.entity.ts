import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CarAdsEntity } from './car.ads.entity';
import { BaseModel } from './models/base.model';

@Entity({ name: 'ads_photos' })
export class AdsPhotoEntity extends BaseModel {
  @Column()
  fileName: string;

  @Column({ name: 'car_ads_id' })
  carAdsId: string;

  @ManyToOne(() => CarAdsEntity, entity => entity.photos)
  @JoinColumn({ name: 'car_ads_id' })
  carAds: CarAdsEntity;

}