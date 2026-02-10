import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vendor } from '../../mdm/entities/vendor.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'po_number', unique: true, length: 50 })
    poNumber: string;

    @Column({ name: 'vendor_id', nullable: true })
    vendorId: string;

    @ManyToOne(() => Vendor, { nullable: true })
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;

    @Column({ name: 'order_date', type: 'date' })
    orderDate: Date;

    @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
    expectedDeliveryDate: Date;

    @Column({ length: 50, default: 'DRAFT' })
    status: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    subtotal: number;

    @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
    taxAmount: number;

    @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @Column({ name: 'approved_by', nullable: true })
    approvedBy: string;

    @Column({ name: 'approved_at', nullable: true })
    approvedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
