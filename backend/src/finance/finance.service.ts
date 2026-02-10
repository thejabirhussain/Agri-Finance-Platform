import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TransactionGroup } from './entities/transaction-group.entity';
import { FinCategory } from './entities/fin-category.entity';
import { FinSubcategory } from './entities/fin-subcategory.entity';
import { BudgetGroup } from './entities/budget-group.entity';
import { Budget } from './entities/budget.entity';
import { BudgetItem } from './entities/budget-item.entity';
import { Transaction } from './entities/transaction.entity';
import { Account } from '../mdm/entities/account.entity';
import { Asset } from '../mdm/entities/asset.entity';
import { CreateBudgetDto, CreateTransactionDto, TransactionFilterDto } from './dto/finance.dto';

@Injectable()
export class FinanceService {
    constructor(
        @InjectRepository(TransactionGroup)
        private transactionGroupRepository: Repository<TransactionGroup>,
        @InjectRepository(FinCategory)
        private categoryRepository: Repository<FinCategory>,
        @InjectRepository(FinSubcategory)
        private subcategoryRepository: Repository<FinSubcategory>,
        @InjectRepository(BudgetGroup)
        private budgetGroupRepository: Repository<BudgetGroup>,
        @InjectRepository(Budget)
        private budgetRepository: Repository<Budget>,
        @InjectRepository(BudgetItem)
        private budgetItemRepository: Repository<BudgetItem>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        @InjectRepository(Asset)
        private assetRepository: Repository<Asset>,
    ) { }

    // Transaction Groups
    async findAllTransactionGroups(): Promise<TransactionGroup[]> {
        return this.transactionGroupRepository.find({ where: { isActive: true } });
    }

    async findTransactionGroupByCode(code: string): Promise<TransactionGroup> {
        const group = await this.transactionGroupRepository.findOne({ where: { groupCode: code } });
        if (!group) throw new BadRequestException(`Transaction group ${code} not found`);
        return group;
    }

    // Categories
    async findAllCategories(): Promise<FinCategory[]> {
        return this.categoryRepository.find({
            where: { isActive: true },
            relations: ['transactionGroup'],
        });
    }

    async findCategoryByCode(code: string): Promise<FinCategory> {
        const category = await this.categoryRepository.findOne({ where: { categoryCode: code } });
        // Return first available if code not found to avoid blocking (TEMPORARY FIX)
        if (!category) {
            const first = await this.categoryRepository.findOne({ where: { isActive: true } });
            if (first) return first;
            throw new BadRequestException(`Category ${code} not found`);
        }
        return category;
    }

    async createCategory(data: Partial<FinCategory>): Promise<FinCategory> {
        const category = this.categoryRepository.create(data);
        return this.categoryRepository.save(category);
    }

    // Subcategories
    async findAllSubcategories(): Promise<FinSubcategory[]> {
        return this.subcategoryRepository.find({
            where: { isActive: true },
            relations: ['category'],
        });
    }

    // Budget Groups
    async findAllBudgetGroups(): Promise<BudgetGroup[]> {
        return this.budgetGroupRepository.find({ where: { isActive: true } });
    }

    // Budgets
    async createBudget(dto: CreateBudgetDto, userId: string): Promise<Budget> {
        // Calculate total
        const totalBudgetAmount = dto.items.reduce((sum, item) => sum + Number(item.budgetedAmount), 0);

        // Create budget
        const budget = this.budgetRepository.create({
            budgetCode: dto.budgetCode,
            budgetName: dto.budgetName,
            budgetPeriod: dto.budgetPeriod,
            startDate: new Date(dto.startDate),
            endDate: new Date(dto.endDate),
            budgetGroupId: dto.budgetGroupId,
            costCenterId: dto.costCenterId,
            totalBudgetAmount,
            totalActualAmount: 0,
            status: 'DRAFT',
            notes: dto.notes,
            createdBy: userId,
        });

        const savedBudget = await this.budgetRepository.save(budget);

        // Create budget items
        const items = dto.items.map((item) =>
            this.budgetItemRepository.create({
                budgetId: savedBudget.id,
                categoryId: item.categoryId,
                subcategoryId: item.subcategoryId,
                budgetedAmount: item.budgetedAmount,
                actualAmount: 0,
                notes: item.notes,
            }),
        );

        await this.budgetItemRepository.save(items);

        const fetchedBudget = await this.budgetRepository.findOne({
            where: { id: savedBudget.id },
            relations: ['items', 'items.category', 'items.subcategory', 'costCenter', 'budgetGroup'],
        });
        if (!fetchedBudget) throw new BadRequestException('Budget not found');
        return fetchedBudget;
    }

