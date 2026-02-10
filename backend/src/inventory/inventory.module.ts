import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryItem } from './entities/inventory-item.entity';
import { Stock } from './entities/stock.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { StockMovement } from './entities/stock-movement.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InventoryItem,
            Stock,
            PurchaseOrder,
            StockMovement,
        ]),
    ],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [InventoryService],
})
export class InventoryModule { }
