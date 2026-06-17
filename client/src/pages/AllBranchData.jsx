import React, { useState, useEffect } from 'react';
import { Table, Search, Calendar, Loader2, X, Building2, User, Wallet, Layers, Eye, ShieldCheck, Building } from 'lucide-react';

const AllBranchData = () => {
    const [allSubmissions, setAllSubmissions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('All');
    const [fetching, setFetching] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchMasterLedger();
    }, []);

    const fetchMasterLedger = async () => {
        const token = localStorage.getItem('token');
        try {
            setFetching(true);
            const response = await fetch('http://localhost:5000/api/salary/admin-all-submissions', {
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });
            const data = await response.json();
            if (response.ok) {
                setAllSubmissions(data);
            }
        } catch (err) {
            console.error('Failed syncing administrative dataset ledger', err);
        } finally {
            setFetching(false);
        }
    };

    const branchesList = ['All', ...new Set(allSubmissions.map(item => item.branch))];

    const filteredData = allSubmissions.filter(item => {
        const matchesSearch =
            item.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.loggedByUser?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesBranch = selectedBranch === 'All' || item.branch === selectedBranch;

        return matchesSearch && matchesBranch;
    });

    const totalPayoutMetrics = filteredData.reduce((acc, curr) => acc + Number(curr.grandTotal || 0), 0);
    const totalSubmissionsCount = filteredData.length;

    const formatINR = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

    return (
        <div className="space-y-6">

            {/* --- ADMINISTRATIVE EXECUTIVE HUD STATS CARD GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-100">
                    <div className="flex justify-between items-start opacity-80"><span className="text-xs font-bold uppercase tracking-wider">Gross Network Payout</span><Wallet size={18} /></div>
                    <h3 className="text-2xl font-black mt-2 font-mono">{formatINR(totalPayoutMetrics)}</h3>
                    <p className="text-[11px] opacity-70 mt-1">Aggregated payroll deployment volume across filtered operations.</p>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100"><ShieldCheck size={24} /></div>
                    <div>
                        <span className="text-xs text-slate-400 block font-bold uppercase">Total Branch Log Entries</span>
                        <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{totalSubmissionsCount} Records</h4>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100"><Building size={24} /></div>
                    <div>
                        <span className="text-xs text-slate-400 block font-bold uppercase">Active Nodes Spanned</span>
                        <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{branchesList.length - 1} Operating Branches</h4>
                    </div>
                </div>
            </div>

            {/* --- MASTER CONTROL BAR & DATATABLE CONTAINER --- */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-100/40 overflow-hidden relative">

                {/* Control Management Panel Bar */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Table size={18} className="text-indigo-600" /> Cross-Branch Audit Console
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Centralized financial data clearinghouse for global branches.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-xl">
                        {/* Branch Selector Dropdown */}
                        <div className="relative w-full sm:w-48">
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                            >
                                {branchesList.map((branch, i) => (
                                    <option key={i} value={branch}>{branch === 'All' ? 'All Operating Branches' : branch}</option>
                                ))}
                            </select>
                        </div>

                        {/* Global Matrix Search Engine Field */}
                        <div className="relative flex-1">
                            <Search className="absolute inset-y-0 left-3 my-auto text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by Employee, Title, or Onboarded User..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none bg-white transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* --- DATATABLE GRID STRUCTURE --- */}
                <div className="overflow-x-auto">
                    {fetching ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Loader2 size={32} className="animate-spin text-indigo-500" />
                            <p className="text-sm font-medium">Extracting global database cluster metrics...</p>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 mb-3">
                                <Table size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">Zero Target Matches Found</h3>
                            <p className="text-xs text-slate-400 mt-1">No operational data files sync with your current tracking rules.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/40 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <th className="py-3.5 px-6">Source Node Branch</th>
                                    <th className="py-3.5 px-6">Target Employee</th>
                                    <th className="py-3.5 px-6 text-right">Fixed Salary</th>
                                    <th className="py-3.5 px-6 text-right">Total Incentives</th>
                                    <th className="py-3.5 px-6 text-right">Grand Payout Net</th>
                                    <th className="py-3.5 px-6 text-center">Audit Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {filteredData.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => setSelectedItem(item)}
                                        className="hover:bg-indigo-50/30 cursor-pointer transition-colors group"
                                    >
                                        {/* Column 1: Source Origin Originator */}
                                        <td className="py-4 px-6">
                                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] rounded-lg tracking-wide border border-indigo-100/60 block w-max uppercase">
                                                {item.branch}
                                            </span>
                                            <span className="text-[10px] text-slate-400 block font-medium mt-1">Operator: {item.loggedByUser}</span>
                                        </td>

                                        {/* Column 2: Identity File Profile */}
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.employeeName}</div>
                                            <div className="text-xs text-slate-400 font-medium mt-0.5">{item.designation}</div>
                                        </td>

                                        {/* Column 3: Fixed Baseline Value */}
                                        <td className="py-4 px-6 text-right font-medium text-slate-700">
                                            {formatINR(item.salary)}
                                        </td>

                                        {/* Column 4: Variable Accumulations Output */}
                                        <td className="py-4 px-6 text-right text-indigo-600 font-medium">
                                            {formatINR(Number(item.grandTotal || 0) - Number(item.salary || 0))}
                                        </td>

                                        {/* Column 5: Net Outbound Total Allocation */}
                                        <td className="py-4 px-6 text-right text-emerald-600 font-bold">
                                            {formatINR(item.grandTotal)}
                                        </td>

                                        {/* Column 6: Option Trigger Action click */}
                                        <td className="py-4 px-6 text-center">
                                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all inline-flex items-center justify-center">
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* --- FULL DATA PROFILE DIALOG DRAWER OVERLAY (MATCHED TO VIEWDATA POPUP UI) --- */}
                {selectedItem && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                        <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out p-6 overflow-y-auto">

                            {/* Drawer Header Layout Controls */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><User size={18} /></div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-bold text-slate-900">{selectedItem.employeeName}</h3>
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wide">
                                                {selectedItem.branch}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">
                                            {selectedItem.designation} • <span className="text-slate-500 font-semibold">Logged by: {selectedItem.loggedByUser}</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Stops table row refire
                                        setSelectedItem(null);
                                    }}
                                    className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content Details Matrix Grid Modules */}
                            <div className="space-y-6 text-sm">

                                {/* Section Module 1: Official Core Banking Details */}
                                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Building2 size={14} /> Bank Details</h4>
                                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-1">
                                        <div>
                                            <span className="text-xs text-slate-400 block">Bank Name</span>
                                            <span className="font-semibold text-slate-800 uppercase text-xs">{selectedItem.bankName}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-400 block">IFSC Code</span>
                                            <span className="font-semibold text-slate-800 uppercase text-xs tracking-wide">{selectedItem.ifscCode}</span>
                                        </div>
                                        <div className="col-span-2 border-t border-slate-200/60 pt-2.5 mt-0.5">
                                            <span className="text-xs text-slate-400 block">Account Number</span>
                                            <span className="font-bold text-slate-900 font-mono tracking-wider">{selectedItem.accountNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section Module 2: Complete Primary Indicator Inputs */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5 mb-3"><Layers size={14} /> Complete Itemized Input Variables</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div className="border border-slate-100 p-3 rounded-xl bg-white shadow-sm">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Renewal</span>
                                            <span className="font-semibold text-slate-800">{formatINR(selectedItem.renewal)}</span>
                                        </div>
                                        <div className="border border-slate-100 p-3 rounded-xl bg-white shadow-sm">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">New Amount</span>
                                            <span className="font-semibold text-slate-800">{formatINR(selectedItem.newAmount)}</span>
                                        </div>
                                        <div className="border border-slate-100 p-3 rounded-xl bg-white shadow-sm">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Gold Coin</span>
                                            <span className="font-semibold text-slate-800">{formatINR(selectedItem.goldCoin)}</span>
                                        </div>
                                        <div className="border border-slate-100 p-3 rounded-xl bg-white shadow-sm">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">GVCN</span>
                                            <span className="font-semibold text-slate-700">{formatINR(selectedItem.gvcn)}</span>
                                        </div>
                                        <div className="border border-slate-100 p-3 rounded-xl bg-white shadow-sm">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">LSS</span>
                                            <span className="font-semibold text-slate-700">{formatINR(selectedItem.lss)}</span>
                                        </div>
                                        <div className="border border-slate-100 p-3 rounded-xl bg-white shadow-sm">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">GVCR</span>
                                            <span className="font-semibold text-slate-700">{formatINR(selectedItem.gvcr)}</span>
                                        </div>
                                        <div className="border border-slate-100 p-3 rounded-xl bg-white shadow-sm">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Trade</span>
                                            <span className="font-semibold text-slate-700">{formatINR(selectedItem.trade)}</span>
                                        </div>
                                        <div className="border border-slate-100 p-3 rounded-xl bg-white shadow-sm">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Land</span>
                                            <span className="font-semibold text-slate-700">{formatINR(selectedItem.land)}</span>
                                        </div>
                                        <div className="border border-slate-100 p-3 rounded-xl bg-white shadow-sm">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Builders</span>
                                            <span className="font-semibold text-slate-700">{formatINR(selectedItem.builders)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section Module 3: System Calculations & Derived Formula Outputs */}
                                <div className="pt-2 border-t border-slate-100">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 mb-3"><Wallet size={14} /> Derived Computations & Allocations</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Total E+F+G+H</span>
                                            <span className="font-bold text-slate-700">{formatINR(selectedItem.totalEFGH)}</span>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Renewal (15%)</span>
                                            <span className="font-bold text-slate-700">{formatINR(selectedItem.renewal15)}</span>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">New (20%)</span>
                                            <span className="font-bold text-slate-700">{formatINR(selectedItem.new20)}</span>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Base Salary Amount</span>
                                            <span className="font-bold text-slate-700">{formatINR(selectedItem.salary)}</span>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Trade + Land + Builders</span>
                                            <span className="font-bold text-slate-700">{formatINR(selectedItem.landPayout)}</span>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Commissions Logged</span>
                                            <span className="font-bold text-slate-700">{formatINR(selectedItem.commissions)}</span>
                                        </div>

                                        {/* Summary Metric Splits */}
                                        <div className="col-span-2 bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex justify-between items-center mt-1">
                                            <span className="text-xs font-bold uppercase text-emerald-800">Grand Total Sum Payout</span>
                                            <span className="text-lg font-black text-emerald-600">{formatINR(selectedItem.grandTotal)}</span>
                                        </div>

                                        <div className="bg-amber-50/40 border border-amber-100/70 p-3 rounded-xl">
                                            <span className="text-[11px] text-amber-700 block uppercase font-bold">10th Release Splitting</span>
                                            <span className="font-black text-amber-600 text-base">{formatINR(selectedItem.payout10th)}</span>
                                        </div>

                                        <div className="bg-amber-50/40 border border-amber-100/70 p-3 rounded-xl">
                                            <span className="text-[11px] text-amber-700 block uppercase font-bold">16th Release Splitting</span>
                                            <span className="font-black text-amber-600 text-base">{formatINR(selectedItem.payout16th)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timestamp Log Data Verification */}
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> Database Submission Timestamp</span>
                                    <span className="font-medium font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                        {new Date(selectedItem.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllBranchData;