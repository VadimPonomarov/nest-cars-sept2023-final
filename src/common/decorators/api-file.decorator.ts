import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export const ApiFile = (
  fileName: string,
  isArray: boolean = true,
  isRequired: boolean = false,
): MethodDecorator => {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        required: isRequired ? [fileName] : [],
        properties: {
          [fileName]: isArray
            ? {
              type: 'array',
              items: { type: 'string', format: 'binary' },
            } : { type: 'string', format: 'binary' },
        }
      },
    }),
  );
};