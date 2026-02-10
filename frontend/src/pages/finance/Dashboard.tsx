import { useAccountBalances, useCashFlowReport, useCompanyValuation, useCashFlowSecureness } from '../../api/hooks';
import { TrendingUp, TrendingDown, DollarSign, PieChart, AlertCircle, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import StatCard from '../dashboard/components/StatCard';
import TransactionsTable from './components/TransactionsTable';

export default function Dashboard() {
    const { data: balances } = useAccountBalances();
    const { data: cashFlow } = useCashFlowReport();
    const { data: valuation } = useCompanyValuation();
    const { data: secureness } = useCashFlowSecureness();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Finance Overview</h1>
                    <p className="text-gray-500 mt-1">Real-time insights into your financial performance.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">Download Report</button>
                    <button className="btn-primary">Add Transaction</button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Balance"
                    value={formatCurrency(balances?.totalBalance || 0)}
                    trend="+12.5%"
                    trendUp={true}
                    icon={DollarSign}
                    color="blue"
                />
                <StatCard
                    title="Company Valuation"
                    value={formatCurrency(valuation?.totalValuation || 0)}
                    trend="+8.2%"
                    trendUp={true}
                    icon={TrendingUp}
                    color="purple"
                />
                <StatCard
                    title="Net Cash Flow"
                    value={formatCurrency(cashFlow?.netCashFlow || 0)}
                    trend={cashFlow?.netCashFlow >= 0 ? '+5.4%' : '-3.2%'}
                    trendUp={cashFlow?.netCashFlow >= 0}
                    icon={PieChart}
                    color={cashFlow?.netCashFlow >= 0 ? 'emerald' : 'orange'}
                />
                <StatCard
                    title="Runway"
                    value={`${secureness?.survivalMonths || 0} Months`}
                    trend={secureness?.status || 'Unknown'}
                    trendUp={secureness?.status === 'HEALTHY'}
                    icon={AlertCircle}
                    color="orange"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Transactions Table Section */}
                <div className="xl:col-span-2 space-y-6">
                    <TransactionsTable />
                </div>

                {/* Account Distribution Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Account Distribution</h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium opacity-90">Bank Accounts</p>
                                    <p className="text-xs opacity-75">{balances?.accounts?.filter((a: any) => a.accountType === 'BANK').length || 0} accounts</p>
                                </div>
                                <p className="text-3xl font-black mb-1 font-outfit">
                                    {formatCurrency(balances?.totalBank || 0)}
                                </p>
                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full"
                                        style={{ width: `${((balances?.totalBank || 0) / (balances?.totalBalance || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium opacity-90">Cash Accounts</p>
                                    <p className="text-xs opacity-75">{balances?.accounts?.filter((a: any) => a.accountType === 'CASH').length || 0} accounts</p>
                                </div>
                                <p className="text-3xl font-black mb-1 font-outfit">
                                    {formatCurrency(balances?.totalCash || 0)}
                                </p>
                                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full"
                                        style={{ width: `${((balances?.totalCash || 0) / (balances?.totalBalance || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Health</h3>
                        <div className={`px-6 py-4 rounded-2xl font-black text-2xl text-center ${secureness?.status === 'HEALTHY' ? 'bg-green-100 text-green-700' :
                            secureness?.status === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {secureness?.status || 'UNKNOWN'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
