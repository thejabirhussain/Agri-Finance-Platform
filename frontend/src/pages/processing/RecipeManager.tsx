import { useRecipes } from '../../api/hooks';
import { ChefHat, Plus, ScrollText, ArrowRight } from 'lucide-react';

export default function RecipeManager() {
    const { data: recipes, isLoading } = useRecipes();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit' }}>
                        Recipe Management
                    </h1>
                    <p className="text-gray-600">Standard formulas for production</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Recipe
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p className="col-span-3 text-center py-8 text-gray-500">Loading recipes...</p>
                ) : (
                    recipes?.map((recipe: any) => (
                        <div key={recipe.id} className="glass-card p-6 relative group hover:shadow-lg transition-shadow">
                            <div className="absolute top-4 right-4 text-gray-300 group-hover:text-indigo-500 transition-colors">
                                <ScrollText className="w-6 h-6" />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1">{recipe.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{recipe.description || 'No description'}</p>

                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Produces</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <p className="font-bold text-gray-900">{recipe.outputItem?.name} <span className="text-gray-500 text-xs">x{recipe.outputQuantity}</span></p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Requires</p>
                                    <ul className="space-y-1">
                                        {recipe.inputs?.map((input: any) => (
                                            <li key={input.id} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700">{input.item?.name}</span>
                                                <span className="font-medium text-gray-900">{input.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {(!recipes || recipes.length === 0) && !isLoading && (
                    <div className="col-span-3 text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Recipes Found</h3>
                        <p className="text-gray-500 mb-4">Create your first production formula to get started.</p>
                        <button className="btn-secondary">Create Recipe</button>
                    </div>
                )}
            </div>
        </div>
    );
}
