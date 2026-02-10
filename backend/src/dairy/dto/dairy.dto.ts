import { IsString, IsDate, IsNumber, IsEnum, IsOptional, IsUUID, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ============================================
// COW DTOs
// ============================================

export class CreateCowDto {
    @ApiProperty()
    @IsString()
    cowTagNumber: string;

    @ApiProperty()
    @IsString()
    cowName: string;

    @ApiProperty()
    @IsString()
    breed: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    dateOfBirth: Date;

    @ApiPropertyOptional()
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    purchaseDate?: Date;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    purchasePrice?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    currentValue?: number;

    @ApiProperty({ enum: ['FEMALE', 'MALE'] })
    @IsEnum(['FEMALE', 'MALE'])
    gender: 'FEMALE' | 'MALE';

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    vendorId?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    locationId?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    costCenterId?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    parentCowId?: string;
}

export class UpdateCowDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    cowName?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    breed?: string;

    @ApiPropertyOptional({ enum: ['ACTIVE', 'SOLD', 'DEAD', 'DRY', 'PREGNANT', 'LACTATING'] })
    @IsEnum(['ACTIVE', 'SOLD', 'DEAD', 'DRY', 'PREGNANT', 'LACTATING'])
    @IsOptional()
    status?: 'ACTIVE' | 'SOLD' | 'DEAD' | 'DRY' | 'PREGNANT' | 'LACTATING';

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    currentValue?: number;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    locationId?: string;
}

// ============================================
// MILK PRODUCTION DTOs
// ============================================

export class RecordMilkProductionDto {
    @ApiProperty()
    @IsUUID()
    cowId: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    productionDate: Date;

    @ApiProperty({ enum: ['MORNING', 'AFTERNOON', 'EVENING'] })
    @IsEnum(['MORNING', 'AFTERNOON', 'EVENING'])
    session: 'MORNING' | 'AFTERNOON' | 'EVENING';

    @ApiProperty()
    @IsNumber()
    @Min(0)
    quantityLiters: number;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    fatPercentage?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    snfPercentage?: number;

    @ApiPropertyOptional({ enum: ['A', 'B', 'C'] })
    @IsEnum(['A', 'B', 'C'])
    @IsOptional()
    qualityGrade?: 'A' | 'B' | 'C';

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    notes?: string;
}

export class BulkMilkProductionDto {
    @ApiProperty({ type: [RecordMilkProductionDto] })
    records: RecordMilkProductionDto[];
}

// ============================================
// FEEDING DTOs
// ============================================

export class CreateFeedingRecordDto {
    @ApiProperty()
    @IsUUID()
    cowId: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    feedingDate: Date;

    @ApiProperty()
    @IsUUID()
    productId: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    quantityKg: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    cost: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    notes?: string;
}

export class CreateFeedingScheduleDto {
    @ApiProperty()
    @IsUUID()
    cowId: string;

    @ApiProperty()
    @IsString()
    feedType: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    productId?: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    quantityKg: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    feedingTime?: string;

    @ApiProperty({ enum: ['DAILY', 'TWICE_DAILY', 'WEEKLY'] })
    @IsEnum(['DAILY', 'TWICE_DAILY', 'WEEKLY'])
    frequency: 'DAILY' | 'TWICE_DAILY' | 'WEEKLY';

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiPropertyOptional()
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    endDate?: Date;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    costPerDay?: number;
}

// ============================================
// HEALTH DTOs
// ============================================

export class CreateHealthRecordDto {
    @ApiProperty()
    @IsUUID()
    cowId: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    recordDate: Date;

    @ApiProperty({ enum: ['VACCINATION', 'TREATMENT', 'CHECKUP', 'DEWORMING'] })
    @IsEnum(['VACCINATION', 'TREATMENT', 'CHECKUP', 'DEWORMING'])
    recordType: 'VACCINATION' | 'TREATMENT' | 'CHECKUP' | 'DEWORMING';

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    diagnosis?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    treatment?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    medicineName?: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    medicineCost: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    vetName?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    vendorId?: string;

