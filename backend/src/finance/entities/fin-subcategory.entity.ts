import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { FinCategory } from './fin-category.entity';

@Entity('fin_subcategories')
export class FinSubcategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'subcategory_code', unique: true, length: 50 })
    subcategoryCode: string;

    @Column({ name: 'subcategory_name' })
    subcategoryName: string;

    @Column({ name: 'category_id', type: 'uuid' })
    categoryId: string;

    @ManyToOne(() => FinCategory)
    @JoinColumn({ name: 'category_id' })
    category: FinCategory;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
