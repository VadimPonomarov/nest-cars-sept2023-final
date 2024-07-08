import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import {
  appConf,
  logging,
  swaggerConf,
} from './common/constants/app.main.constants';
import { configService, ConfigType } from './common/configuration/configuration';

async function bootstrap() {
  const appConfig = configService.get<ConfigType['appConfig']>('appConfig');
  const app = await NestFactory.create(AppModule, {
    logger: logging.LOGGER ? new ConsoleLogger() : false,
  });

  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(
    app,
    swaggerConf.SWAGGER_CONFIG,
  );

  SwaggerModule.setup('docs', app, document, swaggerConf.SWAGGER_OPTIONS);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(appConf.PORT, () => {
    try {
      Logger.log(`Server is running on port: ${appConf.PORT}`);
      console.log(
        `Swagger running on ${appConfig.HOST}:${appConfig.PORT}/docs`,
      );
    } catch (e) {
      Logger.error(e);
    }
  });
}

bootstrap();
