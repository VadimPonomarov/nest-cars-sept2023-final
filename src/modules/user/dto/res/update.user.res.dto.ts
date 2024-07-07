import { PickType } from '@nestjs/swagger';

import { BaseUserDto } from '../base.user.dto';

export class UpdateUserResDto extends PickType(BaseUserDto, [
  'id',
  'nikName',
  'email',
  'isStaff',
  'isActive',
  'profile',
  'roles',
  'created',
  'updated',
]) {}
