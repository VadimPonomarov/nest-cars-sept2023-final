import {
  Body,
  Controller,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SkipJwtAuth } from '../../common/decorators/skip.jwt.auth.decorator';
import { JwtPairType } from '../../common/types/jwt.types';
import { CreateUserDto } from '../user/dto/req/create.user.dto';
import { CreateUserResDto } from '../user/dto/res/create.user.res.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/req/login.dto';
import { RefreshDto } from './dto/req/refresh.dto';
import { JwtSkipAuthGuard } from './guards/jwt.skip.auth.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('Auth')
@UseGuards(JwtSkipAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary:
      'Self registration of a user. NikName, Email, password are required in request body',
  })
  @SkipJwtAuth()
  @ApiConflictResponse({ description: 'Conflict response' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResDto> {
    Logger.log(
      `For testing "sendMail service" only, User(${createUserDto.email}) was sent a confirmation Email.`,
    );
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary:
      'User login. Email, password are required in request body. Jwt pair be returned if success',
  })
  @SkipJwtAuth()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiOkResponse({ description: 'Returns token pair' })
  @Post('login')
  async login(@Request() req): Promise<JwtPairType> {
    return await this.authService.login(req.user);
  }

  @ApiOperation({
    summary:
      'Getting tokens refreshed. "Refresh" token is required in request body. Jwt pair be returned if success',
  })
  @UseGuards(RefreshGuard)
  @ApiBody({ type: RefreshDto })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse({ description: 'Returns token pair' })
  @Post('refresh')
  async refresh(@Request() req, @Body() dto: RefreshDto): Promise<JwtPairType> {
    return await this.authService.login(req.user);
  }
}
