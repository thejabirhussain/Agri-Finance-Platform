import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

@Entity('inventory_stock')
export class Stock {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'item_id' })
    itemId: string;

    @ManyToOne(() => InventoryItem, (item) => item.stock)
    @JoinColumn({ name: 'item_id' })
    item: InventoryItem;

    @Column({ length: 100, default: 'Main Warehouse' })
    location: string;

    @Column({ name: 'quantity_on_hand', type: 'decimal', precision: 10, scale: 2, default: 0 })
    quantityOnHand: number;

    @Column({ name: 'quantity_reserved', type: 'decimal', precision: 10, scale: 2, default: 0 })
    quantityReserved: number;

    @Column({ name: 'quantity_available', type: 'decimal', precision: 10, scale: 2, default: 0 })
    quantityAvailable: number;

    @Column({ name: 'last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastUpdated: Date;
}
