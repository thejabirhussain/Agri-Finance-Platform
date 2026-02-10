import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DairyController } from './dairy.controller';
import { DairyService } from './dairy.service';
import { Cow } from './entities/cow.entity';
import { DairyEvent } from './entities/dairy-event.entity';
import { MilkProduction } from './entities/milk-production.entity';
import { FeedingSchedule } from './entities/feeding-schedule.entity';
import { FeedingRecord } from './entities/feeding-record.entity';
import { HealthRecord } from './entities/health-record.entity';
import { BreedingRecord } from './entities/breeding-record.entity';
import { Calf } from './entities/calf.entity';
import { Asset } from '../mdm/entities/asset.entity';
import { Transaction } from '../finance/entities/transaction.entity';
import { Account } from '../mdm/entities/account.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Cow,
            DairyEvent,
            MilkProduction,
            FeedingSchedule,
            FeedingRecord,
            HealthRecord,
            BreedingRecord,
            Calf,
            Asset,
            Transaction,
            Account,
        ]),
    ],
    controllers: [DairyController],
    providers: [DairyService],
    exports: [DairyService],
})
export class DairyModule { }
