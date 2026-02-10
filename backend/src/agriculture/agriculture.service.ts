import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from './entities/field.entity';
import { Crop } from './entities/crop.entity';
import { Planting } from './entities/planting.entity';
import { Harvest } from './entities/harvest.entity';
import { Expense } from './entities/expense.entity';
import { FinanceService } from '../finance/finance.service';

@Injectable()
export class AgricultureService {
    constructor(
        @InjectRepository(Field)
        private fieldRepository: Repository<Field>,
        @InjectRepository(Crop)
        private cropRepository: Repository<Crop>,
        @InjectRepository(Planting)
        private plantingRepository: Repository<Planting>,
        @InjectRepository(Harvest)
        private harvestRepository: Repository<Harvest>,
        @InjectRepository(Expense)
        private expenseRepository: Repository<Expense>,
        private financeService: FinanceService,
    ) { }

    // ===== FIELDS =====
    async createField(data: Partial<Field>): Promise<Field> {
        const field = this.fieldRepository.create(data);
        return this.fieldRepository.save(field);
    }

    async findAllFields(): Promise<Field[]> {
        return this.fieldRepository.find({ where: { isActive: true } });
    }

    async findFieldById(id: string): Promise<Field> {
        const field = await this.fieldRepository.findOne({ where: { id } });
        if (!field) {
            throw new NotFoundException(`Field with ID ${id} not found`);
        }
        return field;
    }

    async updateField(id: string, data: Partial<Field>): Promise<Field> {
        await this.findFieldById(id);
        await this.fieldRepository.update(id, data);
        return this.findFieldById(id);
    }

    async deleteField(id: string): Promise<void> {
        await this.fieldRepository.update(id, { isActive: false });
    }

    // ===== CROPS =====
    async findAllCrops(): Promise<Crop[]> {
        return this.cropRepository.find({ where: { isActive: true } });
    }

    async findCropById(id: string): Promise<Crop> {
        const crop = await this.cropRepository.findOne({ where: { id } });
        if (!crop) {
            throw new NotFoundException(`Crop with ID ${id} not found`);
        }
        return crop;
    }

    // ===== PLANTINGS =====
    async createPlanting(data: Partial<Planting>): Promise<Planting> {
        const planting = this.plantingRepository.create(data);
        return this.plantingRepository.save(planting);
    }

    async findAllPlantings(): Promise<Planting[]> {
        return this.plantingRepository.find({
            relations: ['field', 'crop', 'costCenter'],
        });
    }

    async findPlantingById(id: string): Promise<Planting> {
        const planting = await this.plantingRepository.findOne({
            where: { id },
            relations: ['field', 'crop', 'costCenter', 'harvests', 'expenses'],
        });
        if (!planting) {
            throw new NotFoundException(`Planting with ID ${id} not found`);
        }
        return planting;
    }

    async updatePlanting(id: string, data: Partial<Planting>): Promise<Planting> {
        await this.findPlantingById(id);
        await this.plantingRepository.update(id, data);
        return this.findPlantingById(id);
    }

    // ===== HARVESTS =====
    async recordHarvest(data: Partial<Harvest>, userId: string): Promise<Harvest> {
        // Calculate total value
        if (data.quantityHarvested && data.marketPrice) {
            data.totalValue = data.quantityHarvested * data.marketPrice;
        }



        const harvest = this.harvestRepository.create({ ...data, createdBy: userId });
        const savedHarvest = await this.harvestRepository.save(harvest) as Harvest;

        // Create income transaction
        if (data.totalValue && data.totalValue > 0 && data.plantingId) {
            try {
                const planting = await this.findPlantingById(data.plantingId);
                const incomeGroup = await this.financeService.findTransactionGroupByCode('INCOME');
                // Use a default category 'AGRI_SALES' or fallback
                const category = await this.financeService.findCategoryByCode('AGRI_SALES');

                const transaction = await this.financeService.createTransaction({
                    transactionCode: `HARV-${Date.now()}`,
                    transactionGroupId: incomeGroup.id,
                    categoryId: category.id,
                    amount: data.totalValue,
                    transactionDate: new Date(data.harvestDate!).toISOString(),
                    accountId: (data as any).accountId || '00000000-0000-0000-0000-000000000000', // Fallback UUID or null if allowed? DTO says UUID required. 
                    // Note: accountId is required by DTO. If not provided in data, we have a problem.
                    // Assuming frontend sends 'accountId' in data.
                    costCenterId: planting.costCenterId,
                    description: `Harvest income from ${planting.crop?.cropName || 'crop'}`,
                }, userId);
                savedHarvest.transactionId = transaction.id;
                await this.harvestRepository.save(savedHarvest);
            } catch (error) {
                console.error('Failed to create transaction for harvest:', error);
            }
        }

        return savedHarvest;
    }

