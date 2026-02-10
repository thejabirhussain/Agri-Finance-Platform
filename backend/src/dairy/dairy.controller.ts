import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DairyService } from './dairy.service';
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

@ApiTags('Dairy Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dairy')
export class DairyController {
    constructor(private readonly dairyService: DairyService) { }

    // ============================================
    // COW MANAGEMENT
    // ============================================

    @Post('cows')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Create a new cow' })
    @ApiResponse({ status: 201, description: 'Cow created successfully' })
    async createCow(@Body() dto: CreateCowDto, @Request() req) {
        return this.dairyService.createCow(dto, req.user.userId);
    }

    @Get('cows')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get all cows' })
    async getCows(@Query() filter: CowFilterDto) {
        return this.dairyService.getCows(filter);
    }

    @Get('cows/:id')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get cow by ID' })
    async getCowById(@Param('id') id: string) {
        return this.dairyService.getCowById(id);
    }

    @Put('cows/:id')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Update cow details' })
    async updateCow(@Param('id') id: string, @Body() dto: UpdateCowDto) {
        return this.dairyService.updateCow(id, dto);
    }

    @Delete('cows/:id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Deactivate cow' })
    async deleteCow(@Param('id') id: string) {
        return this.dairyService.deleteCow(id);
    }

    @Get('cows/:id/cost-analysis')
    @Roles('ADMIN', 'DAIRY', 'FINANCE', 'VIEWER')
    @ApiOperation({ summary: 'Get cost analysis for a cow' })
    async getCowCostAnalysis(@Param('id') id: string) {
        return this.dairyService.getCowCostAnalysis(id);
    }

    // ============================================
    // MILK PRODUCTION
    // ============================================

    @Post('milk-production')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Record milk production' })
    async recordMilkProduction(@Body() dto: RecordMilkProductionDto, @Request() req) {
        return this.dairyService.recordMilkProduction(dto, req.user.userId);
    }

    @Post('milk-production/bulk')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Bulk record milk production' })
    async bulkRecordMilkProduction(@Body() dto: BulkMilkProductionDto, @Request() req) {
        return this.dairyService.bulkRecordMilkProduction(dto, req.user.userId);
    }

    @Get('milk-production')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get milk production records' })
    async getMilkProduction(@Query() query: MilkProductionQueryDto) {
        return this.dairyService.getMilkProduction(query);
    }

    @Get('milk-production/daily-summary')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get daily milk production summary' })
    async getDailyMilkSummary(@Query('date') date: string) {
        return this.dairyService.getDailyMilkSummary(new Date(date));
    }

    // ============================================
    // FEEDING MANAGEMENT
    // ============================================

    @Post('feeding/schedule')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Create feeding schedule' })
    async createFeedingSchedule(@Body() dto: CreateFeedingScheduleDto, @Request() req) {
        return this.dairyService.createFeedingSchedule(dto, req.user.userId);
    }

    @Post('feeding/records')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Record feeding' })
    async createFeedingRecord(
        @Body() dto: CreateFeedingRecordDto,
        @Query('accountId') accountId: string,
        @Request() req,
    ) {
        return this.dairyService.createFeedingRecord(dto, req.user.userId, accountId);
    }

    @Get('feeding/records')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get feeding records' })
    async getFeedingRecords(
        @Query('cowId') cowId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.dairyService.getFeedingRecords(
            cowId,
            startDate ? new Date(startDate) : undefined,
            endDate ? new Date(endDate) : undefined,
        );
    }

    // ============================================
    // HEALTH MANAGEMENT
    // ============================================

    @Post('health')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Create health record' })
    async createHealthRecord(
        @Body() dto: CreateHealthRecordDto,
        @Query('accountId') accountId: string,
        @Request() req,
    ) {
        return this.dairyService.createHealthRecord(dto, req.user.userId, accountId);
    }

    @Get('health')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get health records' })
    async getHealthRecords(@Query('cowId') cowId?: string) {
        return this.dairyService.getHealthRecords(cowId);
    }

    @Get('health/upcoming-checkups')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get upcoming checkups' })
    async getUpcomingCheckups() {
        return this.dairyService.getUpcomingCheckups();
    }

    // ============================================
    // BREEDING MANAGEMENT
    // ============================================

    @Post('breeding')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Create breeding record' })
    async createBreedingRecord(
        @Body() dto: CreateBreedingRecordDto,
        @Query('accountId') accountId: string,
        @Request() req,
    ) {
        return this.dairyService.createBreedingRecord(dto, req.user.userId, accountId);
    }

    @Put('breeding/:id')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Update breeding record' })
    async updateBreedingRecord(@Param('id') id: string, @Body() dto: UpdateBreedingRecordDto) {
        return this.dairyService.updateBreedingRecord(id, dto);
    }

    @Get('breeding')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get breeding records' })
    async getBreedingRecords(@Query('cowId') cowId?: string) {
        return this.dairyService.getBreedingRecords(cowId);
    }

    @Get('breeding/upcoming-calvings')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get upcoming calvings' })
    async getUpcomingCalvings() {
        return this.dairyService.getUpcomingCalvings();
    }

    // ============================================
    // CALF MANAGEMENT
    // ============================================

    @Post('calves')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Register a new calf' })
    async registerCalf(@Body() dto: RegisterCalfDto, @Request() req) {
        return this.dairyService.registerCalf(dto, req.user.userId);
    }

    @Put('calves/:id')
    @Roles('ADMIN', 'DAIRY')
    @ApiOperation({ summary: 'Update calf details' })
    async updateCalf(@Param('id') id: string, @Body() dto: UpdateCalfDto) {
        return this.dairyService.updateCalf(id, dto);
    }

    @Get('calves')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get all calves' })
    async getCalves(@Query('status') status?: string) {
        return this.dairyService.getCalves(status);
    }

    // ============================================
    // ANALYTICS & DASHBOARD
    // ============================================

    @Get('dashboard')
    @Roles('ADMIN', 'DAIRY', 'VIEWER')
    @ApiOperation({ summary: 'Get dairy dashboard metrics' })
    async getDairyDashboard() {
        return this.dairyService.getDairyDashboard();
    }
}
