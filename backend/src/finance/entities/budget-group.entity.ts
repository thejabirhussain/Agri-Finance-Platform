import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('fin_budget_groups')
export class BudgetGroup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'group_code', unique: true, length: 50 })
    groupCode: string;

    @Column({ name: 'group_name' })
    groupName: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