    @ApiPropertyOptional()
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    nextCheckupDate?: Date;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    notes?: string;
}

// ============================================
// BREEDING DTOs
// ============================================

export class CreateBreedingRecordDto {
    @ApiProperty()
    @IsUUID()
    cowId: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    breedingDate: Date;

    @ApiProperty({ enum: ['NATURAL', 'ARTIFICIAL_INSEMINATION'] })
    @IsEnum(['NATURAL', 'ARTIFICIAL_INSEMINATION'])
    breedingType: 'NATURAL' | 'ARTIFICIAL_INSEMINATION';

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    bullId?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    semenId?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    breed?: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    cost: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    notes?: string;
}

export class UpdateBreedingRecordDto {
    @ApiPropertyOptional({ enum: ['PENDING', 'CONFIRMED', 'FAILED', 'ABORTED', 'DELIVERED'] })
    @IsEnum(['PENDING', 'CONFIRMED', 'FAILED', 'ABORTED', 'DELIVERED'])
    @IsOptional()
    pregnancyStatus?: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'ABORTED' | 'DELIVERED';

    @ApiPropertyOptional()
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    actualCalvingDate?: Date;
}

// ============================================
// CALF DTOs
// ============================================

export class RegisterCalfDto {
    @ApiProperty()
    @IsString()
    calfTagNumber: string;

    @ApiProperty()
    @IsString()
    calfName: string;

    @ApiProperty()
    @IsUUID()
    motherId: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    fatherId?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    breedingRecordId?: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    birthDate: Date;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    birthWeightKg?: number;

    @ApiProperty({ enum: ['MALE', 'FEMALE'] })
    @IsEnum(['MALE', 'FEMALE'])
    gender: 'MALE' | 'FEMALE';

    @ApiPropertyOptional({ enum: ['HEALTHY', 'SICK', 'WEAK'] })
    @IsEnum(['HEALTHY', 'SICK', 'WEAK'])
    @IsOptional()
    healthStatus?: 'HEALTHY' | 'SICK' | 'WEAK';
}

export class UpdateCalfDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    calfName?: string;

    @ApiPropertyOptional({ enum: ['ACTIVE', 'SOLD', 'DEAD', 'TRANSFERRED_TO_COW'] })
    @IsEnum(['ACTIVE', 'SOLD', 'DEAD', 'TRANSFERRED_TO_COW'])
    @IsOptional()
    status?: 'ACTIVE' | 'SOLD' | 'DEAD' | 'TRANSFERRED_TO_COW';

    @ApiPropertyOptional({ enum: ['HEALTHY', 'SICK', 'WEAK'] })
    @IsEnum(['HEALTHY', 'SICK', 'WEAK'])
    @IsOptional()
    healthStatus?: 'HEALTHY' | 'SICK' | 'WEAK';

    @ApiPropertyOptional()
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    saleDate?: Date;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    salePrice?: number;
}

// ============================================
// QUERY DTOs
// ============================================

export class MilkProductionQueryDto {
    @ApiPropertyOptional()
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    startDate?: Date;

    @ApiPropertyOptional()
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    endDate?: Date;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    cowId?: string;
}

export class CowFilterDto {
    @ApiPropertyOptional({ enum: ['ACTIVE', 'SOLD', 'DEAD', 'DRY', 'PREGNANT', 'LACTATING'] })
    @IsEnum(['ACTIVE', 'SOLD', 'DEAD', 'DRY', 'PREGNANT', 'LACTATING'])
    @IsOptional()
    status?: 'ACTIVE' | 'SOLD' | 'DEAD' | 'DRY' | 'PREGNANT' | 'LACTATING';

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    breed?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    locationId?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @Type(() => Boolean)
    @IsOptional()
    isActive?: boolean;
}
