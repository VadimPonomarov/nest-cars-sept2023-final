import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { includes, takeRight } from 'lodash';

import { ContentType } from '../../common/enums/s3.enum';
import { ObjectMapper } from '../../common/mappers/object.mapper';
import { CarAdsEntity } from '../db/entities/car.ads.entity';
import { FileStorageService } from '../file-storage/file-storage.service';
import { GptTasks } from '../g4f/constants/gpt.tasks';
import { GptService } from '../g4f/gpt.service';
import { GoogleService } from '../google/google.service';
import {
  IGeoCodes,
  IPlaceAutocomplete,
} from '../google/interfaces/place.autocomplete.input.interface';
import { AdsPhotoRepository } from '../repository/services/ads.photo.repository';
import { AdsRepository } from '../repository/services/ads.repository';
import { UserRepository } from '../repository/services/user.repository';
import { CreateAdsDto } from './dto/req/create.ads.dto';
import { UpdateAdsDto } from './dto/req/update.ads.dto';
import { CreateAdsResDto } from './dto/res/create.ads.res.dto';

@Injectable()
export class AdsService {
  constructor(
    private readonly adsRepository: AdsRepository,
    private readonly userRepository: UserRepository,
    private readonly gptService: GptService,
    private readonly googleService: GoogleService,
    private readonly fileStorageService: FileStorageService,
    private readonly photosRepository: AdsPhotoRepository,
  ) {}

  async createAds(
    userId: string,
    dto: CreateAdsDto,
  ): Promise<Partial<CreateAdsResDto>> {
    dto['title'] = await this.validateText(GptTasks.NO_BAD_WORDS(dto.title));
    dto['text'] = await this.validateText(GptTasks.NO_BAD_WORDS(dto.text));
    const carTypeMarkModel: string = await this.validateText(
      GptTasks.CAR_TYPE_MARK_MODEL([dto.type, dto.mark, dto.model].join()),
    );
    const [type, mark, model] = carTypeMarkModel.split(',');
    const { country, region, locality } = dto;
    const _geo = await this.getGeo({ country, region, locality });
    const _ads = this.adsRepository.create({
      ...dto,
      type: type.trim(),
      mark: mark.trim(),
      model: model.trim(),
      address: takeRight(_geo[1].split(','), 3).join().trim(),
      ..._geo[2],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const ads = await this.adsRepository.save({
      ..._ads,
      user,
      isActive: !includes(dto.title + dto.text, '*'),
    });
    return await ObjectMapper.getMapped<CreateAdsResDto>(
      this.adsRepository.findOne({ where: { id: ads.id } }),
    );
  }

  async createAdsPhotos(
    userId: string,
    adsId: string,
    photo: Express.Multer.File[],
  ): Promise<CreateAdsResDto> {
    if (!photo.length) throw new NotAcceptableException();
    await this.adsRepository.findOneByOrFail({
      userId,
      id: adsId,
    });
    await Promise.all(
      photo.map(async (item) => {
        const fileName = await this.fileStorageService.uploadFile(
          item,
          ContentType.PHOTO,
          adsId,
        );
        return await this.photosRepository.save(
          this.photosRepository.create({ carAdsId: adsId, fileName }),
        );
      }),
    );
    return await this.adsRepository.find({
      where: { id: adsId },
      relations: { photos: true },
      select: { photos: { fileName: true } },
    });
  }

  async deleteAdsPhoto(
    userId: string,
    fileName: string,
  ): Promise<CreateAdsResDto> {
    const _ads = await this.adsRepository.findOne({
      where: { userId, photos: { fileName } },
    });
    if (!_ads) throw new NotFoundException();
    await this.photosRepository.delete({ fileName, carAdsId: _ads.id });
    await this.fileStorageService.deleteFile(fileName);
    return await this.adsRepository.findOne({
      where: { id: _ads.id },
      relations: { photos: true },
      select: { photos: { fileName: true } },
    });
  }

  async updateAdsById(
    userId: string,
    adsId: string,
    dto: UpdateAdsDto,
  ): Promise<Partial<CreateAdsResDto>> {
    dto['title'] = await this.validateText(GptTasks.NO_BAD_WORDS(dto.title));
    dto['text'] = await this.validateText(GptTasks.NO_BAD_WORDS(dto.text));
    const carTypeMarkModel: string = await this.validateText(
      GptTasks.CAR_TYPE_MARK_MODEL([dto.type, dto.mark, dto.model].join()),
    );
    const [type, mark, model] = carTypeMarkModel.split(',');
    const [country, region, locality] = dto.address.split(',').reverse();
    const _geo = await this.getGeo({ country, region, locality });
    const _ads = this.adsRepository.create({
      ...dto,
      type: type.trim(),
      mark: mark.trim(),
      model: model.trim(),
      address: takeRight(_geo[1].split(','), 3).join().trim(),
      ..._geo[2],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const ads = await this.adsRepository.save({
      ..._ads,
      user,
      isActive: !includes(dto.title + dto.text, '*'),
    });
    return await ObjectMapper.getMapped<CreateAdsResDto>(
      this.adsRepository.findOne({ where: { id: ads.id } }),
    );
  }

  async updateAdsByIdWithoutTextValidation(
    adsId: string,
    dto: UpdateAdsDto,
  ): Promise<Partial<CreateAdsResDto>> {
    const _ads = await this.adsRepository.findOneByOrFail({ id: adsId });
    return await this.adsRepository.save({ ..._ads, ...dto });
  }

  async getAdsManyByUserId(userId: string): Promise<CarAdsEntity[]> {
    return await this.adsRepository.find({ where: { userId } });
  }

  async deleteUserAdsById(userId: string, adsId: string): Promise<void> {
    const _ads = await this.adsRepository.findOneByOrFail({ id: adsId });
    if (!_ads) throw new NotFoundException();
    await this.adsRepository.remove(_ads);
  }

  async getAdsByAdsId(id: string): Promise<CreateAdsResDto> {
    return await this.adsRepository.findOneOrFail({ where: { id } });
  }

  async getActiveAdsNumberByUserId(userId: string): Promise<any> {
    return await this.adsRepository.findOneBy({
      userId,
      isActive: true,
    });
  }

  async getNonActiveAdsNumberByUserId(userId: string): Promise<any> {
    return await this.adsRepository
      .findBy({ userId })
      .then((res) => res.length);
  }

  async validateText(text: string): Promise<string> {
    await this.gptService.addTask(text);
    return await this.gptService
      .chat()
      .then((resp) => resp.replaceAll('"', ''));
  }

  async getGeo(dto: IPlaceAutocomplete): Promise<any> {
    type GetGeoResType = [
      string, //geocode autocompleted
      string, //address autocompleted
      IGeoCodes, //geocodes: country, region, locality,
    ];
    const _res = (await this.googleService.placeAutocomplete(
      dto,
    )) as GetGeoResType;

    if (_res[1].length > 3) {
      const nexArr = takeRight(_res[1].split(','), 3).reverse();
      const nextDto: IPlaceAutocomplete = {
        country: nexArr[0],
        region: nexArr[1],
        locality: nexArr[2],
      };
      return (await this.googleService.placeAutocomplete(
        nextDto,
      )) as GetGeoResType;
    }

    return _res;
  }
}