    async findAllBudgets(): Promise<Budget[]> {
        return this.budgetRepository.find({
            where: { isActive: true },
            relations: ['items', 'items.category', 'items.subcategory', 'costCenter', 'budgetGroup'],
            order: { startDate: 'DESC' },
        });
    }

    async findBudgetById(id: string): Promise<Budget> {
        const budget = await this.budgetRepository.findOne({
            where: { id, isActive: true },
            relations: ['items', 'items.category', 'items.subcategory', 'costCenter', 'budgetGroup'],
        });
        if (!budget) throw new BadRequestException('Budget not found');
        return budget;
    }

    async activateBudget(id: string): Promise<Budget> {
        await this.budgetRepository.update(id, { status: 'ACTIVE' });
        return this.findBudgetById(id);
    }

    // Transactions
    async createTransaction(dto: CreateTransactionDto, userId: string): Promise<Transaction> {
        // Validate account exists
        const account = await this.accountRepository.findOne({
            where: { id: dto.accountId, isActive: true },
        });

        if (!account) {
            throw new BadRequestException('Account not found');
        }

        // Determine transaction group type (INCOME/EXPENSE/INVESTMENT)
        const transactionGroup = await this.transactionGroupRepository.findOne({
            where: { id: dto.transactionGroupId },
        });
        if (!transactionGroup) throw new BadRequestException('Transaction group not found');

        // Create transaction
        const transaction = this.transactionRepository.create({
            ...dto,
            transactionDate: new Date(dto.transactionDate),
            createdBy: userId,
        });

        const savedTransaction = await this.transactionRepository.save(transaction);

        // Update account balance
        let newBalance = account.currentBalance;
        if (transactionGroup.groupCode === 'INCOME') {
            newBalance += Number(dto.amount);
        } else if (transactionGroup.groupCode === 'EXPENSE' || transactionGroup.groupCode === 'INVESTMENT') {
            newBalance -= Number(dto.amount);
        }

        await this.accountRepository.update(account.id, { currentBalance: newBalance });

        // Update budget actual if applicable
        if (dto.subcategoryId) {
            await this.updateBudgetActuals(dto.categoryId, dto.subcategoryId, Number(dto.amount));
        }

        const fetchedTransaction = await this.transactionRepository.findOne({
            where: { id: savedTransaction.id },
            relations: ['transactionGroup', 'category', 'subcategory', 'account', 'costCenter', 'operationUnit'],
        });
        if (!fetchedTransaction) throw new BadRequestException('Transaction not found');
        return fetchedTransaction;
    }

    async findAllTransactions(filter?: TransactionFilterDto): Promise<Transaction[]> {
        const where: any = { isActive: true };

        if (filter) {
            if (filter.startDate && filter.endDate) {
                where.transactionDate = Between(new Date(filter.startDate), new Date(filter.endDate));
            }
            if (filter.accountId) where.accountId = filter.accountId;
            if (filter.transactionGroupId) where.transactionGroupId = filter.transactionGroupId;
            if (filter.categoryId) where.categoryId = filter.categoryId;
            if (filter.costCenterId) where.costCenterId = filter.costCenterId;
        }

        return this.transactionRepository.find({
            where,
            relations: ['transactionGroup', 'category', 'subcategory', 'account', 'costCenter', 'operationUnit'],
            order: { transactionDate: 'DESC' },
        });
    }

    private async updateBudgetActuals(categoryId: string, subcategoryId: string, amount: number): Promise<void> {
        // Find active budgets that include this category
        const budgets = await this.budgetRepository
            .createQueryBuilder('budget')
            .leftJoinAndSelect('budget.items', 'items')
            .where('budget.status = :status', { status: 'ACTIVE' })
            .andWhere('budget.is_active = :isActive', { isActive: true })
            .andWhere('items.category_id = :categoryId', { categoryId })
            .getMany();

        for (const budget of budgets) {
            const item = budget.items.find(
                (i) => i.categoryId === categoryId && (!subcategoryId || i.subcategoryId === subcategoryId),
            );

            if (item) {
                item.actualAmount = Number(item.actualAmount) + amount;
                await this.budgetItemRepository.save(item);

                // Update budget total actual
                const totalActual = budget.items.reduce((sum, i) => sum + Number(i.actualAmount), 0);
                await this.budgetRepository.update(budget.id, { totalActualAmount: totalActual });
            }
        }
    }

