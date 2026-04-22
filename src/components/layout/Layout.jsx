import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar receives open state + close handler */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content — offset only on desktop where sidebar is fixed */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-2 md:p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
