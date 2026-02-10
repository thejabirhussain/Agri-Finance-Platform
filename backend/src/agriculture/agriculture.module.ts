import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgricultureController } from './agriculture.controller';
import { AgricultureService } from './agriculture.service';
import { Field } from './entities/field.entity';
import { Crop } from './entities/crop.entity';
import { Planting } from './entities/planting.entity';
import { Harvest } from './entities/harvest.entity';
import { Expense } from './entities/expense.entity';
import { FinanceModule } from '../finance/finance.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Field,
            Crop,
            Planting,
            Harvest,
            Expense,
        ]),
        FinanceModule,
    ],
    controllers: [AgricultureController],
    providers: [AgricultureService],
    exports: [AgricultureService],
})
export class AgricultureModule { }
