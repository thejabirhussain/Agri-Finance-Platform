import { useState } from 'react';
import { useBatches, useRecipes, useCreateBatch, useStartBatch, useCompleteBatch } from '../../api/hooks';
import { Play, CheckCircle, Clock, Plus, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function BatchManager() {
    const { user } = useAuthStore();
    const { data: batches, isLoading } = useBatches();
    const { data: recipes } = useRecipes();

    // Actions - Using mutate directly
    const { mutate: createBatch } = useCreateBatch();
    const { mutate: startBatch } = useStartBatch();
    const { mutate: completeBatch } = useCompleteBatch();

    // Simple state for creating a new batch
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [yieldInput, setYieldInput] = useState<{ [key: string]: string }>({}); // Map batchId -> yield

    const handleCreate = () => {
        if (!selectedRecipe) return;
        createBatch({
            recipeId: selectedRecipe,
            managedBy: user?.id,
            notes: 'Created via Dashboard'
        }, {
            onSuccess: () => alert('Batch Created!'),
            onError: (err: any) => alert('Failed to create: ' + err.message)
        });
    };

    const handleStart = (id: string) => {
        if (confirm('Start production? Input materials will be deducted.')) {
            startBatch(id, {
                onError: (err: any) => alert('Failed to start: ' + err.message)
            });
        }
    };

    const handleComplete = (id: string) => {
        const yieldAmount = yieldInput[id];
        if (!yieldAmount) return alert('Please enter actual yield.');

        if (confirm(`Complete batch with yield: ${yieldAmount}? Output stock will be added.`)) {
            completeBatch({ id, actualYield: Number(yieldAmount) }, {
                onSuccess: () => alert('Batch Completed!'),
                onError: (err: any) => alert('Failed to complete: ' + err.message)
            });
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit' }}>
                        Production Batches
                    </h1>
                    <p className="text-gray-600">Track and manage manufacturing orders</p>
                </div>

                {/* Simple Create Form */}
                <div className="flex gap-2">
                    <select
                        className="input-field py-2"
                        value={selectedRecipe}
                        onChange={(e) => setSelectedRecipe(e.target.value)}
                    >
                        <option value="">Select Recipe...</option>
                        {recipes?.map((r: any) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    <button onClick={handleCreate} className="btn-primary flex items-center gap-2" disabled={!selectedRecipe}>
                        <Plus className="w-4 h-4" />
                        Plan Batch
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-center py-8 text-gray-500">Loading batches...</p>
                ) : (
                    batches?.map((batch: any) => (
                        <div key={batch.id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${batch.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                                        batch.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {batch.status === 'IN_PROGRESS' ? <Play className="w-6 h-6" /> :
                                        batch.status === 'COMPLETED' ? <CheckCircle className="w-6 h-6" /> :
                                            <Clock className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{batch.batchNumber}</h3>
                                    <p className="text-sm font-medium text-indigo-600">{batch.recipe?.name}</p>
                                    <p className="text-xs text-gray-500">
                                        Status: <span className="font-semibold">{batch.status}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                {batch.status === 'PLANNED' && (
                                    <button
                                        onClick={() => handleStart(batch.id)}
                                        className="btn-secondary text-sm flex items-center gap-2"
                                    >
                                        <Play className="w-4 h-4" /> Start
                                    </button>
                                )}

                                {batch.status === 'IN_PROGRESS' && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Actual Yield"
                                            className="input-field w-32 py-1 text-sm"
                                            value={yieldInput[batch.id] || ''}
                                            onChange={(e) => setYieldInput({ ...yieldInput, [batch.id]: e.target.value })}
                                        />
                                        <button
                                            onClick={() => handleComplete(batch.id)}
                                            className="btn-primary text-sm bg-green-600 hover:bg-green-700 border-green-600"
                                        >
                                            Complete
                                        </button>
                                    </div>
                                )}

                                {batch.status === 'COMPLETED' && (
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">{batch.actualYield} {batch.recipe?.outputItem?.unit || 'Units'}</p>
                                        <p className="text-xs text-gray-500">Produced</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {(!batches || batches.length === 0) && !isLoading && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Batches Yet</h3>
                        <p className="text-gray-500">Plan a new batch to start production.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
