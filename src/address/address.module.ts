import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisionEntity } from './entity/division.entity';
import { DistrictEntity } from './entity/district.entity';
import { UpazilaEntity } from './entity/upazilla.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DivisionEntity, DistrictEntity, UpazilaEntity]),
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [TypeOrmModule], // IMPORTANT (this allows other modules to use it)
})
export class AddressModule {}
