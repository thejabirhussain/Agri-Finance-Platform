import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
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
import {
    CreateCowDto,
    UpdateCowDto,
    RecordMilkProductionDto,
    BulkMilkProductionDto,
    CreateFeedingRecordDto,
    CreateFeedingScheduleDto,
    CreateHealthRecordDto,
    CreateBreedingRecordDto,
    UpdateBreedingRecordDto,
    RegisterCalfDto,
    UpdateCalfDto,
    MilkProductionQueryDto,
    CowFilterDto,
} from './dto/dairy.dto';

@Injectable()
export class DairyService {
    constructor(
        @InjectRepository(Cow)
        private cowRepository: Repository<Cow>,
        @InjectRepository(DairyEvent)
        private eventRepository: Repository<DairyEvent>,
        @InjectRepository(MilkProduction)
        private milkRepository: Repository<MilkProduction>,
        @InjectRepository(FeedingSchedule)
        private scheduleRepository: Repository<FeedingSchedule>,
        @InjectRepository(FeedingRecord)
        private feedingRepository: Repository<FeedingRecord>,
        @InjectRepository(HealthRecord)
        private healthRepository: Repository<HealthRecord>,
        @InjectRepository(BreedingRecord)
        private breedingRepository: Repository<BreedingRecord>,
        @InjectRepository(Calf)
        private calfRepository: Repository<Calf>,
        @InjectRepository(Asset)
        private assetRepository: Repository<Asset>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
    ) { }

    // ============================================
    // COW MANAGEMENT
    // ============================================

    async createCow(dto: CreateCowDto, userId: string): Promise<Cow> {
        // Create cow entity
        const cow = this.cowRepository.create({
            ...dto,
            createdBy: userId,
        });

        const savedCow = await this.cowRepository.save(cow);

        // If purchased, create asset and transaction
        if (dto.purchaseDate && dto.purchasePrice && dto.purchasePrice > 0) {
            // Create asset
            const asset = this.assetRepository.create({
                assetCode: `COW-${dto.cowTagNumber}`,
                assetName: dto.cowName,
                assetType: 'LIVESTOCK',
                costCenterId: dto.costCenterId,
                purchaseDate: dto.purchaseDate,
                purchaseValue: dto.purchasePrice,
                currentValue: dto.currentValue || dto.purchasePrice,
                quantity: 1,
                description: `${dto.breed} cow - ${dto.cowName}`,
                createdBy: userId,
            });

            const savedAsset = await this.assetRepository.save(asset);

            // Link asset to cow
            savedCow.assetId = savedAsset.id;
            await this.cowRepository.save(savedCow);

            // Create purchase event
            const event = this.eventRepository.create({
                cowId: savedCow.id,
                eventType: 'PURCHASE',
                eventDate: dto.purchaseDate,
                description: `Cow purchased for ₹${dto.purchasePrice}`,
                createdBy: userId,
            });

            await this.eventRepository.save(event);
        }

        return savedCow;
    }

    async getCows(filter?: CowFilterDto): Promise<Cow[]> {
        const query = this.cowRepository.createQueryBuilder('cow')
            .leftJoinAndSelect('cow.location', 'location')
            .leftJoinAndSelect('cow.costCenter', 'costCenter')
            .leftJoinAndSelect('cow.asset', 'asset');

        if (filter?.status) {
            query.andWhere('cow.status = :status', { status: filter.status });
        }

        if (filter?.breed) {
            query.andWhere('cow.breed = :breed', { breed: filter.breed });
        }

        if (filter?.locationId) {
            query.andWhere('cow.locationId = :locationId', { locationId: filter.locationId });
        }

        if (filter?.isActive !== undefined) {
            query.andWhere('cow.isActive = :isActive', { isActive: filter.isActive });
        }

        return query.getMany();
    }

    async getCowById(id: string): Promise<Cow> {
        const cow = await this.cowRepository.findOne({
            where: { id },
            relations: ['location', 'costCenter', 'asset', 'vendor'],
        });

        if (!cow) {
            throw new NotFoundException(`Cow with ID ${id} not found`);
        }

        return cow;
    }

    async updateCow(id: string, dto: UpdateCowDto): Promise<Cow> {
        const cow = await this.getCowById(id);
        Object.assign(cow, dto);
        return this.cowRepository.save(cow);
    }

    async deleteCow(id: string): Promise<void> {
        const cow = await this.getCowById(id);
        cow.isActive = false;
        await this.cowRepository.save(cow);
    }

