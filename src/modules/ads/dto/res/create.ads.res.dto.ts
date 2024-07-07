import { OmitType } from '@nestjs/swagger';

import { AdsBaseDto } from '../ads.base.dto';

export class CreateAdsResDto extends OmitType(AdsBaseDto, []) {}
