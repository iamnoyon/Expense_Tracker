import { DistrictEntity } from 'src/address/entity/district.entity';
import { DivisionEntity } from 'src/address/entity/division.entity';
import { UpazilaEntity } from 'src/address/entity/upazilla.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  profilePhoto: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // 🌍 RELATIONS (BEST PRACTICE)
  @ManyToOne(() => DivisionEntity, { nullable: true })
  division: DivisionEntity;

  @Column({ nullable: true })
  divisionId: number;

  @ManyToOne(() => DistrictEntity, { nullable: true })
  district: DistrictEntity;

  @Column({ nullable: true })
  districtId: number;

  @ManyToOne(() => UpazilaEntity, { nullable: true })
  upazila: UpazilaEntity;

  @Column({ nullable: true })
  upazilaId: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
