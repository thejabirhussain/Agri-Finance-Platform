import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

@Entity('mdm_accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'account_name' })
    accountName: string;

    @Column({ name: 'account_type' })
    accountType: 'BANK' | 'CASH';

    @Column({ name: 'account_number', nullable: true })
    accountNumber: string;

    @Column({ name: 'bank_name', nullable: true })
    bankName: string;

    @Column({ name: 'branch_name', nullable: true })
    branchName: string;

    @Column({ name: 'ifsc_code', nullable: true, length: 20 })
    ifscCode: string;

    @Column({ name: 'opening_balance', type: 'decimal', precision: 15, scale: 2, default: 0 })
    openingBalance: number;

    @Column({ name: 'current_balance', type: 'decimal', precision: 15, scale: 2, default: 0 })
    currentBalance: number;

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
