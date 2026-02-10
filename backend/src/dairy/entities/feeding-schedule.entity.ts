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
import { User } from '../../auth/entities/user.entity';

@Entity('dairy_feeding_schedule')
export class FeedingSchedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'cow_id' })
    cowId: string;

    @ManyToOne(() => Cow)
    @JoinColumn({ name: 'cow_id' })
    cow: Cow;

    @Column({ name: 'feed_type', length: 50 })
    feedType: string;

    @Column({ name: 'product_id', nullable: true })
    productId: string;

    @ManyToOne(() => Product, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'quantity_kg', type: 'decimal', precision: 10, scale: 2 })
    quantityKg: number;

    @Column({ name: 'feeding_time', type: 'time', nullable: true })
    feedingTime: string;

    @Column({ length: 20 })
    frequency: 'DAILY' | 'TWICE_DAILY' | 'WEEKLY';

    @Column({ name: 'start_date', type: 'date' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    endDate: Date;

    @Column({ name: 'cost_per_day', type: 'decimal', precision: 15, scale: 2, default: 0 })
    costPerDay: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'created_by' })
    creator: User;
}
