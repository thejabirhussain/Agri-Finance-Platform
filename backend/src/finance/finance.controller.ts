import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBudgetDto, CreateTransactionDto, TransactionFilterDto } from './dto/finance.dto';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
    constructor(private financeService: FinanceService) { }

    // Transaction Groups
    @Get('transaction-groups')
    @ApiOperation({ summary: 'Get all transaction groups' })
    async getTransactionGroups() {
        return this.financeService.findAllTransactionGroups();
    }

    // Categories
    @Get('categories')
    @ApiOperation({ summary: 'Get all financial categories' })
    async getCategories() {
        return this.financeService.findAllCategories();
    }

    @Post('categories')
    @ApiOperation({ summary: 'Create a new financial category' })
    async createCategory(@Body() dto: any) {
        return this.financeService.createCategory(dto);
    }

    // Subcategories
    @Get('subcategories')
    @ApiOperation({ summary: 'Get all financial subcategories' })
    async getSubcategories() {
        return this.financeService.findAllSubcategories();
    }

    // Budget Groups
    @Get('budget-groups')
    @ApiOperation({ summary: 'Get all budget groups' })
    async getBudgetGroups() {
        return this.financeService.findAllBudgetGroups();
    }

    // Budgets
    @Get('budgets')
    @ApiOperation({ summary: 'Get all budgets' })
    async getBudgets() {
        return this.financeService.findAllBudgets();
    }

    @Post('budgets')
    @ApiOperation({ summary: 'Create a new budget with items' })
    async createBudget(@Body() dto: CreateBudgetDto, @Request() req) {
        return this.financeService.createBudget(dto, req.user.userId);
    }

    @Get('budgets/:id')
    @ApiOperation({ summary: 'Get budget by ID' })
    async getBudget(@Param('id') id: string) {
        return this.financeService.findBudgetById(id);
    }

    @Put('budgets/:id/activate')
    @ApiOperation({ summary: 'Activate a budget' })
    async activateBudget(@Param('id') id: string) {
        return this.financeService.activateBudget(id);
    }

    // Transactions
    @Get('transactions')
    @ApiOperation({ summary: 'Get all transactions with optional filters' })
    @ApiQuery({ type: TransactionFilterDto, required: false })
    async getTransactions(@Query() filter: TransactionFilterDto) {
        return this.financeService.findAllTransactions(filter);
    }

    @Post('transactions')
    @ApiOperation({ summary: 'Create a new transaction and update account balance' })
    async createTransaction(@Body() dto: CreateTransactionDto, @Request() req) {
        return this.financeService.createTransaction(dto, req.user.userId);
    }

    // Reports
    @Get('reports/cashflow')
    @ApiOperation({ summary: 'Get cash flow report' })
    @ApiQuery({ name: 'startDate', required: true })
    @ApiQuery({ name: 'endDate', required: true })
    async getCashFlowReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
        return this.financeService.getCashFlowReport(new Date(startDate), new Date(endDate));
    }

    @Get('reports/account-balances')
    @ApiOperation({ summary: 'Get account balances summary' })
    async getAccountBalances() {
        return this.financeService.getAccountBalances();
    }

    @Get('reports/company-valuation')
    @ApiOperation({ summary: 'Get company valuation (assets + cash)' })
    async getCompanyValuation() {
        return this.financeService.getCompanyValuation();
    }

    @Get('reports/cashflow-secureness')
    @ApiOperation({ summary: 'Get cash flow secureness (survival months)' })
    async getCashFlowSecureness() {
        return this.financeService.getCashFlowSecureness();
    }

    @Get('reports/operational-costs')
    @ApiOperation({ summary: 'Get operational costs by cost center' })
    async getOperationalCosts() {
        return this.financeService.getOperationalCosts();
    }
}
