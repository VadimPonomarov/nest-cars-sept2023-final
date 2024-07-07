import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

import { Roles } from '../../../common/decorators/roles.decorator';
import { AccountsEnum } from '../../../common/enums/accounts.enum';
import { RolesActionEnum, RolesEnum } from '../../../common/enums/roles.enum';
import { JwtSkipAuthGuard } from '../../auth/guards/jwt.skip.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserEntity } from '../../db/entities/user.entity';
import { SetSuperAdminDto } from '../dto/req/set.admin.dto';
import { UpdateRolesDto } from '../dto/req/update.roles.dto';
import { AdminService } from './admin.service';

/*---------------------*/

@ApiTags('ADMIN')
@UseGuards(JwtSkipAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'Grants current User roles of SuperUser. Secret JWT is required',
  })
  @Post('roles/setSuperUser')
  async setSuperAdmin(
    @Request() req,
    @Body() dto: SetSuperAdminDto,
  ): Promise<any> {
    return await this.adminService.setSuperUser(req.user.id, dto.secret);
  }

  /*---------------------*/

  @ApiOperation({
    summary:
      'Current User, "if Authorised", can "grant" or "revoke" roles for a user by Email',
  })
  @ApiParam({
    name: 'action',
    type: 'enum',
    enum: RolesActionEnum,
    required: true,
  })
  @ApiParam({
    name: 'userEmail',
    type: String,
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: {
            type: 'enum',
          },
          example: [RolesEnum.BUYER, RolesEnum.SELLER],
        },
      },
    },
    required: true,
  })
  @Roles([RolesEnum.ADMIN])
  @Patch('roles/:action/:userEmail')
  async grantRoles(
    @Param('action') action: RolesActionEnum,
    @Param('userEmail') userEmail: string,
    @Body() updateDto: { roles: RolesEnum[] },
  ): Promise<any> {
    return await this.adminService.grantRoleByEmail(
      userEmail,
      updateDto.roles,
      action,
    );
  }

  /*---------------------*/

  @ApiOperation({
    summary:
      'Current User, "if Authorised", can alter a user\'s account type by account Id',
  })
  @ApiOperation({ summary: 'Описание эндпоинта' })
  @Roles([RolesEnum.ADMIN])
  @ApiParam({
    name: 'userId',
    type: 'string',
    required: true,
  })
  @ApiParam({
    name: 'type',
    type: 'enum',
    enum: AccountsEnum,
    required: true,
  })
  @Patch('account/:userId/:type')
  async changeAccountType(
    @Param('userId') userId: string,
    @Param() type: AccountsEnum,
  ): Promise<Partial<any>> {
    return await this.adminService.updateAccountByUserId(userId, type);
  }

  /*---------------------*/

  @ApiOperation({
    summary: 'Current User, "if Authorised", can alter a user by Email',
  })
  @ApiParam({
    name: 'userEmail',
    type: IsEmail(),
    required: true,
  })
  @ApiBody({
    type: UpdateRolesDto,
    enum: RolesEnum,
    isArray: true,
    required: true,
  })
  @Roles([RolesEnum.ADMIN])
  @Patch('users/:userEmail')
  async updateUser(
    @Param('userEmail') userEmail: string,
    @Body() updateDto: UpdateRolesDto,
    @Request() req,
  ): Promise<Partial<UserEntity>> {
    return await this.adminService.updateUserByEmail(userEmail, updateDto);
  }
}

/*---------------------*/
