import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Vendor } from '../../mdm/entities/vendor.entity';
import { Location } from '../../mdm/entities/location.entity';
import { CostCenter } from '../../mdm/entities/cost-center.entity';
import { Asset } from '../../mdm/entities/asset.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('dairy_cows')
export class Cow {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'cow_tag_number', unique: true, length: 50 })
    cowTagNumber: string;

    @Column({ name: 'cow_name', length: 100 })
    cowName: string;

    @Column({ length: 50 })
    breed: string;

    @Column({ name: 'date_of_birth', type: 'date' })
    dateOfBirth: Date;

    @Column({ name: 'purchase_date', type: 'date', nullable: true })
    purchaseDate: Date;

    @Column({ name: 'purchase_price', type: 'decimal', precision: 15, scale: 2, default: 0 })
    purchasePrice: number;

    @Column({ name: 'current_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
    currentValue: number;

    @Column({ length: 10 })
    gender: 'FEMALE' | 'MALE';

    @Column({ length: 20, default: 'ACTIVE' })
    status: 'ACTIVE' | 'SOLD' | 'DEAD' | 'DRY' | 'PREGNANT' | 'LACTATING';

    @Column({ name: 'vendor_id', nullable: true })
    vendorId: string;

    @ManyToOne(() => Vendor, { nullable: true })
    @JoinColumn({ name: 'vendor_id' })
    vendor: Vendor;

    @Column({ name: 'location_id', nullable: true })
    locationId: string;

    @ManyToOne(() => Location, { nullable: true })
    @JoinColumn({ name: 'location_id' })
    location: Location;

    @Column({ name: 'cost_center_id', nullable: true })
    costCenterId: string;

    @ManyToOne(() => CostCenter, { nullable: true })
    @JoinColumn({ name: 'cost_center_id' })
    costCenter: CostCenter;

    @Column({ name: 'asset_id', nullable: true })
    assetId: string;

    @ManyToOne(() => Asset, { nullable: true })
    @JoinColumn({ name: 'asset_id' })
    asset: Asset;

    @Column({ name: 'parent_cow_id', nullable: true })
    parentCowId: string;

    @ManyToOne(() => Cow, { nullable: true })
    @JoinColumn({ name: 'parent_cow_id' })
    parentCow: Cow;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'created_by' })
    creator: User;
}
