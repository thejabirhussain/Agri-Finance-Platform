import { useInventoryDashboard } from '../../api/hooks';
import { Package, TrendingDown, ShoppingCart, AlertTriangle, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export default function Dashboard() {
    const { data: dashboard } = useInventoryDashboard();

    const stats = [
        {
            name: 'Total Items',
            value: dashboard?.totalItems || 0,
            change: 'In catalog',
            trend: 'neutral',
            icon: Package,
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            name: 'Stock Value',
            value: formatCurrency(dashboard?.totalStockValue || 0),
            change: 'Current value',
            trend: 'up',
            icon: DollarSign,
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            name: 'Low Stock Items',
            value: dashboard?.lowStockItems || 0,
            change: 'Need reorder',
            trend: dashboard?.lowStockItems > 0 ? 'down' : 'neutral',
            icon: AlertTriangle,
            gradient: dashboard?.lowStockItems > 0 ? 'from-red-500 to-pink-500' : 'from-gray-400 to-gray-500',
        },
        {
            name: 'Active POs',
            value: dashboard?.activePurchaseOrders || 0,
            change: 'In progress',
            trend: 'neutral',
            icon: ShoppingCart,
            gradient: 'from-orange-500 to-amber-500',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                    <Package className="w-64 h-64 text-blue-500" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit' }}>
                        Inventory Overview
                    </h1>
                    <p className="text-lg text-gray-600">
                        Manage your stock levels, purchase orders, and inventory movements
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const TrendIcon = stat.trend === 'up' ? ArrowUpRight : stat.trend === 'down' ? ArrowDownRight : null;

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
                                {TrendIcon && (
                                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${stat.trend === 'up'
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-red-50 text-red-600'
                                        }`}>
                                        <TrendIcon className="w-4 h-4" />
                                        <span className="text-xs">{stat.change}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">{stat.name}</p>
                                <p className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Outfit' }}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stock Status */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Outfit' }}>
                        Stock Status
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium opacity-90">Total Value</p>
                                <DollarSign className="w-5 h-5 opacity-75" />
                            </div>
                            <p className="text-3xl font-black mb-1" style={{ fontFamily: 'Outfit' }}>
                                {formatCurrency(dashboard?.totalStockValue || 0)}
                            </p>
                            <p className="text-xs opacity-75">Current inventory value</p>
                        </div>

                        {dashboard?.lowStockItems > 0 && (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium opacity-90">Low Stock Alert</p>
                                    <AlertTriangle className="w-5 h-5 opacity-75" />
                                </div>
                                <p className="text-3xl font-black mb-1" style={{ fontFamily: 'Outfit' }}>
                                    {dashboard?.lowStockItems}
                                </p>
                                <p className="text-xs opacity-75">Items need reordering</p>
                            </div>
                        )}

                        <div className="p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
                            <div className="text-center">
                                <p className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Outfit' }}>
                                    {dashboard?.totalItems || 0}
                                </p>
                                <p className="text-sm text-gray-600 font-semibold">Total Items in Catalog</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Purchase Orders */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Outfit' }}>
                        Procurement
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Active Purchase Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboard?.activePurchaseOrders || 0}</p>
                            </div>
                            <ShoppingCart className="w-10 h-10 text-orange-500" />
                        </div>

                        <div className="p-4 rounded-xl border border-gray-200 bg-white">
                            <p className="text-sm text-gray-600 mb-2">Quick Actions</p>
                            <div className="flex gap-2">
                                <button className="btn-primary flex-1 text-sm">New PO</button>
                                <button className="btn-secondary flex-1 text-sm">Stock In</button>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                            <p className="text-sm text-gray-600 font-medium mb-1">Inventory Health</p>
                            <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '85%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">85% stock availability</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="glass-card p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit' }}>
                            Optimize your inventory
                        </h3>
                        <p className="text-gray-600">Track stock levels and automate reordering</p>
                    </div>
                    <button className="btn-primary">
                        View Stock Levels
                    </button>
                </div>
            </div>
        </div>
    );
}
