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

@Entity('fin_categories')
export class FinCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'category_code', unique: true, length: 50 })
    categoryCode: string;

    @Column({ name: 'category_name' })
    categoryName: string;

    @Column({ name: 'transaction_group_id', type: 'uuid' })
    transactionGroupId: string;

    @ManyToOne(() => TransactionGroup)
    @JoinColumn({ name: 'transaction_group_id' })
    transactionGroup: TransactionGroup;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
