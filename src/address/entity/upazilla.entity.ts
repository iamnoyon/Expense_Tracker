import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DistrictEntity } from './district.entity';

@Entity('upazilas')
export class UpazilaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => DistrictEntity, (district) => district.upazilas, {
    onDelete: 'CASCADE',
  })
  district: DistrictEntity;

  @Column()
  districtId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
