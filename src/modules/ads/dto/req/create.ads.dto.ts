import { OmitType } from '@nestjs/swagger';

import { AdsBaseDto } from '../ads.base.dto';

export class CreateAdsDto extends OmitType(AdsBaseDto, [
  'id',
  'address',
  'updated',
  'created',
  'userId',
  'user',
]) {}
