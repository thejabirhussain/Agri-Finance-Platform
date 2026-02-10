import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Location } from './location.entity';
import { CostCenter } from './cost-center.entity';
import { OperationUnit } from './operation-unit.entity';

@Entity('mdm_assets')
export class Asset {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'asset_code', unique: true, length: 50 })
    assetCode: string;

    @Column({ name: 'asset_name' })
    assetName: string;

    @Column({ name: 'asset_type' })
    assetType: 'LAND' | 'LIVESTOCK' | 'EQUIPMENT' | 'VEHICLE' | 'BUILDING' | 'OTHER';

    @Column({ name: 'category_id', type: 'uuid', nullable: true })
    categoryId: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'location_id', type: 'uuid', nullable: true })
    locationId: string;

    @ManyToOne(() => Location)
    @JoinColumn({ name: 'location_id' })
    location: Location;

    @Column({ name: 'cost_center_id', type: 'uuid', nullable: true })
    costCenterId: string;

    @ManyToOne(() => CostCenter)
    @JoinColumn({ name: 'cost_center_id' })
    costCenter: CostCenter;

    @Column({ name: 'operation_unit_id', type: 'uuid', nullable: true })
    operationUnitId: string;

    @ManyToOne(() => OperationUnit)
    @JoinColumn({ name: 'operation_unit_id' })
    operationUnit: OperationUnit;

    @Column({ name: 'purchase_date', type: 'date', nullable: true })
    purchaseDate: Date;

    @Column({ name: 'purchase_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
    purchaseValue: number;

    @Column({ name: 'current_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
    currentValue: number;

    @Column({ name: 'depreciation_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
    depreciationRate: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 1 })
    quantity: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'created_by', type: 'uuid', nullable: true })
    createdBy: string;

    @Column({ name: 'updated_by', type: 'uuid', nullable: true })
    updatedBy: string;
}
