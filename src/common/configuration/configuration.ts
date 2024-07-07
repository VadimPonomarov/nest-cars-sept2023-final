import { type CreateClientOptions, type Language } from '@google/maps';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Params as PinoParams } from 'nestjs-pino';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

import { TokensEnum } from '../enums/tokens.enum';

config();

const customConfig = () => ({
  appConfig: {
    HOST:
      process.env.PORT! in
      ['localhost', 'http://localhost', '127.0.0.1', '', null]
        ? process.env.PORT
        : 'http://127.0.0.1',
    PORT: parseInt(process.env.PORT) || 3000,
  },
  sendGrid: {
    SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
  },
  logging: {
    LOGGER: process.env.LOGGER === 'true',
    LOGGER_SKIP_CONSOLE: process.env.LOGGER_SKIP_CONSOLE === 'true',
    LOGGER_SKIP_FILE: process.env.LOGGER_SKIP_FILE === 'true',
    LOGGER_USE_JSON_LOGGER: process.env.LOGGER_USE_JSON_LOGGER === 'true',
    LOGGER_LEVEL: process.env.LOGGER_LEVEL,
  },
  pinoParams: {
    pinoHttp: {
      timestamp: () =>
        `,"timestamp":"${new Date(Date.now()).toLocaleString()}"`,
      enabled:
        process.env.LOGGER !== 'false' &&
        process.env.LOGGER_SKIP_CONSOLE !== 'true',
      transport: {
        targets: [
          {
            target:
              process.env.LOGGER_SKIP_CONSOLE === 'true' ? null : 'pino-pretty',
          },
          {
            target:
              process.env.LOGGER_SKIP_FILE === 'true' ? null : 'pino/file',
            options: {
              destination: './my-logs.log',
              mkDir: true,
              levelFirst: false,
              colorize: true,
            },
          },
        ],
      },
    },
  } as PinoParams,
  swagger: {
    SWAGGER_CONFIG: new DocumentBuilder()
      .setTitle('CarAds API')
      .setDescription('CarAds API')
      .setVersion('1.0.0')
      .addBearerAuth({
        type: 'http',
        name: 'Authorization',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'Authorization',
      })
      .build(),
    SWAGGER_OPTIONS: {
      swaggerOptions: {
        docExpansion: 'list',
        defaultModelsExpandDepth: 2,
        persistAuthorization: true,
      },
    },
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT) || 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  typeOrm: {
    type: 'postgres',
    port: parseInt(process.env.POSTGRES_PORT, 10),
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: process.env.TYPE_ORM_SYNCHRONIZE === 'true',
    entities: [
      join(process.cwd(), 'dist', 'modules', 'db', 'entities', '*.entity.js'),
    ],
    migrations: [
      join(process.cwd(), 'dist', 'modules', 'db', 'migrations', '*.js'),
    ],
  } as unknown as TypeOrmModuleOptions | DataSourceOptions,
  sentry: {
    dsn: process.env.SENTRY_DSN,
    env: process.env.SENTRY_ENVIRONMENT,
    debug: process.env.SENTRY_DEBUG === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET.toString().trim(),
    expiresIn: (tokenType: TokensEnum) => {
      switch (tokenType) {
        case TokensEnum.ACCESS:
          return '15m';
        case TokensEnum.REFRESH:
          return '30d';
        case TokensEnum.ACTIVATE:
          return '1d';
        default:
      }
    },
  },
  googleMaps: {
    key: process.env.GOOG_MAPS_KEY || 'AIzaSyCsggm6WJPvuGsmoyub8Ku9boYEiwDQv-s',
    Promise: Promise,
    language: (process.env.GOOG_MAPS_LANGUAGE || 'en') as Language,
  } as CreateClientOptions,
});

export default () => customConfig();
export type ConfigType = ReturnType<typeof customConfig>;
export const configService = new ConfigService(customConfig());
