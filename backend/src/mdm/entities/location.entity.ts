import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('mdm_locations')
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'location_code', unique: true, length: 50 })
    locationCode: string;

    @Column({ name: 'location_name' })
    locationName: string;

    @Column({ name: 'location_type' })
    locationType: 'FARM' | 'FIELD' | 'WAREHOUSE' | 'OFFICE' | 'OTHER';

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ name: 'area_size', type: 'decimal', precision: 10, scale: 2, nullable: true })
    areaSize: number;

    @Column({ name: 'area_unit', nullable: true, length: 20 })
    areaUnit: string;

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
