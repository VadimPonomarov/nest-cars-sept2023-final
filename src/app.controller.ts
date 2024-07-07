import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { SkipJwtAuth } from './common/decorators/skip.jwt.auth.decorator';
import { JwtSkipAuthGuard } from './modules/auth/guards/jwt.skip.auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { GoogleService } from './modules/google/google.service';

@UseGuards(JwtSkipAuthGuard, RolesGuard)
@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly googleService: GoogleService) {}

  @SkipJwtAuth()
  @Get()
  async getHello(): Promise<any> {
    return 'Hello, World!!!';
  }
}
