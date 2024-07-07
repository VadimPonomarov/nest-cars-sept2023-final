import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { UserRepository } from '../../repository/services/user.repository';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userRepository: UserRepository,
  ) {
    super({ usernameField: 'email' });
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = await context.switchToHttp().getRequest();
      const _user = await this.userRepository.findOneBy({
        email: request.body.email,
        isActive: true,
      });
      if (!_user) throw new NotFoundException();
      return await super.canActivate(context);
    } catch (e) {
      throw e;
    }
  }
}
