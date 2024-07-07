import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, IsUUID, Length } from 'class-validator';

import { RolesEnum } from '../../../common/enums/roles.enum';
import { AccountEntity } from '../../db/entities/account.entity';
import { CarAdsEntity } from '../../db/entities/car.ads.entity';
import { UserEntity } from '../../db/entities/user.entity';

export class BaseUserDto implements UserEntity {
  @IsUUID()
  id?: string;

  @IsString()
  @Length(2, 10)
  @ApiProperty({
    example: 'NikExample',
    minLength: 2,
    maxLength: 10,
    default: 'User',
  })
  nikName?: string;

  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @IsBoolean()
  @ApiProperty({ example: 'false', default: false })
  isActive?: boolean;

  @IsBoolean()
  @ApiProperty({ example: 'false', default: false })
  isStaff?: boolean;

  @IsString()
  @ApiProperty({ example: '123qwe!@#QWE' })
  password: string;

  @ApiProperty()
  roles?: string;

  @IsBoolean()
  @ApiProperty({ nullable: true, default: false })
  isAdmin?: boolean;
  profile?: AccountEntity;
  created?: Date;
  updated?: Date;
  accountId: string;
  account: AccountEntity;
  ads: CarAdsEntity[] | null;
}
