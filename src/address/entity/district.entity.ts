import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DivisionEntity } from './division.entity';
import { UpazilaEntity } from './upazilla.entity';

@Entity('districts')
export class DistrictEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => DivisionEntity, (division) => division.districts, {
    onDelete: 'CASCADE',
  })
  division: DivisionEntity;

  @Column()
  divisionId: number;

  @OneToMany(() => UpazilaEntity, (upazila) => upazila.district)
  upazilas: UpazilaEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
