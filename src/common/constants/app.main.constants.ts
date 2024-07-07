import { configService, ConfigType } from '../configuration/configuration';

const appConf = configService.get<ConfigType['appConfig']>('appConfig');
const swaggerConf = configService.get<ConfigType['swagger']>('swagger');
const logging = configService.get<ConfigType['logging']>('logging');
const SKIP_AUTH = 'SKIP_AUTH';

export { appConf, swaggerConf, logging, SKIP_AUTH };
