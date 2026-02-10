import StatCard from './dashboard/components/StatCard';
import RecentGrid from './dashboard/components/RecentGrid';
import {
    Banknote,
    Milk,
    Sprout,
    Users
} from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Farm Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, here's what's happening on the farm today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">Download Report</button>
                    <button className="btn-primary">New Transaction</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="₹12,45,000"
                    trend="+12.5%"
                    trendUp={true}
                    icon={Banknote}
                    color="emerald"
                />
                <StatCard
                    title="Milk Production"
                    value="2,340 L"
                    trend="+8.2%"
                    trendUp={true}
                    icon={Milk}
                    color="blue"
                />
                <StatCard
                    title="Active Crops"
                    value="145 Acres"
                    trend="-2.1%"
                    trendUp={false}
                    icon={Sprout}
                    color="orange"
                />
                <StatCard
                    title="Active Partners"
                    value="24"
                    trend="+1"
                    trendUp={true}
                    icon={Users}
                    color="purple"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Placeholder for now) */}
                <div className="lg:col-span-2 glass-card p-6 min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Financial Performance</h3>
                        <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center h-[300px] bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-400">Chart Component (Recharts) Coming Soon</p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-1">
                    <RecentGrid />
                </div>
            </div>
        </div>
    );
}