    // ============================================
    // MILK PRODUCTION
    // ============================================

    async recordMilkProduction(dto: RecordMilkProductionDto, userId: string): Promise<MilkProduction> {
        // Verify cow exists
        await this.getCowById(dto.cowId);

        const production = this.milkRepository.create({
            ...dto,
            createdBy: userId,
        });

        return this.milkRepository.save(production);
    }

    async bulkRecordMilkProduction(dto: BulkMilkProductionDto, userId: string): Promise<MilkProduction[]> {
        const productions = dto.records.map(record =>
            this.milkRepository.create({
                ...record,
                createdBy: userId,
            })
        );

        return this.milkRepository.save(productions);
    }

    async getMilkProduction(query?: MilkProductionQueryDto): Promise<MilkProduction[]> {
        const queryBuilder = this.milkRepository.createQueryBuilder('mp')
            .leftJoinAndSelect('mp.cow', 'cow')
            .orderBy('mp.productionDate', 'DESC');

        if (query?.cowId) {
            queryBuilder.andWhere('mp.cowId = :cowId', { cowId: query.cowId });
        }

        if (query?.startDate && query?.endDate) {
            queryBuilder.andWhere('mp.productionDate BETWEEN :startDate AND :endDate', {
                startDate: query.startDate,
                endDate: query.endDate,
            });
        }

        return queryBuilder.getMany();
    }

    async getDailyMilkSummary(date: Date): Promise<any> {
        const result = await this.milkRepository
            .createQueryBuilder('mp')
            .select('COUNT(DISTINCT mp.cowId)', 'totalCows')
            .addSelect('SUM(mp.quantityLiters)', 'totalLiters')
            .addSelect('AVG(mp.quantityLiters)', 'avgLitersPerCow')
            .addSelect('AVG(mp.fatPercentage)', 'avgFatPercentage')
            .where('mp.productionDate = :date', { date })
            .getRawOne();

        return result;
    }

    // ============================================
    // FEEDING MANAGEMENT
    // ============================================

    async createFeedingSchedule(dto: CreateFeedingScheduleDto, userId: string): Promise<FeedingSchedule> {
        await this.getCowById(dto.cowId);

        const schedule = this.scheduleRepository.create({
            ...dto,
            createdBy: userId,
        });

        return this.scheduleRepository.save(schedule);
    }

    async createFeedingRecord(dto: CreateFeedingRecordDto, userId: string, accountId: string): Promise<FeedingRecord> {
        const cow = await this.getCowById(dto.cowId);

        // Create feeding record
        const feeding = this.feedingRepository.create({
            ...dto,
            createdBy: userId,
        });

        const savedFeeding = await this.feedingRepository.save(feeding);

        // Create expense transaction
        if (dto.cost > 0) {
            // Get EXPENSE transaction group and Feed category
            const expenseGroup = await this.transactionRepository
                .createQueryBuilder('t')
                .leftJoin('t.transactionGroup', 'tg')
                .where('tg.groupCode = :code', { code: 'EXPENSE' })
                .select('tg.id')
                .getRawOne();

            const transaction = this.transactionRepository.create({
                transactionCode: `FEED-${savedFeeding.id.substring(0, 8)}`,
                transactionDate: dto.feedingDate,
                transactionGroupId: expenseGroup?.tg_id,
                categoryId: cow.costCenterId, // Map to cost center
                accountId: accountId,
                amount: dto.cost,
                description: `Feed expense for cow ${cow.cowTagNumber}`,
                referenceType: 'COW',
                referenceId: cow.id,
                createdBy: userId,
            });

            const savedTransaction = await this.transactionRepository.save(transaction);

            // Update feeding record with transaction ID
            savedFeeding.transactionId = savedTransaction.id;
            await this.feedingRepository.save(savedFeeding);

            // Update account balance
            await this.updateAccountBalance(accountId, -dto.cost);
        }

        return savedFeeding;
    }

    async getFeedingRecords(cowId?: string, startDate?: Date, endDate?: Date): Promise<FeedingRecord[]> {
        const query = this.feedingRepository.createQueryBuilder('fr')
            .leftJoinAndSelect('fr.cow', 'cow')
            .leftJoinAndSelect('fr.product', 'product')
            .orderBy('fr.feedingDate', 'DESC');

        if (cowId) {
            query.andWhere('fr.cowId = :cowId', { cowId });
        }

        if (startDate && endDate) {
            query.andWhere('fr.feedingDate BETWEEN :startDate AND :endDate', { startDate, endDate });
        }

        return query.getMany();
    }

