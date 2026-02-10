import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('mdm_vendors')
export class Vendor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'vendor_code', unique: true, length: 50 })
    vendorCode: string;

    @Column({ name: 'vendor_name' })
    vendorName: string;

    @Column({ name: 'vendor_type', nullable: true, length: 50 })
    vendorType: string;

    @Column({ name: 'contact_person', nullable: true })
    contactPerson: string;

    @Column({ nullable: true, length: 20 })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ nullable: true, length: 100 })
    city: string;

    @Column({ nullable: true, length: 100 })
    state: string;

    @Column({ nullable: true, length: 10 })
    pincode: string;

    @Column({ name: 'payment_terms', nullable: true, length: 100 })
    paymentTerms: string;

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
