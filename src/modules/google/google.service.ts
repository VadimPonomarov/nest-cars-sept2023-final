import * as Client from '@google/maps';
import { type CreateClientOptions, Language } from '@google/maps';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigType } from '../../common/configuration/configuration';
import {
  IGeoCodes,
  IPlaceAutocomplete,
} from './interfaces/place.autocomplete.input.interface';

@Injectable()
export class GoogleService {
  client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = Client.createClient<CreateClientOptions>(
      configService.get<ConfigType['googleMaps']>('googleMaps'),
    );
  }

  public async placeAutocomplete(input: IPlaceAutocomplete): Promise<any> {
    try {
      const _response = await this.client
        .placesAutoComplete({
          sessiontoken: null,
          input: Object.values(input).join(),
        })
        .asPromise();
      const { place_id, description, terms } =
        await _response.json.predictions[0];
      const _mapped: IGeoCodes = {
        country: await this.getCode(input.country),
        region: await this.getCode([input.country, input.region].join()),
        locality: place_id,
      };
      return [place_id, description, _mapped];
    } catch (e) {
      throw e;
    }
  }

  public async getCode(input: string): Promise<string> {
    try {
      const _response = await this.client
        .placesAutoComplete({
          sessiontoken: null,
          input,
        })
        .asPromise();
      return await _response.json.predictions[0].place_id;
    } catch (e) {
      throw e;
    }
  }
}
