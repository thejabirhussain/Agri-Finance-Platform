import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { LocationService } from './location.service';
import { WarehouseService } from './warehouse.service';
import { Location } from './entities/location.entity';

@Controller('warehouse')
export class WarehouseController {
    constructor(
        private readonly locationService: LocationService,
        private readonly warehouseService: WarehouseService,
    ) { }

    // Locations
    @Post('locations')
    createLocation(@Body() createLocationDto: Partial<Location>) {
        return this.locationService.create(createLocationDto);
    }

    @Get('locations')
    findAllLocations() {
        return this.locationService.findAll();
    }

    @Get('locations/roots')
    findRootLocations() {
        return this.locationService.findRoots();
    }

    @Get('locations/:id')
    findOneLocation(@Param('id') id: string) {
        return this.locationService.findOne(id);
    }

    @Patch('locations/:id')
    updateLocation(@Param('id') id: string, @Body() updateLocationDto: Partial<Location>) {
        return this.locationService.update(id, updateLocationDto);
    }

    @Delete('locations/:id')
    removeLocation(@Param('id') id: string) {
        return this.locationService.remove(id);
    }

    // Stock Transfers
    @Post('transfers')
    initiateTransfer(
        @Body('itemId') itemId: string,
        @Body('fromLocationId') fromLocationId: string,
        @Body('toLocationId') toLocationId: string,
        @Body('quantity') quantity: number,
        @Body('userId') userId: string,
    ) {
        return this.warehouseService.initiateTransfer(itemId, fromLocationId, toLocationId, quantity, userId);
    }

    @Post('transfers/:id/complete')
    completeTransfer(@Param('id') id: string) {
        return this.warehouseService.completeTransfer(id);
    }

    @Get('transfers')
    findAllTransfers() {
        return this.warehouseService.findAllTransfers();
    }
}
