import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Home,
    LayoutDashboard,
    Banknote,
    Milk,
    Sprout,
    Package,
    PieChart,
    Settings,
    ChevronLeft,
    ChevronRight,
    Menu,
    Factory,
    Tractor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuthStore();
    const location = useLocation();

    const navigation = [
        { name: 'Overview', to: '/dashboard', icon: LayoutDashboard, exact: true },
        { name: 'Finance', to: '/finance/dashboard', icon: Banknote },
        { name: 'Dairy', to: '/dairy/dashboard', icon: Milk },
        { name: 'Agriculture', to: '/agriculture/dashboard', icon: Sprout },
        { name: 'Inventory', to: '/inventory/dashboard', icon: Package },
        { name: 'Processing', to: '/processing/dashboard', icon: Factory }, // Phase 4
        { name: 'Planning', to: '/analytics/overview', icon: Tractor }, // Phase 6 - mapped to analytics for now
        { name: 'Analytics', to: '/analytics/overview', icon: PieChart },
        { name: 'Settings', to: '/settings', icon: Settings },
    ];

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div
            className={cn(
                "flex flex-col h-screen bg-slate-900 text-white transition-all duration-300 border-r border-slate-800",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className="flex items-center justify-between p-4 h-16 border-b border-slate-800">
                {!collapsed && (
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-emerald-400">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Sprout className="w-5 h-5" />
                        </div>
                        <span>FarmOS</span>
                    </div>
                )}
                {collapsed && (
                    <div className="w-full flex justify-center">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Sprout className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                )}

                <button
                    onClick={toggleCollapse}
                    className={cn(
                        "p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors",
                        collapsed && "hidden"
                    )}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.to);

                    return (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                isActive
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20 font-medium"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />

                            {!collapsed && (
                                <span className="truncate">{item.name}</span>
                            )}

                            {/* Tooltip for collapsed mode */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
                                    {item.name}
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-slate-800">
                <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                    <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium shadow-lg shadow-indigo-500/20">
                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.fullName || 'User'}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.email || 'email@example.com'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
