import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AgricultureService } from './agriculture.service';
import { Field } from './entities/field.entity';
import { Planting } from './entities/planting.entity';
import { Harvest } from './entities/harvest.entity';
import { Expense } from './entities/expense.entity';

@Controller('agriculture')
@UseGuards(AuthGuard('jwt'))
export class AgricultureController {
    constructor(private readonly agricultureService: AgricultureService) { }

    // ===== FIELDS =====
    @Post('fields')
    createField(@Body() data: Partial<Field>) {
        return this.agricultureService.createField(data);
    }

    @Get('fields')
    findAllFields() {
        return this.agricultureService.findAllFields();
    }

    @Get('fields/:id')
    findFieldById(@Param('id') id: string) {
        return this.agricultureService.findFieldById(id);
    }

    @Put('fields/:id')
    updateField(@Param('id') id: string, @Body() data: Partial<Field>) {
        return this.agricultureService.updateField(id, data);
    }

    @Delete('fields/:id')
    deleteField(@Param('id') id: string) {
        return this.agricultureService.deleteField(id);
    }

    // ===== CROPS =====
    @Get('crops')
    findAllCrops() {
        return this.agricultureService.findAllCrops();
    }

    @Get('crops/:id')
    findCropById(@Param('id') id: string) {
        return this.agricultureService.findCropById(id);
    }

    // ===== PLANTINGS =====
    @Post('plantings')
    createPlanting(@Body() data: Partial<Planting>) {
        return this.agricultureService.createPlanting(data);
    }

    @Get('plantings')
    findAllPlantings() {
        return this.agricultureService.findAllPlantings();
    }

    @Get('plantings/:id')
    findPlantingById(@Param('id') id: string) {
        return this.agricultureService.findPlantingById(id);
    }

    @Put('plantings/:id')
    updatePlanting(@Param('id') id: string, @Body() data: Partial<Planting>) {
        return this.agricultureService.updatePlanting(id, data);
    }

    // ===== HARVESTS =====
    @Post('harvests')
    recordHarvest(@Body() data: Partial<Harvest>, @Req() req: any) {
        return this.agricultureService.recordHarvest(data, req.user.userId);
    }

    @Get('harvests')
    findAllHarvests() {
        return this.agricultureService.findAllHarvests();
    }

    @Get('harvests/summary')
    getHarvestSummary() {
        return this.agricultureService.getHarvestSummary();
    }

    // ===== EXPENSES =====
    @Post('expenses')
    recordExpense(@Body() data: Partial<Expense>, @Req() req: any) {
        return this.agricultureService.recordExpense(data, req.user.userId);
    }

    @Get('expenses')
    findAllExpenses() {
        return this.agricultureService.findAllExpenses();
    }

    // ===== DASHBOARD =====
    @Get('dashboard')
    getDashboardMetrics() {
        return this.agricultureService.getDashboardMetrics();
    }
}
