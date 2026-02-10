import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { BudgetGroup } from './budget-group.entity';
import { CostCenter } from '../../mdm/entities/cost-center.entity';
import { BudgetItem } from './budget-item.entity';

@Entity('fin_budgets')
export class Budget {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'budget_code', unique: true, length: 50 })
    budgetCode: string;

    @Column({ name: 'budget_name' })
    budgetName: string;

    @Column({ name: 'budget_period' })
    budgetPeriod: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

    @Column({ name: 'start_date', type: 'date' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date' })
    endDate: Date;

    @Column({ name: 'budget_group_id', type: 'uuid', nullable: true })
    budgetGroupId: string;

    @ManyToOne(() => BudgetGroup)
    @JoinColumn({ name: 'budget_group_id' })
    budgetGroup: BudgetGroup;

    @Column({ name: 'cost_center_id', type: 'uuid', nullable: true })
    costCenterId: string;

    @ManyToOne(() => CostCenter)
    @JoinColumn({ name: 'cost_center_id' })
    costCenter: CostCenter;

    @Column({ name: 'total_budget_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalBudgetAmount: number;

    @Column({ name: 'total_actual_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalActualAmount: number;

    @Column({ default: 'DRAFT' })
    status: 'DRAFT' | 'ACTIVE' | 'CLOSED';

    @Column({ type: 'text', nullable: true })
    notes: string;

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

    @OneToMany(() => BudgetItem, (item) => item.budget)
    items: BudgetItem[];
}
