import { EmailTypeEnum } from '../enums/mail.enum';

export interface MailContent {
  type: string;
  value: string;
}
export type PickRequired<T, K extends keyof T> = {
  [P in K]-?: T[P];
};

export type EmailCombinedPayloadType = {
  name?: string;
  frontUrl?: string;
  actionToken?: string;
  link?: string;
  hash?: string;
};

export type EmailTypeToPayloadType = {
  [EmailTypeEnum.CONFIRM_EMAIL]: PickRequired<EmailCombinedPayloadType, 'link'>;
  [EmailTypeEnum.RESET_PASSWORD]: PickRequired<
    EmailCombinedPayloadType,
    'link'
  >;
  [EmailTypeEnum.DELETE_ACCOUNT]: PickRequired<
    EmailCombinedPayloadType,
    'frontUrl'
  >;
  [EmailTypeEnum.LOGOUT]: PickRequired<EmailCombinedPayloadType, 'name'>;
};
