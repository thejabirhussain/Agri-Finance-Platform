import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockTransfer, TransferStatus } from './entities/stock-transfer.entity';
import { Location } from './entities/location.entity';

import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(StockTransfer)
        private transferRepository: Repository<StockTransfer>,
        private inventoryService: InventoryService,
        private dataSource: DataSource,
    ) { }

    async initiateTransfer(
        itemId: string,
        fromLocationId: string,
        toLocationId: string,
        quantity: number,
        userId: string
    ): Promise<StockTransfer> {
        // Basic validation
        if (quantity <= 0) {
            throw new BadRequestException('Quantity must be greater than zero');
        }

        // Create transfer record
        const transfer = this.transferRepository.create({
            itemId,
            fromLocationId,
            toLocationId,
            quantity,
            status: TransferStatus.PENDING,
            transferredBy: userId,
            transferNumber: `TRF-${Date.now()}` // Simple generation for now
        });

        return this.transferRepository.save(transfer);
    }

    async completeTransfer(transferId: string): Promise<StockTransfer> {
        const transfer = await this.transferRepository.findOne({ where: { id: transferId } });
        if (!transfer) throw new BadRequestException('Transfer not found');
        if (transfer.status !== TransferStatus.PENDING) throw new BadRequestException('Transfer already processed');

        // Transactional update
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Deduct from source location
            await this.inventoryService.updateStock(
                transfer.itemId,
                transfer.fromLocationId, // Assuming this ID maps to a location string/name for now, or need to update Inventory logic
                -transfer.quantity,
                'TRANSFER_OUT'
            );

            // Add to destination location
            await this.inventoryService.updateStock(
                transfer.itemId,
                transfer.toLocationId,
                transfer.quantity,
                'TRANSFER_IN'
            );

            transfer.status = TransferStatus.COMPLETED;
            transfer.transferredAt = new Date();

            const savedTransfer = await queryRunner.manager.save(transfer);

            await queryRunner.commitTransaction();
            return savedTransfer;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllTransfers(): Promise<StockTransfer[]> {
        return this.transferRepository.find({
            relations: ['item', 'fromLocation', 'toLocation'],
            order: { createdAt: 'DESC' }
        });
    }
}
