import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Location } from './location.entity';
import { InventoryItem } from '../../inventory/entities/inventory-item.entity';

export enum TransferStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

@Entity('warehouse_transfers')
export class StockTransfer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'transfer_number', length: 50, unique: true })
    transferNumber: string;

    @Column({ name: 'item_id' })
    itemId: string;

    @ManyToOne(() => InventoryItem)
    @JoinColumn({ name: 'item_id' })
    item: InventoryItem;

    @Column({ name: 'from_location_id', nullable: true }) // Null if incoming from external source (initial load)
    fromLocationId: string;

    @ManyToOne(() => Location)
    @JoinColumn({ name: 'from_location_id' })
    fromLocation: Location;

    @Column({ name: 'to_location_id' })
    toLocationId: string;

    @ManyToOne(() => Location)
    @JoinColumn({ name: 'to_location_id' })
    toLocation: Location;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column({ type: 'enum', enum: TransferStatus, default: TransferStatus.PENDING })
    status: TransferStatus;

    @Column({ name: 'transferred_by', nullable: true })
    transferredBy: string; // User ID

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'transferred_at', type: 'timestamp', nullable: true })
    transferredAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
