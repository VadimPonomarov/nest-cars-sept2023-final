import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetSuperAdminDto {
  @ApiProperty({
    description: 'JWT_SECRET',
    example: 'OwMbqy_-Fo-mwsxg3r58vzM28SUKfk0Q',
  })
  @IsString()
  secret: string;
}
