import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { TransactionGroup } from './transaction-group.entity';
import { FinCategory } from './fin-category.entity';
import { FinSubcategory } from './fin-subcategory.entity';
import { Account } from '../../mdm/entities/account.entity';
import { CostCenter } from '../../mdm/entities/cost-center.entity';
import { OperationUnit } from '../../mdm/entities/operation-unit.entity';
import { Vendor } from '../../mdm/entities/vendor.entity';
import { Customer } from '../../mdm/entities/customer.entity';

@Entity('fin_transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'transaction_code', unique: true, length: 50 })
    transactionCode: string;

    @Column({ name: 'transaction_date', type: 'date' })
    transactionDate: Date;

    @Column({ name: 'transaction_group_id', type: 'uuid' })
    transactionGroupId: string;

    @ManyToOne(() => TransactionGroup)
    @JoinColumn({ name: 'transaction_group_id' })
    transactionGroup: TransactionGroup;

    @Column({ name: 'category_id', type: 'uuid' })
    categoryId: string;

    @ManyToOne(() => FinCategory)
    @JoinColumn({ name: 'category_id' })
    category: FinCategory;

    @Column({ name: 'subcategory_id', type: 'uuid', nullable: true })
    subcategoryId: string;

    @ManyToOne(() => FinSubcategory)
    @JoinColumn({ name: 'subcategory_id' })
    subcategory: FinSubcategory;

    @Column({ name: 'account_id', type: 'uuid' })
    accountId: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'account_id' })
    account: Account;

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

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'reference_type', nullable: true, length: 50 })
    referenceType: string;

    @Column({ name: 'reference_id', type: 'uuid', nullable: true })
    referenceId: string;

    @Column({ name: 'payment_method', nullable: true, length: 50 })
    paymentMethod: string;

    @Column({ name: 'vendor_id', type: 'uuid', nullable: true })
    vendorId: string;

    @ManyToOne(() => Vendor)
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;

    @Column({ name: 'customer_id', type: 'uuid', nullable: true })
    customerId: string;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

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
}