    // ============================================
    // HEALTH MANAGEMENT
    // ============================================

    async createHealthRecord(dto: CreateHealthRecordDto, userId: string, accountId: string): Promise<HealthRecord> {
        const cow = await this.getCowById(dto.cowId);

        const health = this.healthRepository.create({
            ...dto,
            createdBy: userId,
        });

        const savedHealth = await this.healthRepository.save(health);

        // Create expense transaction for medicine cost
        if (dto.medicineCost > 0) {
            const expenseGroup = await this.transactionRepository
                .createQueryBuilder('t')
                .leftJoin('t.transactionGroup', 'tg')
                .where('tg.groupCode = :code', { code: 'EXPENSE' })
                .select('tg.id')
                .getRawOne();

            const transaction = this.transactionRepository.create({
                transactionCode: `VET-${savedHealth.id.substring(0, 8)}`,
                transactionDate: dto.recordDate,
                transactionGroupId: expenseGroup?.tg_id,
                categoryId: cow.costCenterId,
                accountId: accountId,
                amount: dto.medicineCost,
                description: `${dto.recordType} for cow ${cow.cowTagNumber} - ${dto.medicineName || 'Treatment'}`,
                referenceType: 'COW',
                referenceId: cow.id,
                vendorId: dto.vendorId,
                createdBy: userId,
            });

            const savedTransaction = await this.transactionRepository.save(transaction);
            savedHealth.transactionId = savedTransaction.id;
            await this.healthRepository.save(savedHealth);

            await this.updateAccountBalance(accountId, -dto.medicineCost);
        }

        return savedHealth;
    }

    async getHealthRecords(cowId?: string): Promise<HealthRecord[]> {
        const query = this.healthRepository.createQueryBuilder('hr')
            .leftJoinAndSelect('hr.cow', 'cow')
            .leftJoinAndSelect('hr.vendor', 'vendor')
            .orderBy('hr.recordDate', 'DESC');

        if (cowId) {
            query.andWhere('hr.cowId = :cowId', { cowId });
        }

        return query.getMany();
    }

