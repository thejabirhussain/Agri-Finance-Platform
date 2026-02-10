import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum LocationType {
    WAREHOUSE = 'WAREHOUSE',
    ZONE = 'ZONE',
    RACK = 'RACK',
    BIN = 'BIN',
    TANK = 'TANK', // For liquid storage like milk
    SILO = 'SILO'  // For grain storage
}

@Entity('warehouse_locations')
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name', length: 100 })
    name: string;

    @Column({ type: 'enum', enum: LocationType, default: LocationType.WAREHOUSE })
    type: LocationType;

    @Column({ name: 'code', length: 50, unique: true })
    code: string; // e.g., WH1-Z1-R1-B1

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'parent_id', nullable: true })
    parentId: string;

    @ManyToOne(() => Location, (location) => location.children)
    @JoinColumn({ name: 'parent_id' })
    parent: Location;

    @OneToMany(() => Location, (location) => location.parent)
    children: Location[];

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'capacity', type: 'decimal', precision: 10, scale: 2, nullable: true })
    capacity: number; // Max capacity if applicable

    @Column({ name: 'capacity_unit', length: 20, nullable: true })
    capacityUnit: string; // e.g., 'Kg', 'Liters'

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
