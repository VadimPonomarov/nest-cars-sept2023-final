import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { hashSync } from 'bcryptjs';

import { ObjectMapMode } from '../../common/enums/object.mapper.enums';
import { TokensEnum } from '../../common/enums/tokens.enum';
import { ObjectMapper } from '../../common/mappers/object.mapper';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../db/entities/user.entity';
import { EmailTypeEnum } from '../mail/enums/sendGrid.enums';
import { createLinkHelper } from '../mail/helpers/create.link.helper';
import { MailService } from '../mail/mail.service';
import { AccountRepository } from '../repository/services/account.repository';
import { UserRepository } from '../repository/services/user.repository';
import { CreateUserDto } from './dto/req/create.user.dto';
import { UpdateUserDto } from './dto/req/update.user.dto';
import { CreateUserResDto } from './dto/res/create.user.res.dto';

@Injectable()
export class UserService {
  private confirmUrl = '/api/users/activate/';

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService,
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly mailService: MailService,
  ) {}

  public async create(dto: CreateUserDto): Promise<CreateUserResDto> {
    await this.isEmailUniqueOrThrow(dto.email);
    const _user = this.userRepository.create({
      ...dto,
      password: await this.getHashed(dto.password),
    });
    const account = this.accountRepository.create();
    _user.account = account;
    await this.accountRepository.save(account);
    await this.userRepository.save(_user);
    const activateToken = await this.authService.createJwt(
      { email: _user.email },
      TokensEnum.ACTIVATE,
    );
    const link = await createLinkHelper({
      url: this.confirmUrl,
      token: activateToken.activate,
    });
    await this.mailService.sendByType(
      _user.email,
      EmailTypeEnum.CONFIRM_EMAIL,
      {
        link,
      },
    );
    return (await ObjectMapper.getMapped<typeof _user>(_user, [
      'password',
    ])) as CreateUserResDto;
  }

  public async update(
    dto: Partial<UpdateUserDto>,
  ): Promise<Partial<UserEntity>> {
    await this.userRepository.update({ email: dto.email }, dto);
    const _user = await this.getOneByEmailOrFail(dto.email);
    return await ObjectMapper.getMapped<UserEntity>(
      _user,
      ['password'],
      ObjectMapMode.OMIT,
    );
  }

  public async activate(email: string): Promise<void> {
    await this.userRepository.update({ email }, { isActive: true });
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    if (await this.userRepository.findOneBy({ email })) {
      throw new ConflictException('Email is already taken');
    }
  }

  public async getHashed(data: string): Promise<string> {
    return hashSync(data);
  }

  public async getOneByEmailOrFail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail({
      where: { email, isActive: true },
    });
  }

  public async getUserByEmail(email: string): Promise<Partial<UserEntity>> {
    return await this.userRepository.findOneOrFail({
      where: { email },
      select: {
        id: true,
        nikName: true,
        email: true,
        isStaff: true,
        isAdmin: true,
        roles: true,
        isActive: true,
        account: { accountType: true },
      },
      relations: { account: true },
    });
  }
}
