import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Database, Table, LogOut, User, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../assets/logo.png';

const UserLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.clear();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const menuItems = [
        { path: '/user/data-entry', name: 'Data Entry', icon: <Database size={18} /> },
        { path: '/user/view-data', name: 'View Submissions', icon: <Table size={18} /> },
        { path: '/user/profile', name: 'Profile', icon: <User size={18} /> },
    ];

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden relative">
            
            {/* --- DESKTOP SIDEBAR --- */}
            <div className="hidden lg:flex w-64 bg-slate-900 text-white flex-col justify-between border-r border-slate-800 shrink-0">
                <div>
                    <div className="p-6 border-b border-slate-800 flex flex-col gap-1">
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center shrink-0">
                                <img src={Logo} alt="AVG Logo" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="font-extrabold text-xl tracking-wider text-white antialiased">AVG</span>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mt-1 pl-0.5">User Portal</span>
                    </div>

                    <nav className="p-4 space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {user.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-200 truncate">{user.name || 'User Name'}</p>
                            <p className="text-xs text-slate-500 truncate">{user.branch || 'Branch Workspace'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MOBILE ACCESSIBILITY INTERACTIVE DRAWER BACKDROP --- */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* --- MOBILE ACCESSIBILITY SLIDE-OUT DRAWER --- */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div>
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2.5">
                                <img src={Logo} alt="AVG Logo" className="w-8 h-8 object-contain" />
                                <span className="font-extrabold text-xl tracking-wider text-white">AVG</span>
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 pl-0.5">User Portal</span>
                        </div>
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <nav className="p-4 space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800/60'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {user.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-200 truncate">{user.name || 'User Name'}</p>
                            <p className="text-xs text-slate-500 truncate">{user.branch || 'Branch Workspace'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN MAIN FRAMEWORK CANVAS CONTAINER WORKSPACE --- */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Upper Platform Navbar Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10 shrink-0 shadow-sm shadow-slate-100/40">
                    <div className="flex items-center gap-3">
                        {/* Hamburger Button visible only on smaller displays */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="font-medium text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60 flex items-center gap-1.5 max-w-[180px] sm:max-w-none truncate">
                                <User size={14} className="text-indigo-600 shrink-0" /> 
                                <span className="truncate">Workspace: {user.branch || 'Assigned'}</span>
                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 sm:px-3.5 py-2 rounded-xl transition-all duration-200"
                        >
                            <LogOut size={14} className="stroke-[2.5]" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Content View Outlet viewport */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout;