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

@Entity('mdm_products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'product_code', unique: true, length: 50 })
    productCode: string;

    @Column({ name: 'product_name' })
    productName: string;

    @Column({ name: 'category_id', type: 'uuid', nullable: true })
    categoryId: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'unit_of_measure', length: 50 })
    unitOfMeasure: string;

    @Column({ name: 'is_raw_material', default: false })
    isRawMaterial: boolean;

    @Column({ name: 'is_finished_good', default: false })
    isFinishedGood: boolean;

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