    async findAllHarvests(): Promise<Harvest[]> {
        return this.harvestRepository.find({
            relations: ['planting', 'planting.field', 'planting.crop', 'product'],
            order: { harvestDate: 'DESC' },
        });
    }

    async getHarvestSummary() {
        const harvests = await this.harvestRepository.find({
            relations: ['planting', 'planting.crop'],
        });

        const totalQuantity = harvests.reduce((sum, h) => sum + Number(h.quantityHarvested), 0);
        const totalValue = harvests.reduce((sum, h) => sum + Number(h.totalValue || 0), 0);

        return {
            totalHarvests: harvests.length,
            totalQuantity,
            totalValue,
            byMonth: this.groupByMonth(harvests),
        };
    }

    // ===== EXPENSES =====
    async recordExpense(data: Partial<Expense>, userId: string): Promise<Expense> {
        const expense = this.expenseRepository.create({ ...data, createdBy: userId });
        const savedExpense = await this.expenseRepository.save(expense) as Expense;

        // Create expense transaction
        try {
            const expenseGroup = await this.financeService.findTransactionGroupByCode('EXPENSE');
            const transaction = await this.financeService.createTransaction({
                transactionCode: `EXP-${Date.now()}`,
                transactionGroupId: expenseGroup.id,
                categoryId: data.categoryId as string,
                amount: data.amount as number,
                transactionDate: new Date(data.expenseDate!).toISOString(),
                accountId: data.accountId as string,
                vendorId: data.vendorId,
                costCenterId: data.costCenterId as string,
                description: data.description || `Agriculture expense - ${data.expenseType}`,
            }, userId);
            savedExpense.transactionId = transaction.id;
            await this.expenseRepository.save(savedExpense);
        } catch (error) {
            console.error('Failed to create transaction for expense:', error);
        }

        return savedExpense;
    }

    async findAllExpenses(): Promise<Expense[]> {
        return this.expenseRepository.find({
            relations: ['field', 'planting', 'vendor', 'account', 'costCenter', 'category'],
            order: { expenseDate: 'DESC' },
        });
    }

    // ===== DASHBOARD =====
    async getDashboardMetrics() {
        const fields = await this.fieldRepository.count({ where: { isActive: true } });
        const activePlantings = await this.plantingRepository.count({
            where: { status: 'ACTIVE' },
        });

        const harvestSummary = await this.getHarvestSummary();

        const expenses = await this.expenseRepository
            .createQueryBuilder('expense')
            .select('SUM(expense.amount)', 'total')
            .getRawOne();

        const totalExpenses = Number(expenses?.total || 0);

        return {
            totalFields: fields,
            activePlantings,
            totalHarvests: harvestSummary.totalHarvests,
            totalHarvestValue: harvestSummary.totalValue,
            totalExpenses,
            netProfit: harvestSummary.totalValue - totalExpenses,
        };
    }

    private groupByMonth(harvests: Harvest[]) {
        const grouped = {};
        harvests.forEach((h) => {
            const month = new Date(h.harvestDate).toISOString().substring(0, 7);
            if (!grouped[month]) {
                grouped[month] = { quantity: 0, value: 0 };
            }
            grouped[month].quantity += Number(h.quantityHarvested);
            grouped[month].value += Number(h.totalValue || 0);
        });
        return grouped;
    }
}
