import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { Batch, BatchStatus } from './entities/batch.entity';

import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class ProcessingService {
    constructor(
        @InjectRepository(Recipe)
        private recipeRepository: Repository<Recipe>,
        @InjectRepository(Batch)
        private batchRepository: Repository<Batch>,
        private inventoryService: InventoryService,
    ) { }

    // Recipes
    async createRecipe(createRecipeDto: Partial<Recipe>): Promise<Recipe> {
        const recipe = this.recipeRepository.create(createRecipeDto);
        return this.recipeRepository.save(recipe);
    }

    async findAllRecipes(): Promise<Recipe[]> {
        return this.recipeRepository.find({
            relations: ['outputItem', 'inputs', 'inputs.item'],
            where: { isActive: true }
        });
    }

    async findOneRecipe(id: string): Promise<Recipe> {
        const recipe = await this.recipeRepository.findOne({
            where: { id },
            relations: ['outputItem', 'inputs', 'inputs.item']
        });
        if (!recipe) throw new NotFoundException(`Recipe with ID ${id} not found`);
        return recipe;
    }

    // Batches
    async createBatch(createBatchDto: { recipeId: string; managedBy: string; notes?: string }): Promise<Batch> {
        const recipe = await this.findOneRecipe(createBatchDto.recipeId);
        if (!recipe) throw new BadRequestException('Invalid Recipe ID');

        const batch = this.batchRepository.create({
            batchNumber: `BAT-${Date.now()}`,
            recipeId: createBatchDto.recipeId,
            status: BatchStatus.PLANNED,
            managedBy: createBatchDto.managedBy,
            notes: createBatchDto.notes
        });

        return this.batchRepository.save(batch);
    }

    async startBatch(id: string): Promise<Batch> {
        const batch = await this.batchRepository.findOne({ where: { id } });
        if (!batch) throw new NotFoundException('Batch not found');
        if (batch.status !== BatchStatus.PLANNED) throw new BadRequestException('Batch must be PLANNED to start');

        // Deduct inputs
        // Note: For now assuming 'Main Warehouse' as default location.
        // In real app, batch should specify source location
        const recipe = await this.findOneRecipe(batch.recipeId);
        for (const input of recipe.inputs) {
            await this.inventoryService.updateStock(
                input.itemId,
                'Main Warehouse',
                -input.quantity,
                'PRODUCTION_INPUT'
            );
        }

        batch.status = BatchStatus.IN_PROGRESS;
        batch.startTime = new Date();
        return this.batchRepository.save(batch);
    }

    async completeBatch(id: string, actualYield: number): Promise<Batch> {
        const batch = await this.batchRepository.findOne({
            where: { id },
            relations: ['recipe']
        });
        if (!batch) throw new NotFoundException('Batch not found');
        if (batch.status !== BatchStatus.IN_PROGRESS) throw new BadRequestException('Batch must be IN_PROGRESS to complete');

        // Add output
        await this.inventoryService.updateStock(
            batch.recipe.outputItemId,
            'Main Warehouse',
            actualYield,
            'PRODUCTION_OUTPUT'
        );

        batch.status = BatchStatus.COMPLETED;
        batch.endTime = new Date();
        batch.actualYield = actualYield;

        return this.batchRepository.save(batch);
    }

    async findAllBatches(): Promise<Batch[]> {
        return this.batchRepository.find({
            relations: ['recipe', 'recipe.outputItem'],
            order: { createdAt: 'DESC' }
        });
    }
}
