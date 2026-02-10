import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('mdm_categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'category_name' })
    categoryName: string;

    @Column({ name: 'category_code', unique: true, length: 50 })
    categoryCode: string;

    @Column({ name: 'parent_category_id', type: 'uuid', nullable: true })
    parentCategoryId: string;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'parent_category_id' })
    parentCategory: Category;

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
