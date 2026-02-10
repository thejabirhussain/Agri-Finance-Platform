import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Cow } from './cow.entity';
import { BreedingRecord } from './breeding-record.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('dairy_calves')
export class Calf {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'calf_tag_number', unique: true, length: 50 })
    calfTagNumber: string;

    @Column({ name: 'calf_name', length: 100 })
    calfName: string;

    @Column({ name: 'mother_id' })
    motherId: string;

    @ManyToOne(() => Cow)
    @JoinColumn({ name: 'mother_id' })
    mother: Cow;

    @Column({ name: 'father_id', nullable: true })
    fatherId: string;

    @ManyToOne(() => Cow, { nullable: true })
    @JoinColumn({ name: 'father_id' })
    father: Cow;

    @Column({ name: 'breeding_record_id', nullable: true })
    breedingRecordId: string;

    @ManyToOne(() => BreedingRecord, { nullable: true })
    @JoinColumn({ name: 'breeding_record_id' })
    breedingRecord: BreedingRecord;

    @Column({ name: 'birth_date', type: 'date' })
    birthDate: Date;

    @Column({ name: 'birth_weight_kg', type: 'decimal', precision: 10, scale: 2, nullable: true })
    birthWeightKg: number;

    @Column({ length: 10 })
    gender: 'MALE' | 'FEMALE';

    @Column({ length: 20, default: 'ACTIVE' })
    status: 'ACTIVE' | 'SOLD' | 'DEAD' | 'TRANSFERRED_TO_COW';

    @Column({ name: 'health_status', length: 20, default: 'HEALTHY' })
    healthStatus: 'HEALTHY' | 'SICK' | 'WEAK';

    @Column({ name: 'sale_date', type: 'date', nullable: true })
    saleDate: Date;

    @Column({ name: 'sale_price', type: 'decimal', precision: 15, scale: 2, nullable: true })
    salePrice: number;

    @Column({ name: 'cow_id', nullable: true })
    cowId: string;

    @ManyToOne(() => Cow, { nullable: true })
    @JoinColumn({ name: 'cow_id' })
    cow: Cow;

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
