import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Cow } from './cow.entity';
import { Transaction } from '../../finance/entities/transaction.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('dairy_breeding_records')
export class BreedingRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'cow_id' })
    cowId: string;

    @ManyToOne(() => Cow)
    @JoinColumn({ name: 'cow_id' })
    cow: Cow;

    @Column({ name: 'breeding_date', type: 'date' })
    breedingDate: Date;

    @Column({ name: 'breeding_type', length: 30 })
    breedingType: 'NATURAL' | 'ARTIFICIAL_INSEMINATION';

    @Column({ name: 'bull_id', nullable: true })
    bullId: string;

    @ManyToOne(() => Cow, { nullable: true })
    @JoinColumn({ name: 'bull_id' })
    bull: Cow;

    @Column({ name: 'semen_id', length: 100, nullable: true })
    semenId: string;

    @Column({ length: 50, nullable: true })
    breed: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    cost: number;

    @Column({ name: 'transaction_id', nullable: true })
    transactionId: string;

    @ManyToOne(() => Transaction, { nullable: true })
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction;

    @Column({ name: 'expected_calving_date', type: 'date', nullable: true })
    expectedCalvingDate: Date;

    @Column({ name: 'actual_calving_date', type: 'date', nullable: true })
    actualCalvingDate: Date;

    @Column({ name: 'pregnancy_status', length: 20, default: 'PENDING' })
    pregnancyStatus: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'ABORTED' | 'DELIVERED';

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
