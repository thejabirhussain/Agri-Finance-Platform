import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Cow } from './cow.entity';
import { Vendor } from '../../mdm/entities/vendor.entity';
import { Transaction } from '../../finance/entities/transaction.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('dairy_health_records')
export class HealthRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'cow_id' })
    cowId: string;

    @ManyToOne(() => Cow)
    @JoinColumn({ name: 'cow_id' })
    cow: Cow;

    @Column({ name: 'record_date', type: 'date' })
    recordDate: Date;

    @Column({ name: 'record_type', length: 30 })
    recordType: 'VACCINATION' | 'TREATMENT' | 'CHECKUP' | 'DEWORMING';

    @Column({ type: 'text', nullable: true })
    diagnosis: string;

    @Column({ type: 'text', nullable: true })
    treatment: string;

    @Column({ name: 'medicine_name', length: 200, nullable: true })
    medicineName: string;

    @Column({ name: 'medicine_cost', type: 'decimal', precision: 15, scale: 2, default: 0 })
    medicineCost: number;

    @Column({ name: 'vet_name', length: 100, nullable: true })
    vetName: string;

    @Column({ name: 'vendor_id', nullable: true })
    vendorId: string;

    @ManyToOne(() => Vendor, { nullable: true })
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;

    @Column({ name: 'transaction_id', nullable: true })
    transactionId: string;

    @ManyToOne(() => Transaction, { nullable: true })
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction;

    @Column({ name: 'next_checkup_date', type: 'date', nullable: true })
    nextCheckupDate: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'created_by' })
    creator: User;
}
