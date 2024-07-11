import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdsPhotoEntity } from '../../db/entities/ads.photo.entity';


@Injectable()
export class AdsPhotoRepository extends Repository<AdsPhotoEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdsPhotoEntity, dataSource.manager);
  }
}
