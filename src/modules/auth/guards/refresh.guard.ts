import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ObjectMapMode } from '../../../common/enums/object.mapper.enums';
import { TokensEnum } from '../../../common/enums/tokens.enum';
import { ObjectMapper } from '../../../common/mappers/object.mapper';
import { JwtRegisterRepository } from '../../repository/services/jwt.repository';
import { JwtPayloadDto } from '../dto/jwt.payload.dto';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtRegisterRepository: JwtRegisterRepository,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = await context.switchToHttp().getRequest();
      const token = await request.body.refresh;
      if (!token) return false;
      const isTokenRegistered = await this.jwtRegisterRepository.findOneBy({
        token,
        type: TokensEnum.REFRESH,
        blacklisted: false,
      });
      if (!isTokenRegistered) return false;

      request.user = await ObjectMapper.getMapped<JwtPayloadDto>(
        await this.jwtService.decode(token),
        ['id', 'nikName', 'email', 'roles'],
        ObjectMapMode.PICK,
      );
      await this.jwtRegisterRepository.update({ token }, { blacklisted: true });
      return Boolean(request.user);
    } catch (e) {
      throw e;
    }
  }
}
