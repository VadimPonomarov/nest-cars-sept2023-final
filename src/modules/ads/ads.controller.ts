import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtSkipAuthGuard } from '../auth/guards/jwt.skip.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SellerAccountGuard } from '../auth/guards/seller.account.guard';
import { AdsService } from './ads.service';
import { CreateAdsDto } from './dto/req/create.ads.dto';
import { CreateAdsResDto } from './dto/res/create.ads.res.dto';

@UseGuards(JwtSkipAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Ads')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

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
}
