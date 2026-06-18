import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          toast.error(data.message || 'Failed to sync user data');
        }
      } catch (err) {
        toast.error('Network communication system failure');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
    else setLoading(false);
  }, [token]);

  const handleInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please complete all password input criteria');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    const loadingToast = toast.loading('Updating password...');

    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success(data.message || 'Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(data.message || 'Verification rejected');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Failed to communicate encryption update request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f4f7fb] font-sans text-slate-500">
        Loading security profile directory...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f4f7fb] font-sans text-red-500">
        Unauthorized access identity check failed. Please log in again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-5 py-5 border-slate-200/80 shadow-xl shadow-slate-100/40 rounded-2xl">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Settings</h1>
          <p className="text-[15px] text-slate-500 m-0">
            Manage corporate directory access fields and credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#eef0f5] rounded-2xl p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.02)]">
            <div className="mb-7">
              <h2 className="text-lg font-bold text-slate-900 mb-1.5">User Details</h2>
              <p className="text-[13px] text-slate-500 m-0">Your current identity profile.</p>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <label className="text-[11px] text-slate-600 uppercase font-bold tracking-wider">Name</label>
                <div className="text-[15px] text-slate-800 font-medium mt-2 pb-3 border-b border-slate-100">
                  {user.name}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 uppercase font-bold tracking-wider">Email Address</label>
                <div className="text-[15px] text-slate-800 font-medium mt-2 pb-3 border-b border-slate-100">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 uppercase font-bold tracking-wider">Assigned Branch</label>
                <div className="text-[15px] text-slate-800 font-medium mt-2 pb-3 border-b border-slate-100">
                  {user.branch}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 uppercase font-bold tracking-wider">Access Permission Level</label>
                <div className="mt-2.5">
                  <span className="text-[11px] bg-indigo-50 text-[#5c4bfa] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#eef0f5] rounded-2xl p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.02)]">
            <div className="mb-7">
              <h2 className="text-lg font-bold text-slate-900 mb-1.5">Security Update</h2>
              <p className="text-[13px] text-slate-500 m-0">Ensure your account stays protected.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-slate-600 uppercase font-bold tracking-wider">
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword.currentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition-colors duration-200 focus:border-[#5c4bfa]"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        currentPassword: !prev.currentPassword,
                      }))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-slate-600 uppercase font-bold tracking-wider">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition-colors duration-200 focus:border-[#5c4bfa]"
                    placeholder="Minimum 6 characters"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        newPassword: !prev.newPassword,
                      }))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-slate-600 uppercase font-bold tracking-wider">
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition-colors duration-200 focus:border-[#5c4bfa]"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#5c4bfa] hover:bg-[#4e3de3] active:scale-[0.98] text-white border-none py-3.5 rounded-xl font-semibold text-sm cursor-pointer mt-2 transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(92,75,250,0.2)]"
              >
                Update Security Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;