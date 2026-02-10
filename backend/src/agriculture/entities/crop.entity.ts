import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Planting } from './planting.entity';

@Entity('agri_crops')
export class Crop {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'crop_name', length: 100 })
    cropName: string;

    @Column({ name: 'crop_code', length: 50, unique: true })
    cropCode: string;

    @Column({ length: 50, nullable: true })
    category: string;

    @Column({ length: 100, nullable: true })
    variety: string;

    @Column({ name: 'growing_season', length: 50, nullable: true })
    growingSeason: string;

    @Column({ name: 'avg_duration_days', nullable: true })
    avgDurationDays: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Planting, (planting) => planting.crop)
    plantings: Planting[];
}
