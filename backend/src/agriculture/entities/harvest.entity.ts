import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Planting } from './planting.entity';
import { Product } from '../../mdm/entities/product.entity';

@Entity('agri_harvests')
export class Harvest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'planting_id' })
    plantingId: string;

    @ManyToOne(() => Planting, (planting) => planting.harvests)
    @JoinColumn({ name: 'planting_id' })
    planting: Planting;

    @Column({ name: 'harvest_date', type: 'date' })
    harvestDate: Date;

    @Column({ name: 'quantity_harvested', type: 'decimal', precision: 10, scale: 2 })
    quantityHarvested: number;

    @Column({ name: 'quantity_unit', length: 20 })
    quantityUnit: string;

    @Column({ name: 'quality_grade', length: 50, nullable: true })
    qualityGrade: string;

    @Column({ name: 'market_price', type: 'decimal', precision: 15, scale: 2, nullable: true })
    marketPrice: number;

    @Column({ name: 'total_value', type: 'decimal', precision: 15, scale: 2, nullable: true })
    totalValue: number;

    @Column({ name: 'storage_location', length: 100, nullable: true })
    storageLocation: string;

    @Column({ name: 'product_id', nullable: true })
    productId: string;

    @ManyToOne(() => Product, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'transaction_id', nullable: true })
    transactionId: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
