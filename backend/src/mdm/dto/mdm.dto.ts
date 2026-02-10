import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDecimal, IsBoolean, IsUUID } from 'class-validator';

export class CreateAccountDto {
    @ApiProperty({ example: 'Main Bank Account' })
    @IsString()
    @IsNotEmpty()
    accountName: string;

    @ApiProperty({ enum: ['BANK', 'CASH'], example: 'BANK' })
    @IsEnum(['BANK', 'CASH'])
    accountType: 'BANK' | 'CASH';

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    accountNumber?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    bankName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    branchName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    ifscCode?: string;

    @ApiProperty({ example: 100000 })
    @IsDecimal()
    openingBalance: number;
}

export class CreateCostCenterDto {
    @ApiProperty({ example: 'DAIRY' })
    @IsString()
    @IsNotEmpty()
    costCenterCode: string;

    @ApiProperty({ example: 'Dairy Operations' })
    @IsString()
    @IsNotEmpty()
    costCenterName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
}

export class CreateProductDto {
    @ApiProperty({ example: 'MILK-RAW' })
    @IsString()
    @IsNotEmpty()
    productCode: string;

    @ApiProperty({ example: 'Raw Milk' })
    @IsString()
    @IsNotEmpty()
    productName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'LITRE' })
    @IsString()
    @IsNotEmpty()
    unitOfMeasure: string;

    @ApiProperty({ default: false })
    @IsOptional()
    @IsBoolean()
    isRawMaterial?: boolean;

    @ApiProperty({ default: false })
    @IsOptional()
    @IsBoolean()
    isFinishedGood?: boolean;
}

export class CreateCustomerDto {
    @ApiProperty({ example: 'CUST-001' })
    @IsString()
    @IsNotEmpty()
    customerCode: string;

    @ApiProperty({ example: 'ABC Dairy' })
    @IsString()
    @IsNotEmpty()
    customerName: string;

    @ApiProperty({ enum: ['RETAIL', 'B2B', 'DISTRIBUTOR', 'BULK'], required: false })
    @IsOptional()
    @IsEnum(['RETAIL', 'B2B', 'DISTRIBUTOR', 'BULK'])
    customerType?: 'RETAIL' | 'B2B' | 'DISTRIBUTOR' | 'BULK';

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    contactPerson?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    pincode?: string;

    @ApiProperty({ default: 0 })
    @IsOptional()
    @IsDecimal()
    creditLimit?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    paymentTerms?: string;
}
