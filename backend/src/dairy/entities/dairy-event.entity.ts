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

@Entity('dairy_events')
export class DairyEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'cow_id' })
    cowId: string;

    @ManyToOne(() => Cow)
    @JoinColumn({ name: 'cow_id' })
    cow: Cow;

    @Column({ name: 'event_type', length: 30 })
    eventType: 'BIRTH' | 'PURCHASE' | 'SALE' | 'DEATH' | 'CALVING' | 'INSEMINATION' | 'PREGNANCY' | 'ABORTION' | 'DRY_OFF' | 'LACTATION_START';

    @Column({ name: 'event_date', type: 'date' })
    eventDate: Date;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'transaction_id', nullable: true })
    transactionId: string;

    @ManyToOne(() => Transaction, { nullable: true })
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction;

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
