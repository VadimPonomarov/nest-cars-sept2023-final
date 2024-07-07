import {
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';

import {
  configService,
  ConfigType,
} from '../../common/configuration/configuration';
import { ObjectMapMode } from '../../common/enums/object.mapper.enums';
import { TokensEnum } from '../../common/enums/tokens.enum';
import { ObjectMapper } from '../../common/mappers/object.mapper';
import { JwtPairType, JwtTokenType } from '../../common/types/jwt.types';
import { UserEntity } from '../db/entities/user.entity';
import { JwtRegisterRepository } from '../repository/services/jwt.repository';
import { UserService } from '../user/user.service';
import { JwtPayloadDto } from './dto/jwt.payload.dto';
import { LoginDto } from './dto/req/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService,
    private jwtService: JwtService,
    private readonly jwtRegisterRepository: JwtRegisterRepository,
  ) {}

  public async validateUser(
    credentials: LoginDto,
  ): Promise<Partial<UserEntity>> {
    const user = await this.userService.getOneByEmailOrFail(credentials.email);
    if (!compareSync(credentials.password, user.password))
      throw new NotAcceptableException('Check credentials');
    return await ObjectMapper.getMapped<typeof user>(
      user,
      ['id', 'nikName', 'email', 'roles'],
      ObjectMapMode.PICK,
    );
  }

  async login(payload: JwtPayloadDto): Promise<JwtPairType> {
    return {
      ...(await this.createJwt(payload, TokensEnum.ACCESS)),
      ...(await this.createJwt(payload, TokensEnum.REFRESH)),
    } as unknown as JwtPairType;
  }

  async createJwt(
    payload: JwtPayloadDto,
    type: TokensEnum,
  ): Promise<JwtTokenType> {
    const config = await configService.get<ConfigType['jwt']>('jwt');
    const expiresIn = config.expiresIn(TokensEnum.ACCESS);
    const token = this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn,
    });
    await this.jwtRegisterRepository.save(
      this.jwtRegisterRepository.create({ type, token }),
    );
    return { [type]: token } as JwtTokenType;
  }

  async blacklistJwt(token: string, type: TokensEnum): Promise<void> {
    await this.jwtRegisterRepository.update(
      { token, type },
      { blacklisted: true },
    );
  }
}
