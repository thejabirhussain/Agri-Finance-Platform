import { Users, Droplets, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { useDairyDashboard, useCows, useUpcomingCalvings, useUpcomingCheckups } from '../../api/hooks';
import StatCard from '../dashboard/components/StatCard';
import Badge from '../../components/ui/Badge';

export default function DairyDashboard() {
    const { data: dashboard, isLoading } = useDairyDashboard();
    const { data: cows } = useCows({ isActive: true });
    const { data: upcomingCalvings } = useUpcomingCalvings();
    const { data: upcomingCheckups } = useUpcomingCheckups();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 animate-pulse">Loading dairy dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dairy Operations</h1>
                    <p className="text-gray-600 mt-1">Real-time insights into your dairy operations.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">Download Report</button>
                    <button className="btn-primary">Add Cow</button>
                </div>
            </div>

            {/* Premium Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Cows"
                    value={dashboard?.totalCows?.toString() || "0"}
                    trend={`${dashboard?.activeCows || 0} Active`}
                    trendUp={true}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Today's Milk"
                    value={`${dashboard?.todayMilk?.totalLiters?.toLocaleString() || 0} L`}
                    trend="Daily Yield"
                    trendUp={true}
                    icon={Droplets}
                    color="emerald"
                />
                <StatCard
                    title="Pregnant Cows"
                    value={dashboard?.pregnantCows?.toString() || "0"}
                    trend={`${dashboard?.upcomingCalvings || 0} Due Soon`}
                    trendUp={true}
                    icon={TrendingUp}
                    color="purple"
                />
                <StatCard
                    title="Health Alerts"
                    value={dashboard?.upcomingCheckups?.toString() || "0"}
                    trend="Action Required"
                    trendUp={false}
                    icon={AlertCircle}
                    color="orange"
                />
            </div>

            {/* Secondary Metrics & Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Cow Status Breakdown</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Lactating</span>
                            <span className="text-sm font-bold text-gray-900">{dashboard?.activeCows || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Dry</span>
                            <span className="text-sm font-bold text-gray-900">{dashboard?.dryCows || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Pregnant</span>
                            <span className="text-sm font-bold text-gray-900">{dashboard?.pregnantCows || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Milk Quality Analysis</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Avg per Cow</span>
                            <span className="text-lg font-bold text-emerald-600">
                                {dashboard?.todayMilk?.avgLitersPerCow?.toFixed(1) || 0} L
                            </span>
                        </div>
                        <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[75%] rounded-full"></div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-600">Avg Fat %</span>
                            <span className="text-lg font-bold text-blue-600">
                                {dashboard?.todayMilk?.avgFatPercentage?.toFixed(1) || 0}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[85%] rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        Upcoming Events
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-600">Calvings</span>
                            <Badge variant="warning">{upcomingCalvings?.length || 0} Due</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-600">Checkups</span>
                            <Badge variant="danger">{upcomingCheckups?.length || 0} Due</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-600">Vaccinations</span>
                            <Badge variant="info">0 Due</Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Cows Table */}
            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Active Cows Directory</h2>
                    <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Tag Number</th>
                                <th>Name</th>
                                <th>Breed</th>
                                <th>Status</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cows?.slice(0, 10).map((cow: any) => (
                                <tr key={cow.id} className="hover:bg-emerald-50/10 cursor-pointer">
                                    <td className="font-medium text-gray-900">
                                        {cow.cowTagNumber}
                                    </td>
                                    <td>
                                        {cow.cowName}
                                    </td>
                                    <td>
                                        {cow.breed}
                                    </td>
                                    <td>
                                        <Badge variant={
                                            cow.status === 'ACTIVE' ? 'success' :
                                                cow.status === 'PREGNANT' ? 'warning' : 'default'
                                        }>
                                            {cow.status}
                                        </Badge>
                                    </td>
                                    <td className="text-gray-500">
                                        {cow.location?.locationName || '-'}
                                    </td>
                                </tr>
                            ))}
                            {(!cows || cows.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No cows found. Add your first cow to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
