import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  UserPlus, 
  Building, 
  Mail, 
  Lock, 
  X, 
  Search, 
  ShieldCheck, 
  Calendar,
  Loader2
} from 'lucide-react';

const OnboardBranch = () => {
  // Modal & Form States
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', branch: '' });
  
  // Table Data & Search States
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchingUsers, setFetchingUsers] = useState(true);

  const token = localStorage.getItem('token');

  // Automatically runs every single time the page loads or refreshes
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true);
      // Corrected API endpoint matching your auth backend routes
      const response = await fetch('http://localhost:5000/api/auth/branch-users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(Array.isArray(data) ? data : data.users || []);
      } else {
        console.error("Server returned an error:", data.message);
      }
    } catch (err) {
      console.error("Failed fetching directory list", err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Registering credentials with server...');

    try {
      const response = await fetch('http://localhost:5000/api/auth/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User onboarded successfully!', { id: toastId });
        setFormData({ name: '', email: '', password: '', branch: '' }); 
        setIsOpen(false); // Close Modal
        
        // Refresh the complete list directly from the database to keep data accurate
        fetchUsers();
      } else {
        toast.error(data.message || 'Onboarding registration failed.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network failure trying to contact server.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Filter table dynamically using search query
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.branch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Upper Header Control Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-100/50">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Branch User Setup
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage branch workstation operational clearance accounts.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]"
        >
          <UserPlus size={16} className="stroke-[2.5]" />
          <span>Onboard New User</span>
        </button>
      </div>

      {/* Directory Table Grid Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-100/40 overflow-hidden">
        
        {/* Table Search Filter Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute inset-y-0 left-3 my-auto text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email or branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none bg-white transition-all"
            />
          </div>
          <span className="text-xs font-semibold text-slate-400 sm:ml-auto">
            Total Entities Located: {filteredUsers.length}
          </span>
        </div>

        {/* Live Table Content Space */}
        <div className="overflow-x-auto">
          {fetchingUsers ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-indigo-500" />
              <p className="text-sm font-medium">Syncing directory indexes from server...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 mb-3">
                <Search size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Branch User Entities Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                No indexing matched your query or no accounts have been registered to this network.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/40 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">User Name</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Branch</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Onboard Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Mail size={14} className="text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building size={14} className="text-slate-400" />
                        <span>{user.branch}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border bg-indigo-50 border-indigo-100 text-indigo-700">
                        <ShieldCheck size={12} />
                        <span className="capitalize">{user.role || 'user'}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} />
                        <span>
                          {user.created_at 
                            ? new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })
                            : 'Just Now'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Onboarding Popup Modal Component */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4">
          
          {/* Backdrop Overlay Layer */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !loading && setIsOpen(false)} 
          />

          {/* Modal Container Box */}
          <div className="relative bg-white w-full max-w-lg rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-10 transform scale-100 transition-all">
            
            {/* Modal Title Banner */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <UserPlus size={16} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Onboard Workspace Identity</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Generate active access keys linked to branch location.</p>
                </div>
              </div>
              <button 
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors outline-none disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {/* Input Form Body */}
            <form onSubmit={handleOnboardSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">User Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><UserPlus size={16} /></span>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={loading}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g., John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Assigned Target Branch</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><Building size={16} /></span>
                  <input
                    type="text"
                    name="branch"
                    required
                    disabled={loading}
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="E.g., California Regional"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">User Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><Mail size={16} /></span>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={loading}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Temporary Account Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><Lock size={16} /></span>
                  <input
                    type="password"
                    name="password"
                    required
                    disabled={loading}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Operations Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-50 transition-all outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/10 disabled:opacity-75"
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  <span>{loading ? 'Creating Identity...' : 'Confirm Activation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OnboardBranch;