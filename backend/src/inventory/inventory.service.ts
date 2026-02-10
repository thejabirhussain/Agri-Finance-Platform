import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { Stock } from './entities/stock.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { StockMovement } from './entities/stock-movement.entity';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(InventoryItem)
        private itemRepository: Repository<InventoryItem>,
        @InjectRepository(Stock)
        private stockRepository: Repository<Stock>,
        @InjectRepository(PurchaseOrder)
        private poRepository: Repository<PurchaseOrder>,
        @InjectRepository(StockMovement)
        private movementRepository: Repository<StockMovement>,
    ) { }

    // ===== INVENTORY ITEMS =====
    async findAllItems() {
        return this.itemRepository.find({ where: { isActive: true } });
    }

    async findItemById(id: string) {
        const item = await this.itemRepository.findOne({ where: { id } });
        if (!item) throw new NotFoundException(`Item ${id} not found`);
        return item;
    }

    async createItem(data: Partial<InventoryItem>) {
        const item = this.itemRepository.create(data);
        const saved = await this.itemRepository.save(item);

        // Initialize stock for new item
        await this.stockRepository.save({
            itemId: saved.id,
            location: 'Main Warehouse',
            quantityOnHand: 0,
            quantityReserved: 0,
            quantityAvailable: 0,
        });

        return saved;
    }

    // ===== STOCK MANAGEMENT =====
    async getStockLevels() {
        return this.stockRepository.find({ relations: ['item'] });
    }

    async getStockByItem(itemId: string) {
        return this.stockRepository.find({ where: { itemId }, relations: ['item'] });
    }

    async updateStock(itemId: string, location: string, quantity: number, movementType: string) {
        const stock = await this.stockRepository.findOne({ where: { itemId, location } });

        if (!stock) {
            throw new NotFoundException(`Stock not found for item ${itemId} at ${location}`);
        }

        // Update quantity
        stock.quantityOnHand = Number(stock.quantityOnHand) + Number(quantity);
        await this.stockRepository.save(stock);

        // Record movement
        await this.recordMovement({
            itemId,
            movementType,
            quantity,
            location,
            referenceType: 'ADJUSTMENT',
        });

        return stock;
    }

    // ===== PURCHASE ORDERS =====
    async createPurchaseOrder(data: Partial<PurchaseOrder>) {
        const po = this.poRepository.create(data);
        return this.poRepository.save(po);
    }

    async findAllPurchaseOrders() {
        return this.poRepository.find({ relations: ['vendor'] });
    }

    async findPOById(id: string) {
        const po = await this.poRepository.findOne({
            where: { id },
            relations: ['vendor'],
        });
        if (!po) throw new NotFoundException(`PO ${id} not found`);
        return po;
    }

    async updatePOStatus(id: string, status: string) {
        await this.poRepository.update(id, { status });
        return this.findPOById(id);
    }

    // ===== STOCK MOVEMENTS =====
    async recordMovement(data: Partial<StockMovement>) {
        const movement = this.movementRepository.create(data);
        return this.movementRepository.save(movement);
    }

    async getMovements(itemId?: string) {
        const where = itemId ? { itemId } : {};
        return this.movementRepository.find({
            where,
            relations: ['item'],
            order: { movementDate: 'DESC' },
        });
    }

    // ===== DASHBOARD =====
    async getDashboard() {
        const totalItems = await this.itemRepository.count({ where: { isActive: true } });

        const stockValue = await this.stockRepository
            .createQueryBuilder('stock')
            .leftJoin('stock.item', 'item')
            .select('SUM(stock.quantity_on_hand * item.unit_cost)', 'total')
            .getRawOne();

        const lowStockItems = await this.stockRepository
            .createQueryBuilder('stock')
            .leftJoin('stock.item', 'item')
            .where('stock.quantity_available <= item.reorder_level')
            .getCount();

        const activePOs = await this.poRepository.count({
            where: { status: 'SUBMITTED' },
        });

        return {
            totalItems,
            totalStockValue: Number(stockValue?.total || 0),
            lowStockItems,
            activePurchaseOrders: activePOs,
        };
    }
}
