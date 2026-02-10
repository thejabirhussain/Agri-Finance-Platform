import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Budget } from './budget.entity';
import { FinCategory } from './fin-category.entity';
import { FinSubcategory } from './fin-subcategory.entity';

@Entity('fin_budget_items')
export class BudgetItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'budget_id', type: 'uuid' })
    budgetId: string;

    @ManyToOne(() => Budget, (budget) => budget.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'budget_id' })
    budget: Budget;

    @Column({ name: 'category_id', type: 'uuid', nullable: true })
    categoryId: string;

    @ManyToOne(() => FinCategory)
    @JoinColumn({ name: 'category_id' })
    category: FinCategory;

    @Column({ name: 'subcategory_id', type: 'uuid', nullable: true })
    subcategoryId: string;

    @ManyToOne(() => FinSubcategory)
    @JoinColumn({ name: 'subcategory_id' })
    subcategory: FinSubcategory;

    @Column({ name: 'budgeted_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
    budgetedAmount: number;

    @Column({ name: 'actual_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
    actualAmount: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
