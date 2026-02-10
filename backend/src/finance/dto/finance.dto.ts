import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDecimal, IsUUID, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBudgetItemDto {
    @ApiProperty()
    @IsUUID()
    categoryId: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    subcategoryId?: string;

    @ApiProperty()
    @IsDecimal()
    budgetedAmount: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class CreateBudgetDto {
    @ApiProperty({ example: 'BGT-2024-01' })
    @IsString()
    @IsNotEmpty()
    budgetCode: string;

    @ApiProperty({ example: 'January 2024 Budget' })
    @IsString()
    @IsNotEmpty()
    budgetName: string;

    @ApiProperty({ enum: ['MONTHLY', 'QUARTERLY', 'YEARLY'] })
    @IsEnum(['MONTHLY', 'QUARTERLY', 'YEARLY'])
    budgetPeriod: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

    @ApiProperty()
    @IsDateString()
    startDate: string;

    @ApiProperty()
    @IsDateString()
    endDate: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    budgetGroupId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    costCenterId?: string;

    @ApiProperty({ type: [CreateBudgetItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateBudgetItemDto)
    items: CreateBudgetItemDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class CreateTransactionDto {
    @ApiProperty({ example: 'TXN-2024-001' })
    @IsString()
    @IsNotEmpty()
    transactionCode: string;

    @ApiProperty()
    @IsDateString()
    transactionDate: string;

    @ApiProperty()
    @IsUUID()
    transactionGroupId: string;

    @ApiProperty()
    @IsUUID()
    categoryId: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    subcategoryId?: string;

    @ApiProperty()
    @IsUUID()
    accountId: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    costCenterId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    operationUnitId?: string;

    @ApiProperty()
    @IsDecimal()
    amount: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    referenceType?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    referenceId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    vendorId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    customerId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class TransactionFilterDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    accountId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    transactionGroupId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    costCenterId?: string;
}
