import { Injectable } from '@nestjs/common';
import { takeRight } from 'lodash';

import { ObjectMapper } from '../../common/mappers/object.mapper';
import { GptTasks } from '../g4f/constants/gpt.tasks';
import { GptService } from '../g4f/gpt.service';
import { GoogleService } from '../google/google.service';
import {
  IGeoCodes,
  IPlaceAutocomplete,
} from '../google/interfaces/place.autocomplete.input.interface';
import { AdsRepository } from '../repository/services/ads.repository';
import { UserRepository } from '../repository/services/user.repository';
import { CreateAdsDto } from './dto/req/create.ads.dto';
import { CreateAdsResDto } from './dto/res/create.ads.res.dto';

@Injectable()
export class AdsService {
  constructor(
    private readonly adsRepository: AdsRepository,
    private readonly userRepository: UserRepository,
    private readonly gptService: GptService,
    private readonly googleService: GoogleService,
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
      isActive: !(dto.title + dto.text).match(/[*]/g).length,
    });
    return await ObjectMapper.getMapped<CreateAdsResDto>(
      this.adsRepository.findOne({ where: { id: ads.id } }),
    );
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
