import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Field } from './field.entity';
import { Crop } from './crop.entity';
import { Harvest } from './harvest.entity';
import { Expense } from './expense.entity';
import { CostCenter } from '../../mdm/entities/cost-center.entity';

@Entity('agri_plantings')
export class Planting {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'field_id' })
    fieldId: string;

    @ManyToOne(() => Field, (field) => field.plantings)
    @JoinColumn({ name: 'field_id' })
    field: Field;

    @Column({ name: 'crop_id' })
    cropId: string;

    @ManyToOne(() => Crop, (crop) => crop.plantings)
    @JoinColumn({ name: 'crop_id' })
    crop: Crop;

    @Column({ name: 'planting_date', type: 'date' })
    plantingDate: Date;

    @Column({ name: 'expected_harvest_date', type: 'date', nullable: true })
    expectedHarvestDate: Date;

    @Column({ name: 'area_planted', type: 'decimal', precision: 10, scale: 2, nullable: true })
    areaPlanted: number;

    @Column({ name: 'seed_quantity', type: 'decimal', precision: 10, scale: 2, nullable: true })
    seedQuantity: number;

    @Column({ name: 'seed_unit', length: 20, nullable: true })
    seedUnit: string;

    @Column({ name: 'planting_method', length: 50, nullable: true })
    plantingMethod: string;

    @Column({ name: 'cost_center_id', nullable: true })
    costCenterId: string;

    @ManyToOne(() => CostCenter, { nullable: true })
    @JoinColumn({ name: 'cost_center_id' })
    costCenter: CostCenter;

    @Column({ length: 50, default: 'ACTIVE' })
    status: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Harvest, (harvest) => harvest.planting)
    harvests: Harvest[];

    @OneToMany(() => Expense, (expense) => expense.planting)
    expenses: Expense[];
}
