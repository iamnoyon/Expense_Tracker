import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DivisionEntity } from './entity/division.entity';
import { DistrictEntity } from './entity/district.entity';
import { UpazilaEntity } from './entity/upazilla.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(DivisionEntity)
    private readonly divisionRepo: Repository<DivisionEntity>,
    @InjectRepository(DistrictEntity)
    private readonly districtRepo: Repository<DistrictEntity>,
    @InjectRepository(UpazilaEntity)
    private readonly upazilaRepo: Repository<UpazilaEntity>,
  ) {}

  async getDivisions() {
    return this.divisionRepo.find({ order: { name: 'ASC' } });
  }

  async getDistrictsByDivision(divisionId: number) {
    return this.districtRepo.find({
      where: { divisionId },
      order: { name: 'ASC' },
    });
  }

  async getUpazilasByDistrict(districtId: number) {
    return this.upazilaRepo.find({
      where: { districtId },
      order: { name: 'ASC' },
    });
  }
}
