import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Field } from './field.entity';
import { Planting } from './planting.entity';
import { Vendor } from '../../mdm/entities/vendor.entity';
import { Account } from '../../mdm/entities/account.entity';
import { CostCenter } from '../../mdm/entities/cost-center.entity';
import { Category } from '../../mdm/entities/category.entity';

@Entity('agri_expenses')
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'field_id', nullable: true })
    fieldId: string;

    @ManyToOne(() => Field, { nullable: true })
    @JoinColumn({ name: 'field_id' })
    field: Field;

    @Column({ name: 'planting_id', nullable: true })
    plantingId: string;

    @ManyToOne(() => Planting, (planting) => planting.expenses, { nullable: true })
    @JoinColumn({ name: 'planting_id' })
    planting: Planting;

    @Column({ name: 'expense_type', length: 50 })
    expenseType: string;

    @Column({ name: 'expense_date', type: 'date' })
    expenseDate: Date;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ name: 'vendor_id', nullable: true })
    vendorId: string;

    @ManyToOne(() => Vendor, { nullable: true })
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;

    @Column({ name: 'account_id', nullable: true })
    accountId: string;

    @ManyToOne(() => Account, { nullable: true })
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column({ name: 'cost_center_id', nullable: true })
    costCenterId: string;

    @ManyToOne(() => CostCenter, { nullable: true })
    @JoinColumn({ name: 'cost_center_id' })
    costCenter: CostCenter;

    @Column({ name: 'category_id', nullable: true })
    categoryId: string;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'transaction_id', nullable: true })
    transactionId: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
