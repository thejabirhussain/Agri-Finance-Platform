import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe, RecipeInput } from './entities/recipe.entity';
import { Batch } from './entities/batch.entity';
import { ProcessingService } from './processing.service';
import { ProcessingController } from './processing.controller';

import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Recipe,
            RecipeInput,
            Batch
        ]),
        InventoryModule
    ],
    controllers: [ProcessingController],
    providers: [ProcessingService],
    exports: [ProcessingService]
})
export class ProcessingModule { }
