import { Injectable, NotAcceptableException } from '@nestjs/common';
import { compact, difference, isEqual, uniq } from 'lodash';

import {
  configService,
  ConfigType,
} from '../../../common/configuration/configuration';
import { AccountsEnum } from '../../../common/enums/accounts.enum';
import { ObjectMapMode } from '../../../common/enums/object.mapper.enums';
import { RolesActionEnum, RolesEnum } from '../../../common/enums/roles.enum';
import { ObjectMapper } from '../../../common/mappers/object.mapper';
import { UserEntity } from '../../db/entities/user.entity';
import { AccountRepository } from '../../repository/services/account.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserWithoutPassDto } from '../dto/user.without.pass.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async setSuperUser(
    id: string,
    secret: string,
  ): Promise<Partial<UserEntity>> {
    if (!isEqual(configService.get<ConfigType['jwt']>('jwt').secret, secret))
      throw new NotAcceptableException('Secret is wrong !!!');

    const _user = await this.userRepository.save({
      id,
      isStaff: true,
      isAdmin: true,
      roles: JSON.stringify([
        RolesEnum.ADMIN,
        RolesEnum.MANAGER,
        RolesEnum.BUYER,
        RolesEnum.SELLER,
      ]),
    });

    return await ObjectMapper.getMapped<typeof _user>(_user, ['password']);
  }

  public async updateUserByEmail(
    email: string,
    dto: Partial<UserWithoutPassDto>,
  ): Promise<Partial<UserEntity>> {
    await this.userRepository.update({ email }, { ...dto });
    const _user = await this.userRepository.findOneBy({ email });
    return await ObjectMapper.getMapped<typeof _user>(
      _user,
      ['id', 'nikName', 'email', 'isStaff', 'isActive', 'roles'],
      ObjectMapMode.PICK,
    );
  }

  public async updateAccountByUserId(
    userId: string,
    accountType: AccountsEnum,
  ): Promise<Partial<UserEntity>> {
    const _user = await this.userRepository.findOne({ where: { id: userId } });
    const _account = await this.accountRepository.findOneOrFail({
      where: { user: _user },
    });
    _account.accountType = accountType;
    _user.account = _account;
    await this.userRepository.save(_user);
    return await ObjectMapper.getMapped<typeof _user>(
      _user,
      ['id', 'nikName', 'email', 'isStaff', 'isActive', 'roles', 'account'],
      ObjectMapMode.PICK,
    );
  }

  public async grantRoleByEmail(
    email: string,
    roles: RolesEnum[],
    action: RolesActionEnum,
  ): Promise<Partial<UserEntity>> {
    const { roles: _roles } = await this.userRepository.findOneOrFail({
      where: { email },
    });
    switch (action) {
      case RolesActionEnum.GRANT:
        await this.userRepository.update(
          { email },
          {
            roles: JSON.stringify(
              compact(
                uniq([
                  ...JSON.parse(_roles),
                  ...difference(roles, [RolesEnum.ADMIN]),
                ]),
              ),
            ),
          },
        );
        break;
      default:
        await this.userRepository.update(
          { email },
          {
            roles: JSON.stringify(
              compact(
                difference(
                  JSON.parse(_roles),
                  difference(roles, [RolesEnum.ADMIN]),
                ),
              ),
            ),
          },
        );
    }

    const _userUpdated = await this.userRepository.findOneBy({ email });
    return await ObjectMapper.getMapped<typeof _userUpdated>(
      _userUpdated,
      ['id', 'nikName', 'email', 'isStaff', 'isActive', 'roles'],
      ObjectMapMode.PICK,
    );
  }
}