    // Reports
    async getCashFlowReport(startDate: Date, endDate: Date): Promise<any> {
        const transactions = await this.transactionRepository
            .createQueryBuilder('txn')
            .leftJoinAndSelect('txn.transactionGroup', 'group')
            .where('txn.transaction_date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('txn.is_active = true')
            .orderBy('txn.transaction_date', 'ASC')
            .getMany();

        const income = transactions
            .filter((t) => t.transactionGroup.groupCode === 'INCOME')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expense = transactions
            .filter((t) => t.transactionGroup.groupCode === 'EXPENSE')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const investment = transactions
            .filter((t) => t.transactionGroup.groupCode === 'INVESTMENT')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const netCashFlow = income - expense - investment;

        return {
            period: { startDate, endDate },
            income,
            expense,
            investment,
            netCashFlow,
            transactions: transactions.length,
        };
    }

    async getAccountBalances(): Promise<any> {
        const accounts = await this.accountRepository.find({ where: { isActive: true } });

        const totalCash = accounts
            .filter((a) => a.accountType === 'CASH')
            .reduce((sum, a) => sum + Number(a.currentBalance), 0);

        const totalBank = accounts
            .filter((a) => a.accountType === 'BANK')
            .reduce((sum, a) => sum + Number(a.currentBalance), 0);

        return {
            accounts,
            totalCash,
            totalBank,
            totalBalance: totalCash + totalBank,
        };
    }

    async getCompanyValuation(): Promise<any> {
        // Get all accounts
        const accounts = await this.accountRepository.find({ where: { isActive: true } });
        const totalCashBalance = accounts.reduce((sum, a) => sum + Number(a.currentBalance), 0);

        // Get all assets
        const assets = await this.assetRepository.find({ where: { isActive: true } });
        const totalAssetValue = assets.reduce((sum, a) => sum + Number(a.currentValue) * Number(a.quantity), 0);

        return {
            totalCashBalance,
            totalAssetValue,
            totalValuation: totalCashBalance + totalAssetValue,
            assets: assets.length,
            accounts: accounts.length,
        };
    }

    async getCashFlowSecureness(): Promise<any> {
        // Get current cash balance
        const { totalBalance } = await this.getAccountBalances();

        // Calculate average monthly expense (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const expenses = await this.transactionRepository
            .createQueryBuilder('txn')
            .leftJoinAndSelect('txn.transactionGroup', 'group')
            .where('txn.transaction_date >= :startDate', { startDate: sixMonthsAgo })
            .andWhere('group.group_code = :groupCode', { groupCode: 'EXPENSE' })
            .andWhere('txn.is_active = true')
            .getMany();

        const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
        const averageMonthlyExpense = totalExpense / 6;

        const survivalMonths = averageMonthlyExpense > 0 ? totalBalance / averageMonthlyExpense : 0;

        return {
            currentCashBalance: totalBalance,
            averageMonthlyExpense,
            survivalMonths: Math.floor(survivalMonths),
            status: survivalMonths >= 6 ? 'HEALTHY' : survivalMonths >= 3 ? 'MODERATE' : 'CRITICAL',
        };
    }

    async getOperationalCosts(): Promise<any> {
        // Get all cost centers
        const costCenters = await this.transactionRepository
            .createQueryBuilder('txn')
            .select('cc.cost_center_code', 'costCenterCode')
            .addSelect('cc.cost_center_name', 'costCenterName')
            .addSelect('SUM(txn.amount)', 'totalCost')
            .addSelect('COUNT(txn.id)', 'transactionCount')
            .leftJoin('txn.costCenter', 'cc')
            .leftJoin('txn.transactionGroup', 'group')
            .where('group.group_code = :groupCode', { groupCode: 'EXPENSE' })
            .andWhere('txn.is_active = true')
            .andWhere('cc.cost_center_code IS NOT NULL')
            .groupBy('cc.cost_center_code')
            .addGroupBy('cc.cost_center_name')
            .getRawMany();

        return costCenters;
    }
}
