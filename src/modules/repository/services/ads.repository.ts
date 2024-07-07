import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarAdsEntity } from '../../db/entities/car.ads.entity';

@Injectable()
export class AdsRepository extends Repository<CarAdsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarAdsEntity, dataSource.manager);
  }
}
