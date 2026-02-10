import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Stock } from './stock.entity';
import { StockMovement } from './stock-movement.entity';

@Entity('inventory_items')
export class InventoryItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'item_code', unique: true, length: 50 })
    itemCode: string;

    @Column({ name: 'item_name', length: 200 })
    itemName: string;

    @Column({ length: 100, nullable: true })
    category: string;

    @Column({ name: 'unit_of_measure', length: 20 })
    unitOfMeasure: string;

    @Column({ name: 'reorder_level', type: 'decimal', precision: 10, scale: 2, default: 0 })
    reorderLevel: number;

    @Column({ name: 'reorder_quantity', type: 'decimal', precision: 10, scale: 2, default: 0 })
    reorderQuantity: number;

    @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 2, default: 0 })
    unitCost: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Stock, (stock) => stock.item)
    stock: Stock[];

    @OneToMany(() => StockMovement, (movement) => movement.item)
    movements: StockMovement[];
}
