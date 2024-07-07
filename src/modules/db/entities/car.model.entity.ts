import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { CarMarkEntity } from './car.mark.entity';
import { CarTypeEntity } from './car.type.entity';
import { BaseModel } from './models/base.model';

@Entity({ name: 'car_models' })
export class CarModelEntity extends BaseModel {
  @Column({ unique: true })
  model: string;

  @OneToMany(() => CarMarkEntity, (entity) => entity.model)
  marks: CarMarkEntity[];

  @ManyToMany(() => CarTypeEntity, (entity) => entity.models)
  @JoinTable({
    name: 'models_types',
    joinColumn: {
      name: 'models_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'models_types_models_id',
    },
    inverseJoinColumn: {
      name: 'type_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'models_types_type_id',
    },
  })
  types: CarTypeEntity[];
}
