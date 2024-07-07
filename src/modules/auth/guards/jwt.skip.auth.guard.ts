import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SKIP_AUTH } from '../../../common/constants/app.main.constants';
import { TokensEnum } from '../../../common/enums/tokens.enum';
import { JwtRegisterRepository } from '../../repository/services/jwt.repository';
import { JwtAuthGuard } from './jwt.auth.guard';

@Injectable()
export class JwtSkipAuthGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    protected readonly reflector: Reflector,
    private readonly jwtRegisterRepository: JwtRegisterRepository,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): any {
    try {
      const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (skipAuth) return true;
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.replace('Bearer ', '');
      const isTokenRegistered = this.jwtRegisterRepository.findOneBy({
        token,
        type: TokensEnum.ACCESS,
      });
      if (!isTokenRegistered) return false;

      return super.canActivate(context);
    } catch (e) {
      throw e;
    }
  }
}
