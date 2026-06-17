import React, { useState, useEffect } from 'react';
import { Users, Building2, Table, Loader2 } from 'lucide-react';

const Overview = () => {
  const [metrics, setMetrics] = useState({
    totalBranches: 0,
    totalUsers: 0,
    totalRecords: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardOverviewData();
  }, []);

  const fetchDashboardOverviewData = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);

      // 1. Fetch branch users directory to calculate onboarding numbers
      const usersResponse = await fetch('http://localhost:5000/api/auth/branch-users', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const usersData = await usersResponse.json();

      // 2. Fetch master matrix submission dataset
      const recordsResponse = await fetch('http://localhost:5000/api/salary/admin-all-submissions', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const recordsData = await recordsResponse.json();

      if (usersResponse.ok && recordsResponse.ok) {
        // Map dynamic operational values
        const totalUsersCount = usersData.length;
        
        // Count unique branches inside users directory
        const uniqueBranches = [...new Set(usersData.map(u => u.branch))].length;
        
        const totalRecordsCount = recordsData.length;

        setMetrics({
          totalBranches: uniqueBranches,
          totalUsers: totalUsersCount,
          totalRecords: totalRecordsCount
        });
      }
    } catch (err) {
      console.error('Failed aggregating main administrative metrics overview', err);
    } finally {
      setLoading(false);
    }
  };

  const cardsConfig = [
    {
      title: 'Total Active Branches',
      value: metrics.totalBranches,
      subtitle: 'Onboarded geographic operational nodes.',
      icon: Building2,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100/80',
    },
    {
      title: 'Total Branch Workers',
      value: metrics.totalUsers,
      subtitle: 'Active system handling personnel profiles.',
      icon: Users,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100/80',
    },
    {
      title: 'Total Salary Records',
      value: metrics.totalRecords,
      subtitle: 'Aggregated database payroll submissions.',
      icon: Table,
      colorClass: 'text-purple-600 bg-purple-50 border-purple-100/80',
    },
  ];

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 size={36} className="animate-spin text-indigo-500" />
        <p className="text-sm font-medium tracking-wide">Assembling live operational statistics dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time status updates and operational metrics across your platform.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {cardsConfig.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.title}</span>
                <div className={`p-2 rounded-xl border ${stat.colorClass}`}>
                  <Icon size={18} className="stroke-[2.5]" />
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-3xl font-black tracking-tight text-slate-900 font-mono">
                  {stat.value.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">{stat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;