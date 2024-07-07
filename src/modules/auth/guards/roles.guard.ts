import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { compact, intersection } from 'lodash';

import { Roles } from '../../../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();

      const roles = this.reflector.get(Roles, context.getHandler());
      if (!roles) {
        return true;
      }
      const user = request.user;
      if (!user)
        throw new NotAcceptableException(
          'Authorisation: Bearer JWT is required',
        );
      if (user.isAdmin) return true;
      return this.matchRoles(roles, compact(JSON.parse(user.roles)));
    } catch (e) {
      throw e;
    }
  }

  matchRoles(...args: string[][]): boolean {
    return !!intersection(...args).length;
  }
}
