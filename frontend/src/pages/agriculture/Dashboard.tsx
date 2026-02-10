import { useAgricultureDashboard } from '../../api/hooks';
import { Leaf, TrendingUp, DollarSign, Sprout, ArrowUpRight, ArrowDownRight, MapPin } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import StatCard from '../dashboard/components/StatCard';

export default function Dashboard() {
    const { data: dashboard } = useAgricultureDashboard();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Agriculture Overview</h1>
                    <p className="text-gray-600 mt-1">Manage your fields, crops, and harvests with precision.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">Download Report</button>
                    <button className="btn-success">Record Harvest</button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Fields"
                    value={dashboard?.totalFields?.toString() || "0"}
                    trend="+2 New"
                    trendUp={true}
                    icon={MapPin}
                    color="emerald"
                />
                <StatCard
                    title="Active Plantings"
                    value={dashboard?.activePlantings?.toString() || "0"}
                    trend="Growing"
                    trendUp={true}
                    icon={Sprout}
                    color="emerald"
                />
                <StatCard
                    title="Total Harvests"
                    value={dashboard?.totalHarvests?.toString() || "0"}
                    trend={dashboard?.totalHarvestValue ? formatCurrency(dashboard.totalHarvestValue) : '₹0'}
                    trendUp={true}
                    icon={Leaf}
                    color="emerald"
                />
                <StatCard
                    title="Net Profit"
                    value={formatCurrency(dashboard?.netProfit || 0)}
                    trend={dashboard?.netProfit >= 0 ? '+Positive' : 'Loss'}
                    trendUp={dashboard?.netProfit >= 0}
                    icon={TrendingUp}
                    color={dashboard?.netProfit >= 0 ? 'emerald' : 'orange'}
                />
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Financial Summary */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        Financial Performance
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium opacity-90">Total Harvest Value</p>
                                <Leaf className="w-5 h-5 opacity-75" />
                            </div>
                            <p className="text-3xl font-black mb-1 font-outfit">
                                {formatCurrency(dashboard?.totalHarvestValue || 0)}
                            </p>
                            <p className="text-xs opacity-75">Revenue from crops</p>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium opacity-90">Total Expenses</p>
                                <DollarSign className="w-5 h-5 opacity-75" />
                            </div>
                            <p className="text-3xl font-black mb-1 font-outfit">
                                {formatCurrency(dashboard?.totalExpenses || 0)}
                            </p>
                            <p className="text-xs opacity-75">All agriculture costs</p>
                        </div>

                        <div className="p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-gray-500 font-medium mb-1">Net Profit Margin</p>
                            <p className={`text-4xl font-black ${dashboard?.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'} font-outfit`}>
                                {formatCurrency(dashboard?.netProfit || 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        Field Operations
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 transition-transform hover:scale-[1.02]">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Fields</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboard?.totalFields || 0}</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <MapPin className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-lime-50 to-green-50 border border-lime-100 transition-transform hover:scale-[1.02]">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Active Plantings</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboard?.activePlantings || 0}</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Sprout className="w-8 h-8 text-lime-600" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 transition-transform hover:scale-[1.02]">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Harvests</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboard?.totalHarvests || 0}</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Leaf className="w-8 h-8 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
