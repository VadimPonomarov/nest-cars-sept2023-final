import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn({ select: false })
  created?: Date;

  @UpdateDateColumn({ select: false })
  updated?: Date;
}
