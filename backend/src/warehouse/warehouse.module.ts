import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { StockTransfer } from './entities/stock-transfer.entity';
import { LocationService } from './location.service';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';

import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Location,
            StockTransfer
        ]),
        InventoryModule
    ],
    controllers: [WarehouseController],
    providers: [LocationService, WarehouseService],
    exports: [LocationService, WarehouseService]
})
export class WarehouseModule { }
