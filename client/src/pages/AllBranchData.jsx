import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Search,
  Calendar,
  Loader2,
  X,
  Building2,
  User,
  Wallet,
  Layers,
  Eye,
  ShieldCheck,
  Building
} from 'lucide-react';

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
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      const data = await response.json();
      if (response.ok) {
        setAllSubmissions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed syncing administrative dataset ledger', err);
    } finally {
      setFetching(false);
    }
  };

  const formatINR = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  const formatMonth = (dateValue) => {
    if (!dateValue) return '-';
    return new Date(dateValue).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric'
    });
  };

  const normalizeRow = (item) => ({
    id: item.id,
    branch: item.branch || item.branch_name || 'Unknown',
    loggedByUser: item.loggedByUser || item.logged_by_user || '-',
    employeeName: item.employeeName || item.employee_name || '-',
    designation: item.designation || '-',
    bankName: item.bankName || item.bank_name || '-',
    accountNumber: item.accountNumber || item.account_number || '-',
    ifscCode: item.ifscCode || item.ifsc_code || '-',
    salaryMonth: item.salaryMonth || item.salary_month || null,
    renewal: item.renewal ?? 0,
    newAmount: item.newAmount ?? item.new_amount ?? 0,
    goldCoin: item.goldCoin ?? item.gold_coin ?? 0,
    gvcn: item.gvcn ?? 0,
    lss: item.lss ?? 0,
    gvcr: item.gvcr ?? 0,
    trade: item.trade ?? 0,
    land: item.land ?? 0,
    builders: item.builders ?? 0,
    totalEFGH: item.totalEFGH ?? item.total_efgh ?? 0,
    renewal15: item.renewal15 ?? item.renewal_15 ?? 0,
    new20: item.new20 ?? item.new_20 ?? 0,
    salary: item.salary ?? 0,
    landPayout: item.landPayout ?? item.land_payout ?? 0,
    commissions: item.commissions ?? 0,
    grandTotal: item.grandTotal ?? item.grand_total ?? 0,
    payout10th: item.payout10th ?? item.payout_10th ?? 0,
    payout16th: item.payout16th ?? item.payout_16th ?? 0,
    created_at: item.created_at || item.createdAt || null
  });

  const groupedData = useMemo(() => {
    const map = new Map();

    const flatRows = allSubmissions.flatMap((item) => {
      if (Array.isArray(item.months) && item.months.length > 0) {
        const base = normalizeRow(item);
        return item.months.map((month) => ({
          ...base,
          id: month.id ?? `${base.employeeName}-${month.salaryMonth}`,
          salaryMonth: month.salaryMonth || month.salary_month || null,
          renewal: month.renewal ?? 0,
          newAmount: month.newAmount ?? month.new_amount ?? 0,
          goldCoin: month.goldCoin ?? month.gold_coin ?? 0,
          gvcn: month.gvcn ?? 0,
          lss: month.lss ?? 0,
          gvcr: month.gvcr ?? 0,
          trade: month.trade ?? 0,
          land: month.land ?? 0,
          builders: month.builders ?? 0,
          totalEFGH: month.totalEFGH ?? month.total_efgh ?? 0,
          renewal15: month.renewal15 ?? month.renewal_15 ?? 0,
          new20: month.new20 ?? month.new_20 ?? 0,
          salary: month.salary ?? 0,
          landPayout: month.landPayout ?? month.land_payout ?? 0,
          commissions: month.commissions ?? 0,
          grandTotal: month.grandTotal ?? month.grand_total ?? 0,
          payout10th: month.payout10th ?? month.payout_10th ?? 0,
          payout16th: month.payout16th ?? month.payout_16th ?? 0,
          created_at: month.created_at || month.createdAt || null
        }));
      }

      return [normalizeRow(item)];
    });

    for (const row of flatRows) {
      const key = `${row.branch}__${row.employeeName}__${row.designation}`;

      if (!map.has(key)) {
        map.set(key, {
          ...row,
          months: [row]
        });
      } else {
        const existing = map.get(key);
        existing.months.push(row);

        const existingTime = new Date(existing.created_at || 0).getTime();
        const rowTime = new Date(row.created_at || 0).getTime();

        if (rowTime >= existingTime) {
          existing.id = row.id;
          existing.branch = row.branch;
          existing.loggedByUser = row.loggedByUser;
          existing.employeeName = row.employeeName;
          existing.designation = row.designation;
          existing.bankName = row.bankName;
          existing.accountNumber = row.accountNumber;
          existing.ifscCode = row.ifscCode;
          existing.salaryMonth = row.salaryMonth;
          existing.renewal = row.renewal;
          existing.newAmount = row.newAmount;
          existing.goldCoin = row.goldCoin;
          existing.gvcn = row.gvcn;
          existing.lss = row.lss;
          existing.gvcr = row.gvcr;
          existing.trade = row.trade;
          existing.land = row.land;
          existing.builders = row.builders;
          existing.totalEFGH = row.totalEFGH;
          existing.renewal15 = row.renewal15;
          existing.new20 = row.new20;
          existing.salary = row.salary;
          existing.landPayout = row.landPayout;
          existing.commissions = row.commissions;
          existing.grandTotal = row.grandTotal;
          existing.payout10th = row.payout10th;
          existing.payout16th = row.payout16th;
          existing.created_at = row.created_at;
        }

        existing.months.sort(
          (a, b) =>
            new Date(b.salaryMonth || b.created_at || 0) - new Date(a.salaryMonth || a.created_at || 0)
        );
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const branchCompare = (a.branch || '').localeCompare(b.branch || '');
      if (branchCompare !== 0) return branchCompare;
      return (a.employeeName || '').localeCompare(b.employeeName || '');
    });
  }, [allSubmissions]);

  const branchesList = useMemo(() => {
    const uniqueBranches = new Set(groupedData.map((item) => item.branch).filter(Boolean));
    return ['All', ...Array.from(uniqueBranches)];
  }, [groupedData]);

  const filteredData = groupedData.filter((item) => {
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      item.employeeName?.toLowerCase().includes(q) ||
      item.designation?.toLowerCase().includes(q) ||
      item.loggedByUser?.toLowerCase().includes(q);

    const matchesBranch = selectedBranch === 'All' || item.branch === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  const totalPayoutMetrics = filteredData.reduce((acc, curr) => {
    return acc + curr.months.reduce((monthAcc, month) => monthAcc + Number(month.grandTotal || 0), 0);
  }, 0);

  const totalSubmissionsCount = filteredData.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-100">
          <div className="flex justify-between items-start opacity-80">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Network Payout</span>
            <Wallet size={18} />
          </div>
          <h3 className="text-2xl font-black mt-2 font-mono">{formatINR(totalPayoutMetrics)}</h3>
          <p className="text-[11px] opacity-70 mt-1">
            Aggregated payroll deployment volume across filtered operations.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase">Total Branch Log Entries</span>
            <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{totalSubmissionsCount} Records</h4>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
            <Building size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase">Active Nodes Spanned</span>
            <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{branchesList.length - 1} Operating Branches</h4>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-100/40 overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Table size={18} className="text-indigo-600" /> Cross-Branch Audit Console
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Centralized financial data clearinghouse for global branches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-xl">
            <div className="relative w-full sm:w-48">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {branchesList.map((branch, i) => (
                  <option key={i} value={branch}>
                    {branch === 'All' ? 'All Operating Branches' : branch}
                  </option>
                ))}
              </select>
            </div>

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
              <p className="text-xs text-slate-400 mt-1">
                No operational data files sync with your current tracking rules.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/40 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Source Node Branch</th>
                  <th className="py-3.5 px-6">Target Employee</th>
                  <th className="py-3.5 px-6 text-center">Core Metrics</th>
                  <th className="py-3.5 px-6 text-right">Base Salary</th>
                  <th className="py-3.5 px-6 text-right">Grand Total</th>
                  <th className="py-3.5 px-6 text-right">Month</th>
                  <th className="py-3.5 px-6 text-right">10th Release</th>
                  <th className="py-3.5 px-6 text-right">16th Release</th>
                  <th className="py-3.5 px-6 text-center">Audit Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredData.map((item) => {
                  const latestMonth = item.months?.[0];

                  return (
                    <tr
                      key={`${item.branch}-${item.employeeName}-${item.designation}`}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-indigo-50/30 cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] rounded-lg tracking-wide border border-indigo-100/60 block w-max uppercase">
                          {item.branch}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-medium mt-1">
                          Operator: {item.loggedByUser}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {item.employeeName}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{item.designation}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[280px] mx-auto text-[11px] font-medium">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                            Months: {item.months?.length || 0}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">BANK</span>
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">EMPLOYEE</span>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md">HISTORY</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right font-medium text-slate-700">
                        {latestMonth ? formatINR(latestMonth.salary) : '₹0'}
                      </td>

                      <td className="py-4 px-6 text-right text-emerald-600 font-bold">
                        {latestMonth ? formatINR(latestMonth.grandTotal) : '₹0'}
                      </td>

                      <td className="py-4 px-6 text-right font-medium text-slate-600">
                        {latestMonth ? formatMonth(latestMonth.salaryMonth) : '-'}
                      </td>

                      <td className="py-4 px-6 text-right text-slate-600 font-medium bg-slate-50/30">
                        {latestMonth ? formatINR(latestMonth.payout10th) : '₹0'}
                      </td>

                      <td className="py-4 px-6 text-right text-slate-600 font-medium bg-slate-50/50">
                        {latestMonth ? formatINR(latestMonth.payout16th) : '₹0'}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all inline-flex items-center justify-center">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {selectedItem && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{selectedItem.employeeName}</h3>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wide">
                        {selectedItem.branch}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      {selectedItem.designation} •{' '}
                      <span className="text-slate-500 font-semibold">
                        Logged by: {selectedItem.loggedByUser}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(null);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6 text-sm">
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 size={14} /> Bank Details
                  </h4>
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

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5 mb-3">
                    <Layers size={14} /> Monthly Salary Records
                  </h4>

                  <div className="space-y-3">
                    {selectedItem.months?.map((month) => (
                      <div key={month.id} className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              {formatMonth(month.salaryMonth)}
                            </div>
                            <div className="text-xs text-slate-400">
                              Submitted on{' '}
                              {month.created_at
                                ? new Date(month.created_at).toLocaleString('en-IN', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                  })
                                : '-'}
                            </div>
                          </div>
                          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                            #{month.id}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Renewal</span>
                            <span className="font-semibold text-slate-800">{formatINR(month.renewal)}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <span className="text-[11px] text-slate-400 block uppercase font-medium">New Amount</span>
                            <span className="font-semibold text-slate-800">{formatINR(month.newAmount)}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Gold Coin</span>
                            <span className="font-semibold text-slate-800">{formatINR(month.goldCoin)}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <span className="text-[11px] text-slate-400 block uppercase font-medium">GVCN</span>
                            <span className="font-semibold text-slate-700">{formatINR(month.gvcn)}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <span className="text-[11px] text-slate-400 block uppercase font-medium">LSS</span>
                            <span className="font-semibold text-slate-700">{formatINR(month.lss)}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <span className="text-[11px] text-slate-400 block uppercase font-medium">GVCR</span>
                            <span className="font-semibold text-slate-700">{formatINR(month.gvcr)}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Trade</span>
                            <span className="font-semibold text-slate-700">{formatINR(month.trade)}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Land</span>
                            <span className="font-semibold text-slate-700">{formatINR(month.land)}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl col-span-2">
                            <span className="text-[11px] text-slate-400 block uppercase font-medium">Builders</span>
                            <span className="font-semibold text-slate-700">{formatINR(month.builders)}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 mt-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5 mb-3">
                            <Wallet size={14} /> Computations
                          </h4>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                              <span className="text-[11px] text-slate-400 block uppercase font-medium">Total E+F+G+H</span>
                              <span className="font-bold text-slate-700">{formatINR(month.totalEFGH)}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                              <span className="text-[11px] text-slate-400 block uppercase font-medium">Renewal (15%)</span>
                              <span className="font-bold text-slate-700">{formatINR(month.renewal15)}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                              <span className="text-[11px] text-slate-400 block uppercase font-medium">New (20%)</span>
                              <span className="font-bold text-slate-700">{formatINR(month.new20)}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                              <span className="text-[11px] text-slate-400 block uppercase font-medium">Base Salary Amount</span>
                              <span className="font-bold text-slate-700">{formatINR(month.salary)}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                              <span className="text-[11px] text-slate-400 block uppercase font-medium">Trade + Land + Builders</span>
                              <span className="font-bold text-slate-700">{formatINR(month.landPayout)}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                              <span className="text-[11px] text-slate-400 block uppercase font-medium">Commissions Logged</span>
                              <span className="font-bold text-slate-700">{formatINR(month.commissions)}</span>
                            </div>

                            <div className="col-span-2 bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex justify-between items-center mt-1">
                              <span className="text-xs font-bold uppercase text-emerald-800">Grand Total Sum Payout</span>
                              <span className="text-lg font-black text-emerald-600">{formatINR(month.grandTotal)}</span>
                            </div>

                            <div className="bg-amber-50/40 border border-amber-100/70 p-3 rounded-xl">
                              <span className="text-[11px] text-amber-700 block uppercase font-bold">10th Release Splitting</span>
                              <span className="font-black text-amber-600 text-base">{formatINR(month.payout10th)}</span>
                            </div>

                            <div className="bg-amber-50/40 border border-amber-100/70 p-3 rounded-xl">
                              <span className="text-[11px] text-amber-700 block uppercase font-bold">16th Release Splitting</span>
                              <span className="font-black text-amber-600 text-base">{formatINR(month.payout16th)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> Database Submission Timestamp
                  </span>
                  <span className="font-medium font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {selectedItem.created_at
                      ? new Date(selectedItem.created_at).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })
                      : '-'}
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