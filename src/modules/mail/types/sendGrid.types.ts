import { EmailTypeEnum } from '../../../common/enums/mail.enum';
import { PickRequired } from '../../../common/types/mail.types';

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
