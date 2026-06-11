import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AddressService } from './address.service';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('divisions')
  @ApiOperation({ summary: 'Get all divisions' })
  getDivisions() {
    return this.addressService.getDivisions();
  }

  @Get('divisions/:id/districts')
  @ApiOperation({ summary: 'Get districts by division' })
  getDistricts(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.getDistrictsByDivision(id);
  }

  @Get('districts/:id/upazilas')
  @ApiOperation({ summary: 'Get upazilas by district' })
  getUpazilas(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.getUpazilasByDistrict(id);
  }
}
