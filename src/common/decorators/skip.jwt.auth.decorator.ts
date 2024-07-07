import { SetMetadata } from '@nestjs/common';

import { SKIP_AUTH } from '../constants/app.main.constants';

export const SkipJwtAuth = () => SetMetadata(SKIP_AUTH, true);
