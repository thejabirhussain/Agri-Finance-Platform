import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get('items')
    findAllItems() {
        return this.inventoryService.findAllItems();
    }

    @Post('items')
    createItem(@Body() data: any) {
        return this.inventoryService.createItem(data);
    }

    @Get('stock')
    getStockLevels() {
        return this.inventoryService.getStockLevels();
    }

    @Post('stock/update')
    updateStock(@Body() data: { itemId: string; location: string; quantity: number; movementType: string }) {
        return this.inventoryService.updateStock(data.itemId, data.location, data.quantity, data.movementType);
    }

    @Post('purchase-orders')
    createPurchaseOrder(@Body() data: any) {
        return this.inventoryService.createPurchaseOrder(data);
    }

    @Get('purchase-orders')
    findAllPurchaseOrders() {
        return this.inventoryService.findAllPurchaseOrders();
    }

    @Put('purchase-orders/:id/status')
    updatePOStatus(@Param('id') id: string, @Body() data: { status: string }) {
        return this.inventoryService.updatePOStatus(id, data.status);
    }

    @Get('movements')
    getMovements() {
        return this.inventoryService.getMovements();
    }

    @Get('dashboard')
    getDashboard() {
        return this.inventoryService.getDashboard();
    }
}
