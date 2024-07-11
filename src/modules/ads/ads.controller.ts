import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe, Patch,
  Post,
  Request,
  Res, UploadedFiles,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth,  ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtSkipAuthGuard } from '../auth/guards/jwt.skip.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SellerAccountGuard } from '../auth/guards/seller.account.guard';
import { AdsService } from './ads.service';
import { CreateAdsDto } from './dto/req/create.ads.dto';
import { CreateAdsResDto } from './dto/res/create.ads.res.dto';
import { RolesEnum } from '../../common/enums/roles.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilePhotoDto } from './dto/file.photo.dto';
import { ApiFile } from '../../common/decorators/api-file.decorator';

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


  @ApiOperation({
    summary: 'Updating current User\'s ads by Id, adding list of photos',
  })
  @UseInterceptors(FilesInterceptor('photos'))
  @ApiConsumes('multipart/form-data')
  @ApiFile('photos')
  @Patch('photos/:adsId')
  async addPhotosAds(
    @Request() req,
    @Param('adsId', ParseUUIDPipe) adsId: string,
    @Body() dto: FilePhotoDto[],
    @UploadedFiles() photos: Express.Multer.File[],
  ): Promise<CreateAdsResDto> {
    return await this.adsService.createAdsPhotos(req.user.id, adsId, photos);
  }


  @ApiOperation({
    summary: 'Deleting current User\'s ads photo by photo attribute "fileName"',
  })
  @ApiParam({ name: 'fileName', type: String, required: true })
  @Delete('photos/:fileName')
  async deletePhotosAds(
    @Request() req,
    @Param() fileName: { fileName: string },
  ): Promise<CreateAdsResDto> {
    return await this.adsService.deleteAdsPhoto(req.user.id, fileName.fileName);
  }


  @ApiOperation({
    summary: 'Get current User\'s list of ads by adsId',
  })
  @Get('user/me')
  async getMyAds(@Request() req): Promise<CreateAdsResDto[]> {
    return await this.adsService.getAdsManyByUserId(req.user.id);
  }

  @Roles([RolesEnum.ADMIN, RolesEnum.MANAGER])
  @ApiOperation({
    summary: 'Get list of ads by userId',
  })
  @ApiParam({ name: 'userId', type: String, required: true })
  @Get('user/:userId')
  async getByUserId(@Param('userId', ParseUUIDPipe) userId: string): Promise<CreateAdsResDto[]> {
    return await this.adsService.getAdsManyByUserId(userId);
  }

  @Roles([RolesEnum.ADMIN, RolesEnum.MANAGER])
  @ApiOperation({
    summary: 'Get ads by adsId',
  })

  @Roles([RolesEnum.ADMIN, RolesEnum.MANAGER])
  @ApiParam({ name: 'adsId', type: String, required: true })
  @Get(':adsId')
  async getByAdsId(@Param('adsId', ParseUUIDPipe) adsId: string): Promise<CreateAdsResDto> {
    return await this.adsService.getAdsByAdsId(adsId);
  }

  @ApiOperation({
    summary: 'Delete current User\'s ads by adsId',
  })
  @ApiOkResponse({ description: 'Success' })
  @ApiParam({ name: 'adsId', type: String, required: true })
  @Delete('user/me/:adsId')
  async deleteMeByAdsId(@Request() req, @Param('adsId', ParseUUIDPipe) adsId: string, @Res() res: Response): Promise<unknown> {
    try {
      await this.adsService.deleteUserAdsById(req.user.id, adsId);
      return res.status(HttpStatus.OK).send('!!! Success');
    } catch (e) {
      return res.status(HttpStatus.NOT_FOUND).send('!!! Fail');
    }
  }
}
