import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtSkipAuthGuard } from '../auth/guards/jwt.skip.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SellerAccountGuard } from '../auth/guards/seller.account.guard';
import { AdsService } from './ads.service';
import { CreateAdsDto } from './dto/req/create.ads.dto';
import { CreateAdsResDto } from './dto/res/create.ads.res.dto';
import { RolesEnum } from '../../common/enums/roles.enum';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtSkipAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Ads')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {
  }

  @ApiOperation({
    summary: 'Create ads',
  })
  @UseGuards(SellerAccountGuard)
  @Post()
  async createAds(
    @Request() req,
    @Body() dto: CreateAdsDto,
  ): Promise<Partial<CreateAdsResDto>> {
    return await this.adsService.createAds(req.user.id, dto);
  }

  @Roles([RolesEnum.ADMIN, RolesEnum.MANAGER])
  @ApiOperation({
    summary: 'Get list of ads by userId',
  })
  @Get(':userId')
  async getByUserId(@Param() userId: string): Promise<CreateAdsResDto[]> {
    return await this.adsService.getAdsManyByUserId(userId);
  }

  @Roles([RolesEnum.ADMIN, RolesEnum.MANAGER])
  @ApiOperation({
    summary: 'Get list of ads by userId',
  })

  @Roles([RolesEnum.ADMIN, RolesEnum.MANAGER])
  @Get(':adsId')
  async getByAdsId(@Param() adsId: string): Promise<CreateAdsResDto> {
    return await this.adsService.getAdsManyByUserId(adsId);
  }
}
