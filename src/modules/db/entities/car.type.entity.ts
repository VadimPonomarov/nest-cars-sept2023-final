import { Column, Entity, ManyToMany } from 'typeorm';

import { CarModelEntity } from './car.model.entity';
import { BaseModel } from './models/base.model';

@Entity({ name: 'car_types' })
export class CarTypeEntity extends BaseModel {
  @Column({ unique: true })
  type: string;

  @ManyToMany(() => CarModelEntity, (entity) => entity.types)
  models: CarModelEntity[];
}
