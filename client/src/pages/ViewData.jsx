import React, { useState, useEffect } from 'react';
import { Table, Search, Calendar, Loader2, X, Building2, User, Wallet, Layers, Eye } from 'lucide-react';

const ViewData = () => {
  const [submissions, setSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetching, setFetching] = useState(true);

  // Track selected row item for deep matrix analysis view
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const token = localStorage.getItem('token');
    try {
      setFetching(true);
      const response = await fetch('http://localhost:5000/api/salary/my-submissions', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const data = await response.json();
      if (response.ok) {
        setSubmissions(data);
      }
    } catch (err) {
      console.error('Failed syncing log matrix data', err);
    } finally {
      setFetching(false);
    }
  };

  const filteredData = submissions.filter(item =>
    item.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format helper to maintain consistent localization rendering rules
  const formatINR = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-100/40 overflow-hidden relative">

      {/* --- HEADER CONTROL COMPONENT MATRIX --- */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Table size={18} className="text-indigo-600" /> Complete Transaction Audits
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Click any record row to inspect full itemized variables and banking logs.</p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute inset-y-0 left-3 my-auto text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none bg-white transition-all"
          />
        </div>
      </div>

      {/* --- DATA MATRIX VIEWER TABLE --- */}
      <div className="overflow-x-auto">
        {fetching ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
            <p className="text-sm font-medium">Syncing data ledger matrices...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 mb-3">
              <Table size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Compensation Statements Discovered</h3>
            <p className="text-xs text-slate-400 mt-1">Submit payroll metrics inside the Data Entry tab first.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/40 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Employee Info</th>
                <th className="py-3.5 px-4 text-center">Core Metrics</th>
                <th className="py-3.5 px-6 text-right">Base Salary</th>
                <th className="py-3.5 px-6 text-right">Grand Total</th>
                <th className="py-3.5 px-6 text-right">10th Release</th>
                <th className="py-3.5 px-6 text-right">16th Release</th>
                <th className="py-3.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="hover:bg-indigo-50/30 cursor-pointer transition-colors group"
                >
                  {/* Column 1: Identity Profile Summary */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.employeeName}</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">{item.designation}</div>
                  </td>

                  {/* Column 2: Core Matrix Structural Breakdowns */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[280px] mx-auto text-[11px] font-medium">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">RNW: {formatINR(item.renewal)}</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">NEW: {formatINR(item.newAmount)}</span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">GOLD: {formatINR(item.goldCoin)}</span>
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md">EFGH: {formatINR(item.totalEFGH)}</span>
                    </div>
                  </td>

                  {/* Column 3: Fixed Salary Matrix */}
                  <td className="py-4 px-6 text-right font-medium text-slate-700">
                    {formatINR(item.salary)}
                  </td>

                  {/* Column 4: Grand Total Calculations */}
                  <td className="py-4 px-6 text-right text-emerald-600 font-bold">
                    {formatINR(item.grandTotal)}
                  </td>

                  {/* Column 5: Split Chronology 10th */}
                  <td className="py-4 px-6 text-right text-slate-600 font-medium bg-slate-50/30">
                    {formatINR(item.payout10th)}
                  </td>

                  {/* Column 6: Split Chronology 16th */}
                  <td className="py-4 px-6 text-right text-slate-600 font-medium bg-slate-50/50">
                    {formatINR(item.payout16th)}
                  </td>

                  {/* Column 7: Explicit Inspect Option */}
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

      {/* --- FULL DATA PROFILE DIALOG DRAWER OVERLAY --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out p-6 overflow-y-auto">

            {/* Drawer Header Layout Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><User size={18} /></div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedItem.employeeName}</h3>
                  <p className="text-xs text-slate-400 font-medium">{selectedItem.designation}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
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
  );
};

export default ViewData;