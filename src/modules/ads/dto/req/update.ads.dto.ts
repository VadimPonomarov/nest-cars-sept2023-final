import { OmitType } from '@nestjs/swagger';

import { AdsBaseDto } from '../ads.base.dto';

export class UpdateAdsDto extends OmitType(AdsBaseDto, [
  'id',
  'country',
  'region',
  'locality',
  'updated',
  'created',
  'userId',
  'user',
]) {}
