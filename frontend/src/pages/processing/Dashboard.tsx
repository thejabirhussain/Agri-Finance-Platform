import { useBatches, useRecipes } from '../../api/hooks';
import { Factory, Play, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
    const { data: batches } = useBatches();
    const { data: recipes } = useRecipes();

    const activeBatches = batches?.filter((b: any) => b.status === 'IN_PROGRESS') || [];
    const completedBatches = batches?.filter((b: any) => b.status === 'COMPLETED') || [];

    const stats = [
        {
            name: 'Active Batches',
            value: activeBatches.length,
            change: 'In production',
            trend: 'neutral',
            icon: Play,
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            name: 'Total Recipes',
            value: recipes?.length || 0,
            change: 'Standard formulas',
            trend: 'neutral',
            icon: Factory,
            gradient: 'from-orange-500 to-amber-500',
        },
        {
            name: 'Completed (Total)',
            value: completedBatches.length,
            change: 'All time',
            trend: 'neutral',
            icon: CheckCircle,
            gradient: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                    <Factory className="w-64 h-64 text-purple-500" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit' }}>
                        Processing & Manufacturing
                    </h1>
                    <p className="text-lg text-gray-600">
                        Convert raw materials into finished goods (Cheese, Butter, Yogurt)
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="stat-card group cursor-pointer"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">{stat.name}</p>
                                <p className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Outfit' }}>
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a href="/processing/recipes" className="glass-card p-6 hover:shadow-lg transition-shadow bg-amber-50/50 block group">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                            <Factory className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Formula & Recipes</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Manage standard production Bills of Materials.</p>
                </a>

                <a href="/processing/batches" className="glass-card p-6 hover:shadow-lg transition-shadow bg-indigo-50/50 block group">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                            <Play className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Production Batches</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Plan, start, and track manufacturing.</p>
                </a>
            </div>

            {/* Active Production */}
            <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
                    <Play className="w-5 h-5 text-green-500" />
                    Live Production
                </h3>

                <div className="space-y-4">
                    {activeBatches.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No batches currently in progress.</p>
                        </div>
                    ) : (
                        activeBatches.map((batch: any) => (
                            <div key={batch.id} className="p-4 border border-gray-100 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-900">{batch.recipe?.name || 'Unknown Recipe'}</p>
                                    <p className="text-xs text-gray-500">{batch.batchNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-blue-600">In Progress</p>
                                    <p className="text-xs text-gray-500">Started: {new Date(batch.startTime).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
