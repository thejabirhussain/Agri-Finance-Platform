import { useWarehouseLocations, useStockTransfers } from '../../api/hooks';
import { Warehouse, ArrowRightLeft, MapPin, Activity } from 'lucide-react';

export default function Dashboard() {
    const { data: locations } = useWarehouseLocations();
    const { data: transfers } = useStockTransfers();

    const stats = [
        {
            name: 'Total Locations',
            value: locations?.length || 0,
            change: 'Active storage units',
            trend: 'neutral',
            icon: MapPin,
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            name: 'Active Transfers',
            value: transfers?.filter((t: any) => t.status === 'PENDING').length || 0,
            change: 'Moving items',
            trend: 'neutral',
            icon: ArrowRightLeft,
            gradient: 'from-orange-500 to-amber-500',
        },
        {
            name: 'Total Transfers',
            value: transfers?.length || 0,
            change: 'All time',
            trend: 'neutral',
            icon: Activity,
            gradient: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                    <Warehouse className="w-64 h-64 text-indigo-500" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit' }}>
                        Warehouse Operations
                    </h1>
                    <p className="text-lg text-gray-600">
                        Manage storage locations, zones, and internal stock movements
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
                <a href="/warehouse/locations" className="glass-card p-6 hover:shadow-lg transition-shadow bg-blue-50/50 block group">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Location Manager</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Configure aisles, shelves, and bins.</p>
                </a>

                <a href="/warehouse/transfers" className="glass-card p-6 hover:shadow-lg transition-shadow bg-orange-50/50 block group">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                            <ArrowRightLeft className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Stock Transfers</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Move items between internal locations.</p>
                </a>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Outfit' }}>
                    Recent Stock Movements
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Transfer ID</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Item</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">From</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">To</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Qty</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transfers?.slice(0, 5).map((transfer: any) => (
                                <tr key={transfer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{transfer.transferNumber || 'TRF-???'}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{transfer.item?.name || 'Unknown Item'}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{transfer.fromLocation?.name || 'Unknown'}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{transfer.toLocation?.name || 'Unknown'}</td>
                                    <td className="py-3 px-4 text-sm font-bold text-gray-900">{transfer.quantity}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transfer.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                            transfer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {transfer.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!transfers || transfers.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        No stock movements recorded yet
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
