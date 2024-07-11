import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { CurrenciesEnum } from '../../../common/enums/currencies.enum';
import { AdsPhotoEntity } from '../../db/entities/ads.photo.entity';
import { CarAdsEntity } from '../../db/entities/car.ads.entity';
import { UserEntity } from '../../db/entities/user.entity';

export class AdsBaseDto implements CarAdsEntity {
  @IsUUID()
  @ApiProperty()
  id?: string;

  @IsString()
  @ApiProperty({ example: '' })
  address: string;

  @IsString()
  @ApiProperty({ example: 'Украина' })
  country: string;

  @IsString()
  @ApiProperty({ example: 'Запорожская' })
  region: string;

  @IsString()
  @ApiProperty({ example: 'Запорожье' })
  locality: string;

  @IsString()
  @ApiProperty({
    type: 'enum',
    enum: CurrenciesEnum,
    example: CurrenciesEnum.UAH,
  })
  currency: string;

  @IsString()
  @ApiProperty({ example: 'Легковой' })
  type: string;

  @IsString()
  @ApiProperty({ example: 'Kia' })
  mark: string;

  @IsString()
  @ApiProperty({ example: 'rio' })
  model: string;

  @IsInt()
  @Min(1900)
  @Max(new Date(Date.now()).getFullYear())
  @ApiProperty({
    type: 'integer',
    nullable: true,
    example: new Date(Date.now()).getFullYear(),
  })
  year?: number;

  @IsNumber()
  @ApiProperty({ type: 'int', example: 1000 })
  price: number;

  @IsString()
  @MinLength(10)
  @MaxLength(200)
  @ApiProperty({
    type: 'text',
    example: '',
    nullable: false,
  })
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @ApiProperty({
    type: 'text',
    example: '',
    nullable: false,
  })
  text: string;

  @ApiProperty()
  created?: Date;

  @ApiProperty()
  updated?: Date;

  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  userId: string;

  @IsBoolean()
  @ApiProperty({ default: false })
  isActive: boolean;

  @IsArray()
  @Type(() => AdsPhotoEntity)
  @ValidateNested({ each: true })
  @ApiProperty({ type: AdsPhotoEntity, nullable: true, default: null })
  photos?: AdsPhotoEntity[];
}
