import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('stock_movements')
export class StockMovement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'item_id' })
    itemId: string;

    @ManyToOne(() => InventoryItem, (item) => item.movements)
    @JoinColumn({ name: 'item_id' })
    item: InventoryItem;

    @Column({ name: 'movement_type', length: 50 })
    movementType: string;

    @Column({ name: 'movement_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    movementDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column({ length: 100, nullable: true })
    location: string;

    @Column({ name: 'reference_type', length: 50, nullable: true })
    referenceType: string;

    @Column({ name: 'reference_id', nullable: true })
    referenceId: string;

    @Column({ name: 'cost_per_unit', type: 'decimal', precision: 15, scale: 2, nullable: true })
    costPerUnit: number;

    @Column({ name: 'total_value', type: 'decimal', precision: 15, scale: 2, nullable: true })
    totalValue: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
