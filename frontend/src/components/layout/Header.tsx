import { Bell, Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const location = useLocation();

    // Simple breadcrumb logic
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const title = pathSegments.length > 0
        ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
        : 'Dashboard';

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm/50">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div>
                    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                    <p className="text-xs text-gray-500 hidden sm:block">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Search Bar - hidden on mobile */}
                <div className="hidden md:flex relative group">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 w-64 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg text-sm transition-all duration-200 outline-none"
                    />
                </div>

                {/* Notifications */}
                <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-emerald-600 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
            </div>
        </header>
    );
}
