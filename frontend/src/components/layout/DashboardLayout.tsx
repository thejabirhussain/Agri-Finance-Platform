import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

export default function DashboardLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block h-full shadow-xl z-20">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth will-change-scroll">
                    <div className="max-w-7xl mx-auto animate-fade-in-up">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay (Placeholder for now) */}
            {/* In a real implementation, we would toggle Sidebar visibility here */}
        </div>
    );
}
