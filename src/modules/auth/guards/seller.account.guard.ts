import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { intersection } from 'lodash';

import { AccountsEnum } from '../../../common/enums/accounts.enum';
import { AdsService } from '../../ads/ads.service';
import { UserService } from '../../user/user.service';
import { JwtPayloadDto } from '../dto/jwt.payload.dto';

@Injectable()
export class SellerAccountGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly adsService: AdsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const user: JwtPayloadDto = request.user;
      if (!user)
        throw new NotAcceptableException(
          'Authorisation: Bearer JWT is required',
        );
      if ((await this.adsService.getNonActiveAdsNumberByUserId(user.id)) >= 3)
        return false;
      const _isAccountPremium =
        (await this.userService.getUserByEmail(user.email)).account
          .accountType === AccountsEnum.PREMIUM;
      if (_isAccountPremium) return true;
      return !(await this.adsService.getActiveAdsNumberByUserId(user.id));
    } catch (e) {
      throw e;
    }
  }

  matchRoles(...args: string[][]): boolean {
    return !!intersection(...args).length;
  }
}
