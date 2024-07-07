import { PickType } from '@nestjs/swagger';

import { BaseUserDto } from '../base.user.dto';

export class UpdateRolesDto extends PickType(BaseUserDto, ['roles']) {}
