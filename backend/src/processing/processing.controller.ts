import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ProcessingService } from './processing.service';
import { Recipe } from './entities/recipe.entity';

@Controller('processing')
export class ProcessingController {
    constructor(private readonly processingService: ProcessingService) { }

    // Recipes
    @Post('recipes')
    createRecipe(@Body() createRecipeDto: Partial<Recipe>) {
        return this.processingService.createRecipe(createRecipeDto);
    }

    @Get('recipes')
    findAllRecipes() {
        return this.processingService.findAllRecipes();
    }

    @Get('recipes/:id')
    findOneRecipe(@Param('id') id: string) {
        return this.processingService.findOneRecipe(id);
    }

    // Batches
    @Post('batches')
    createBatch(@Body() createBatchDto: { recipeId: string; managedBy: string; notes?: string }) {
        return this.processingService.createBatch(createBatchDto);
    }

    @Post('batches/:id/start')
    startBatch(@Param('id') id: string) {
        return this.processingService.startBatch(id);
    }

    @Post('batches/:id/complete')
    completeBatch(@Param('id') id: string, @Body('actualYield') actualYield: number) {
        return this.processingService.completeBatch(id, actualYield);
    }

    @Get('batches')
    findAllBatches() {
        return this.processingService.findAllBatches();
    }
}
