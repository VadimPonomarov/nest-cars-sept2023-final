import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { CarModelEntity } from './car.model.entity';
import { BaseModel } from './models/base.model';

@Unique(['mark', 'modelId'])
@Entity({ name: 'car_marks' })
export class CarMarkEntity extends BaseModel {
  @Column()
  mark: string;

  @Column({ name: 'model_id' })
  modelId: number;

  @ManyToOne(() => CarModelEntity, (entity) => entity.marks)
  @JoinColumn({ name: 'model_id' })
  model: CarModelEntity;
}
