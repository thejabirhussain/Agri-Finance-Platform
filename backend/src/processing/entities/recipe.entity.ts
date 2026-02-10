import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InventoryItem } from '../../inventory/entities/inventory-item.entity';

@Entity('processing_recipes')
export class Recipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name', length: 100 })
    name: string; // e.g., "Cheddar Cheese Production"

    @Column({ name: 'code', length: 50, unique: true })
    code: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'output_item_id' })
    outputItemId: string;

    @ManyToOne(() => InventoryItem)
    @JoinColumn({ name: 'output_item_id' })
    outputItem: InventoryItem;

    @Column({ name: 'expected_yield', type: 'decimal', precision: 10, scale: 2 })
    expectedYield: number; // e.g., 10 (kg)

    @Column({ name: 'yield_unit', length: 20 })
    yieldUnit: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @OneToMany(() => RecipeInput, (input) => input.recipe, { cascade: true })
    inputs: RecipeInput[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

@Entity('processing_recipe_inputs')
export class RecipeInput {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'recipe_id' })
    recipeId: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.inputs)
    @JoinColumn({ name: 'recipe_id' })
    recipe: Recipe;

    @Column({ name: 'item_id' })
    itemId: string;

    @ManyToOne(() => InventoryItem)
    @JoinColumn({ name: 'item_id' })
    item: InventoryItem;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number; // e.g., 100 (Liters of Milk)

    @Column({ name: 'unit', length: 20 }) // e.g., 'Liters'
    unit: string;
}
