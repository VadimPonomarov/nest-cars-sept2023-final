import { PickType } from '@nestjs/swagger';

import { BaseUserDto } from '../../user/dto/base.user.dto';

export class JwtPayloadDto extends PickType(BaseUserDto, [
  'id',
  'nikName',
  'email',
  'roles',
]) {}
