import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import {
  configService,
  ConfigType,
} from '../../../common/configuration/configuration';
import { ObjectMapMode } from '../../../common/enums/object.mapper.enums';
import { ObjectMapper } from '../../../common/mappers/object.mapper';
import { UserService } from '../../user/user.service';
import { JwtPayloadDto } from '../dto/jwt.payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<ConfigType['jwt']>('jwt').secret,
    });
  }

  async validate(payload: any): Promise<Partial<JwtPayloadDto>> {
    await this.userService.getOneByEmailOrFail(payload.email);
    return await ObjectMapper.getMapped<typeof payload>(
      payload,
      ['id', 'nikName', 'email', 'isStaff', 'roles'],
      ObjectMapMode.PICK,
    );
  }
}
