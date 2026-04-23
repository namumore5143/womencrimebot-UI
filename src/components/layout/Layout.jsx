import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    return (
        <div className="min-h-screen bg-surface-950 flex">
            {/* Sidebar - always visible on desktop */}
            <Sidebar
                isOpen={false}
                onClose={() => {}}
            />

            {/* Main content - proper flex layout without negative margins */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
                <Header onMenuClick={() => {}} />
                <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 transition-all">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

