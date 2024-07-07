import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { SkipJwtAuth } from '../../common/decorators/skip.jwt.auth.decorator';
import { ActivateUserGuard } from '../auth/guards/activate.user.guard';
import { JwtSkipAuthGuard } from '../auth/guards/jwt.skip.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserEntity } from '../db/entities/user.entity';
import { UpdateUserDto } from './dto/req/update.user.dto';
import { UserService } from './user.service';

/*------------------*/

@ApiTags('Users')
@UseGuards(JwtSkipAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: "Returns partial information from current User's jwt-payload",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized response' })
  @Get('me')
  public async getMe(@Request() req): Promise<any> {
    return req.user;
  }

  /*------------------*/

  @ApiOperation({
    summary: 'Returns information about current User after be updated',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserEntity })
  @ApiUnauthorizedResponse({ description: 'Unauthorized response' })
  @Patch('me')
  public async updateMe(
    @Body() dto: Partial<UpdateUserDto>,
    @Request() req,
  ): Promise<Partial<UserEntity>> {
    return await this.userService.update({
      ...dto,
      email: req.user.email,
    });
  }

  /*------------------*/

  @ApiOperation({
    summary: 'Used for automatic Email confirmation. Jwt is required as param',
  })
  @SkipJwtAuth()
  @UseGuards(ActivateUserGuard)
  @Get('activate/:activateToken')
  async activate(
    @Param() activateToken: string,
    @Request() req,
  ): Promise<string> {
    await this.userService.activate(req.user.email);
    return 'Test activation of user is Successful!!!';
  }
}

/*------------------*/
