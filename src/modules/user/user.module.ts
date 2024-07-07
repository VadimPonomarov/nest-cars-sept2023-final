import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { LoggingModule } from '../logging/logging.module';
import { MailModule } from '../mail/mail.module';
import { RepositoryModule } from '../repository/repository.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    RepositoryModule,
    MailModule,
    forwardRef(() => AuthModule),
    DbModule,
    LoggingModule,
  ],
  controllers: [UserController, AdminController],
  providers: [UserService, AdminService],
  exports: [UserService, AdminService],
})
export class UserModule {}
