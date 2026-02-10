import { useAccountBalances, useCashFlowReport, useAgricultureDashboard } from '../../api/hooks';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Milk, Leaf, Building2, Sparkles, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function Overview() {
    const { data: financeBalances } = useAccountBalances();
    const { data: cashFlow } = useCashFlowReport();
    const { data: agriMetrics } = useAgricultureDashboard();

    // Mock dairy metrics for now
    const dairyMetrics = { totalCows: 12, todayProduction: 45 };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Premium Header */}
            <div className="glass-card p-8 relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
                <div className="absolute top-0 right-0 opacity-10">
                    <Sparkles className="w-64 h-64 text-purple-500" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Outfit' }}>
                        Unified Analytics
                    </h1>
                    <p className="text-xl text-gray-600">
                        Complete business intelligence across Finance, Dairy, and Agriculture
                    </p>
                </div>
            </div>

            {/* Module Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Finance Module */}
                <div className="glass-card p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl">
                            <DollarSign className="w-7 h-7 text-white" />
                        </div>
                        <a href="/finance/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                            View Details <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Outfit' }}>
                        Finance Engine
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Balance</span>
                            <span className="font-bold text-gray-900">
                                {formatCurrency(financeBalances?.totalBalance || 0)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Cash Flow</span>
                            <span className={`font-bold ${cashFlow?.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(cashFlow?.netCashFlow || 0)}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Dairy Module */}
                <div className="glass-card p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                            <Milk className="w-7 h-7 text-white" />
                        </div>
                        <a href="/dairy/dashboard" className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1">
                            View Details <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Outfit' }}>
                        Dairy Operations
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Cows</span>
                            <span className="font-bold text-gray-900">
                                {dairyMetrics?.totalCows || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Today's Production</span>
                            <span className="font-bold text-gray-900">
                                {dairyMetrics?.todayProduction || 0}L
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Agriculture Module */}
                <div className="glass-card p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-xl">
                            <Leaf className="w-7 h-7 text-white" />
                        </div>
                        <a href="/agriculture/dashboard" className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1">
                            View Details <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Outfit' }}>
                        Agriculture
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Fields</span>
                            <span className="font-bold text-gray-900">
                                {agriMetrics?.totalFields || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Active Plantings</span>
                            <span className="font-bold text-gray-900">
                                {agriMetrics?.activePlantings || 0}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Overview */}
            <div className="glass-card p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Outfit' }}>
                    Consolidated Financial Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                        <TrendingUp className="w-8 h-8 mb-3 opacity-90" />
                        <p className="text-sm opacity-90 mb-1">Total Revenue</p>
                        <p className="text-4xl font-black mb-2" style={{ fontFamily: 'Outfit' }}>
                            {formatCurrency(
                                (cashFlow?.income || 0) +
                                (agriMetrics?.totalHarvestValue || 0)
                            )}
                        </p>
                        <p className="text-xs opacity-75">All business units</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white">
                        <TrendingDown className="w-8 h-8 mb-3 opacity-90" />
                        <p className="text-sm opacity-90 mb-1">Total Expenses</p>
                        <p className="text-4xl font-black mb-2" style={{ fontFamily: 'Outfit' }}>
                            {formatCurrency(
                                (cashFlow?.expense || 0) +
                                (agriMetrics?.totalExpenses || 0)
                            )}
                        </p>
                        <p className="text-xs opacity-75">Operational costs</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                        <PieChart className="w-8 h-8 mb-3 opacity-90" />
                        <p className="text-sm opacity-90 mb-1">Net Profit</p>
                        <p className="text-4xl font-black mb-2" style={{ fontFamily: 'Outfit' }}>
                            {formatCurrency(
                                ((cashFlow?.income || 0) + (agriMetrics?.totalHarvestValue || 0)) -
                                ((cashFlow?.expense || 0) + (agriMetrics?.totalExpenses || 0))
                            )}
                        </p>
                        <p className="text-xs opacity-75">Combined profit margin</p>
                    </div>
                </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-5 text-center">
                    <Building2 className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                    <p className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Outfit' }}>
                        {(financeBalances?.accounts?.length || 0) + (dairyMetrics?.totalCows || 0) + (agriMetrics?.totalFields || 0)}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">Total Assets</p>
                </div>

                <div className="glass-card p-5 text-center">
                    <Milk className="w-10 h-10 mx-auto mb-3 text-purple-600" />
                    <p className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Outfit' }}>
                        {dairyMetrics?.totalCows || 0}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">Livestock</p>
                </div>

                <div className="glass-card p-5 text-center">
                    <Leaf className="w-10 h-10 mx-auto mb-3 text-green-600" />
                    <p className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Outfit' }}>
                        {agriMetrics?.totalHarvests || 0}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">Harvests</p>
                </div>

                <div className="glass-card p-5 text-center">
                    <TrendingUp className="w-10 h-10 mx-auto mb-3 text-orange-600" />
                    <p className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Outfit' }}>
                        95%
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">Efficiency</p>
                </div>
            </div>

            {/* Business Intelligence */}
            <div className="glass-card p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit' }}>
                            Business Intelligence Dashboard
                        </h3>
                        <p className="text-gray-600 text-lg">Real-time insights powered by AI and advanced analytics</p>
                    </div>
                    <button className="btn-primary">
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    );
}
