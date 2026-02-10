import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { TransactionGroup } from './entities/transaction-group.entity';
import { FinCategory } from './entities/fin-category.entity';
import { FinSubcategory } from './entities/fin-subcategory.entity';
import { BudgetGroup } from './entities/budget-group.entity';
import { Budget } from './entities/budget.entity';
import { BudgetItem } from './entities/budget-item.entity';
import { Transaction } from './entities/transaction.entity';
import { Account } from '../mdm/entities/account.entity';
import { Asset } from '../mdm/entities/asset.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TransactionGroup,
            FinCategory,
            FinSubcategory,
            BudgetGroup,
            Budget,
            BudgetItem,
            Transaction,
            Account,
            Asset,
        ]),
    ],
    controllers: [FinanceController],
    providers: [FinanceService],
    exports: [FinanceService],
})
export class FinanceModule { }
