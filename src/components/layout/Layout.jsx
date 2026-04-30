import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-surface-950 flex flex-col lg:flex-row">
            {/* Sidebar - drawer on mobile, fixed on desktop */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-screen w-full lg:ml-72">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 transition-all overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
