import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Planting } from './planting.entity';

@Entity('agri_fields')
export class Field {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'field_name', length: 100 })
    fieldName: string;

    @Column({ name: 'field_code', length: 50, unique: true })
    fieldCode: string;

    @Column({ name: 'area_size', type: 'decimal', precision: 10, scale: 2 })
    areaSize: number;

    @Column({ name: 'area_unit', length: 20, default: 'acres' })
    areaUnit: string;

    @Column({ length: 200, nullable: true })
    location: string;

    @Column({ name: 'gps_coordinates', length: 100, nullable: true })
    gpsCoordinates: string;

    @Column({ name: 'soil_type', length: 50, nullable: true })
    soilType: string;

    @Column({ name: 'irrigation_type', length: 50, nullable: true })
    irrigationType: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Planting, (planting) => planting.field)
    plantings: Planting[];
}
