import { Injectable } from '@nestjs/common';
import { G4F } from 'g4f';

import { GptTasks } from './constants/gpt.tasks';
import { GptModelsEnum } from './enums/gpt.models.enum';
import { IGptConfigOptions } from './types/config.options.interface';
import { IMessage } from './types/message.interface';

@Injectable()
export class GptService {
  g4f: G4F = new G4F();
  messages: IMessage[] = [];
  options: Partial<IGptConfigOptions> = {
    model: GptModelsEnum.gpt_4,
    debug: false,
    retry: {
      times: 3,
      condition: (text) => {
        const words = text.split(' ');
        return words.length > 10;
      },
    },
    output: (text) => {
      return text;
    },
  };

  public async addTask(content: string): Promise<void> {
    this.messages = [
      {
        role: 'user',
        content: content,
      },
    ];
  }

  public async chat(): Promise<string> {
    return await this.g4f.chatCompletion(this.messages);
  }
}
