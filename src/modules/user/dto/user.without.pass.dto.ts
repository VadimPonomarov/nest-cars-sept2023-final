import { OmitType } from '@nestjs/swagger';

import { BaseUserDto } from './base.user.dto';

export class UserWithoutPassDto extends OmitType(BaseUserDto, [
  'id',
  'email',
  'isAdmin',
  'password',
]) {}
