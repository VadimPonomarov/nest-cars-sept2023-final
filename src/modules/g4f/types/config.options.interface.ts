import { GptModelsEnum } from '../enums/gpt.models.enum';
import { GptProviders } from '../enums/gpt.providers';

export interface IRetry {
  times: number; //Specify the number of times the fetch operation will execute as a limit.
  condition: (...args: any) => boolean; //Callback function that receives a string as the text for each instance the fetch operation is running. This function should return a boolean.
}
export interface IGptConfigOptions {
  provider: GptProviders; //Choose the provider to use for chat completions.
  model: GptModelsEnum; //Choose the model to use by a provider that supports it
  debug: boolean; //Enable or disable debug mode.
  proxy: string; //Specify a proxy as a URL with a string in the host:port format.
  retry: IRetry; //Execute the fetch operation N times in a row until it finishes or the callback function returns true.
  output: (...args: any) => string; //Callback function that receives a string as the final text response so you can edit it. This function executes after the retry fetch operations. This function should return a string.
  stream: boolean; //Determine if the data should be streamed in parts or not.
  chunkSize: number; //Determine the size of chunks streamed. This only works if the stream option is true and if using retry or condition.
}

export interface IGptTranslationOptions {
  text: string;
  source: 'string'; // language
  target: 'string'; // language
}
