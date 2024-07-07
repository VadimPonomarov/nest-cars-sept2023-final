import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { JwtPairType } from '../../../../common/types/jwt.types';

export class RefreshDto implements Partial<JwtPairType> {
  @ApiProperty({ example: 'refreshToken' })
  @IsString()
  refresh: string;
}
