import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { Cow } from './cow.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('dairy_milk_production')
@Unique(['cowId', 'productionDate', 'session'])
export class MilkProduction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'cow_id' })
    cowId: string;

    @ManyToOne(() => Cow)
    @JoinColumn({ name: 'cow_id' })
    cow: Cow;

    @Column({ name: 'production_date', type: 'date' })
    productionDate: Date;

    @Column({ length: 20 })
    session: 'MORNING' | 'AFTERNOON' | 'EVENING';

    @Column({ name: 'quantity_liters', type: 'decimal', precision: 10, scale: 2 })
    quantityLiters: number;

    @Column({ name: 'fat_percentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
    fatPercentage: number;

    @Column({ name: 'snf_percentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
    snfPercentage: number;

    @Column({ name: 'quality_grade', length: 5, nullable: true })
    qualityGrade: 'A' | 'B' | 'C';

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
