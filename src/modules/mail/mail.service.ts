import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';

import {
  configService,
  ConfigType,
} from '../../common/configuration/configuration';
import { emailTemplateConstant } from './constants/sendGrid.constants';
import { EmailTypeEnum } from './enums/sendGrid.enums';
import { EmailTypeToPayloadType } from './types/sendGrid.types';

@Injectable()
export class MailService {
  private readonly config =
    configService.get<ConfigType['sendGrid']>('sendGrid');
  constructor() {
    SendGrid.setApiKey(this.config.SEND_GRID_API_KEY);
  }
  public async sendByType<T extends EmailTypeEnum>(
    to: string,
    type: T,
    dynamicTemplateData: EmailTypeToPayloadType[T],
  ): Promise<void> {
    const templateId = emailTemplateConstant[type].templateId;
    await this.send({
      from: this.config.SENDGRID_FROM_EMAIL,
      to,
      templateId,
      dynamicTemplateData,
    });
  }

  public async send(email: MailDataRequired): Promise<void> {
    await SendGrid.send(email);
  }
}
