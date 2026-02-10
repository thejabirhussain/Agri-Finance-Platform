import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Cow } from './cow.entity';
import { Product } from '../../mdm/entities/product.entity';
import { Transaction } from '../../finance/entities/transaction.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('dairy_feeding_records')
export class FeedingRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'cow_id' })
    cowId: string;

    @ManyToOne(() => Cow)
    @JoinColumn({ name: 'cow_id' })
    cow: Cow;

    @Column({ name: 'feeding_date', type: 'date' })
    feedingDate: Date;

    @Column({ name: 'product_id' })
    productId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'quantity_kg', type: 'decimal', precision: 10, scale: 2 })
    quantityKg: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    cost: number;

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
