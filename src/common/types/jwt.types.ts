import { TokensEnum } from '../enums/tokens.enum';

export type JwtTokenType = Record<TokensEnum, string>;

export type JwtPairType = {
  [TokensEnum.ACCESS]: string;
  [TokensEnum.REFRESH]: string;
};
