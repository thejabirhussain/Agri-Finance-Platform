import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('mdm_operation_units')
export class OperationUnit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'unit_code', unique: true, length: 50 })
    unitCode: string;

    @Column({ name: 'unit_name' })
    unitName: string;

    @Column({ name: 'unit_type' })
    unitType: 'ANIMAL' | 'LAND' | 'VOLUME' | 'WEIGHT' | 'OTHER';

    @Column({ type: 'text', nullable: true })
    description: string;

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
