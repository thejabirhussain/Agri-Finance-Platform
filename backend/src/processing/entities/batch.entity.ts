import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

export enum BatchStatus {
    PLANNED = 'PLANNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

@Entity('processing_batches')
export class Batch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'batch_number', length: 50, unique: true })
    batchNumber: string;

    @Column({ name: 'recipe_id' })
    recipeId: string;

    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'recipe_id' })
    recipe: Recipe;

    @Column({ type: 'enum', enum: BatchStatus, default: BatchStatus.PLANNED })
    status: BatchStatus;

    @Column({ name: 'start_time', type: 'timestamp', nullable: true })
    startTime: Date;

    @Column({ name: 'end_time', type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ name: 'actual_yield', type: 'decimal', precision: 10, scale: 2, nullable: true })
    actualYield: number;

    @Column({ name: 'managed_by', nullable: true })
    managedBy: string; // User ID

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
