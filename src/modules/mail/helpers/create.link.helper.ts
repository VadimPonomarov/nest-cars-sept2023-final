import {
  configService,
  ConfigType,
} from '../../../common/configuration/configuration';

interface ICreateLinkDto {
  url: string;
  token: string;
}
const config = configService.get<ConfigType['appConfig']>('appConfig');

export const createLinkHelper = async (
  dto: ICreateLinkDto,
): Promise<string> => {
  return [config.HOST, config.PORT.toString()]
    .join(':')
    .concat([dto.url, dto.token].join(''));
};
