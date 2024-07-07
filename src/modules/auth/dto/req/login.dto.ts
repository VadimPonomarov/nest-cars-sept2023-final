import { PickType } from '@nestjs/swagger';

import { BaseUserDto } from '../../../user/dto/base.user.dto';

export class LoginDto extends PickType(BaseUserDto, ['email', 'password']) {}