    async getUpcomingCheckups(): Promise<HealthRecord[]> {
        const today = new Date();
        return this.healthRepository.find({
            where: {
                nextCheckupDate: Between(today, new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)),
            },
            relations: ['cow'],
            order: { nextCheckupDate: 'ASC' },
        });
    }

    // ============================================
    // BREEDING MANAGEMENT
    // ============================================

    async createBreedingRecord(dto: CreateBreedingRecordDto, userId: string, accountId: string): Promise<BreedingRecord> {
        const cow = await this.getCowById(dto.cowId);

        const breeding = this.breedingRepository.create({
            ...dto,
            createdBy: userId,
        });

        const savedBreeding = await this.breedingRepository.save(breeding);

        // Create expense transaction for breeding cost
        if (dto.cost > 0) {
            const expenseGroup = await this.transactionRepository
                .createQueryBuilder('t')
                .leftJoin('t.transactionGroup', 'tg')
                .where('tg.groupCode = :code', { code: 'EXPENSE' })
                .select('tg.id')
                .getRawOne();

            const transaction = this.transactionRepository.create({
                transactionCode: `BREED-${savedBreeding.id.substring(0, 8)}`,
                transactionDate: dto.breedingDate,
                transactionGroupId: expenseGroup?.tg_id,
                categoryId: cow.costCenterId,
                accountId: accountId,
                amount: dto.cost,
                description: `${dto.breedingType} for cow ${cow.cowTagNumber}`,
                referenceType: 'COW',
                referenceId: cow.id,
                createdBy: userId,
            });

            const savedTransaction = await this.transactionRepository.save(transaction);
            savedBreeding.transactionId = savedTransaction.id;
            await this.breedingRepository.save(savedBreeding);

            await this.updateAccountBalance(accountId, -dto.cost);
        }

        return savedBreeding;
    }

    async updateBreedingRecord(id: string, dto: UpdateBreedingRecordDto): Promise<BreedingRecord> {
        const breeding = await this.breedingRepository.findOne({ where: { id } });
        if (!breeding) {
            throw new NotFoundException(`Breeding record with ID ${id} not found`);
        }

        Object.assign(breeding, dto);
        return this.breedingRepository.save(breeding);
    }

    async getBreedingRecords(cowId?: string): Promise<BreedingRecord[]> {
        const query = this.breedingRepository.createQueryBuilder('br')
            .leftJoinAndSelect('br.cow', 'cow')
            .leftJoinAndSelect('br.bull', 'bull')
            .orderBy('br.breedingDate', 'DESC');

        if (cowId) {
            query.andWhere('br.cowId = :cowId', { cowId });
        }

        return query.getMany();
    }

    async getUpcomingCalvings(): Promise<BreedingRecord[]> {
        const today = new Date();
        return this.breedingRepository.find({
            where: {
                pregnancyStatus: In(['PENDING', 'CONFIRMED']),
            },
            relations: ['cow'],
            order: { expectedCalvingDate: 'ASC' },
        });
    }

    // ============================================
    // CALF MANAGEMENT
    // ============================================

    async registerCalf(dto: RegisterCalfDto, userId: string): Promise<Calf> {
        await this.getCowById(dto.motherId);

        const calf = this.calfRepository.create({
            ...dto,
            createdBy: userId,
        });

        const savedCalf = await this.calfRepository.save(calf);

        // Create calving event for mother
        const event = this.eventRepository.create({
            cowId: dto.motherId,
            eventType: 'CALVING',
            eventDate: dto.birthDate,
            description: `Calf born: ${dto.calfName} (${dto.gender})`,
            createdBy: userId,
        });

        await this.eventRepository.save(event);

        // Update breeding record if linked
        if (dto.breedingRecordId) {
            await this.breedingRepository.update(dto.breedingRecordId, {
                actualCalvingDate: dto.birthDate,
                pregnancyStatus: 'DELIVERED',
            });
        }

        return savedCalf;
    }

    async updateCalf(id: string, dto: UpdateCalfDto): Promise<Calf> {
        const calf = await this.calfRepository.findOne({ where: { id } });
        if (!calf) {
            throw new NotFoundException(`Calf with ID ${id} not found`);
        }

        Object.assign(calf, dto);
        return this.calfRepository.save(calf);
    }

    async getCalves(status?: string): Promise<Calf[]> {
        const query = this.calfRepository.createQueryBuilder('c')
            .leftJoinAndSelect('c.mother', 'mother')
            .leftJoinAndSelect('c.father', 'father')
            .orderBy('c.birthDate', 'DESC');

        if (status) {
            query.andWhere('c.status = :status', { status });
        }

        return query.getMany();
    }

    // ============================================
    // ANALYTICS & REPORTS
    // ============================================

    async getDairyDashboard(): Promise<any> {
        const totalCows = await this.cowRepository.count({ where: { isActive: true } });
        const activeCows = await this.cowRepository.count({ where: { status: 'ACTIVE', isActive: true } });
        const pregnantCows = await this.cowRepository.count({ where: { status: 'PREGNANT', isActive: true } });
        const dryCows = await this.cowRepository.count({ where: { status: 'DRY', isActive: true } });

        const today = new Date();
        const todayMilk = await this.getDailyMilkSummary(today);

        const upcomingCalvings = await this.getUpcomingCalvings();
        const upcomingCheckups = await this.getUpcomingCheckups();

        return {
            totalCows,
            activeCows,
            pregnantCows,
            dryCows,
            todayMilk,
            upcomingCalvings: upcomingCalvings.length,
            upcomingCheckups: upcomingCheckups.length,
        };
    }

    async getCowCostAnalysis(cowId: string): Promise<any> {
        const cow = await this.getCowById(cowId);

        // Get all transactions for this cow
        const transactions = await this.transactionRepository.find({
            where: {
                referenceType: 'COW',
                referenceId: cowId,
            },
        });

        const totalCost = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

        // Get total milk produced
        const milkStats = await this.milkRepository
            .createQueryBuilder('mp')
            .select('SUM(mp.quantityLiters)', 'totalMilk')
            .addSelect('AVG(mp.quantityLiters)', 'avgDailyMilk')
            .where('mp.cowId = :cowId', { cowId })
            .getRawOne();

        const costPerLiter = milkStats.totalMilk > 0 ? totalCost / Number(milkStats.totalMilk) : 0;

        return {
            cow,
            totalCost,
            totalMilkProduced: Number(milkStats.totalMilk) || 0,
            avgDailyMilk: Number(milkStats.avgDailyMilk) || 0,
            costPerLiter,
        };
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private async updateAccountBalance(accountId: string, amount: number): Promise<void> {
        const account = await this.accountRepository.findOne({ where: { id: accountId } });
        if (account) {
            account.currentBalance = Number(account.currentBalance) + amount;
            await this.accountRepository.save(account);
        }
    }
}
