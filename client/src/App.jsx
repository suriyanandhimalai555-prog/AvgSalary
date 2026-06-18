import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// admin
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/AdminDashboard';
import OnboardBranch from './pages/OnboardBranch';
import AllBranchData from './pages/AllBranchData';

// user
import UserLayout from './layouts/UserLayout';
import DataEntry from './pages/DataEntry';
import ViewData from './pages/ViewData';
import UserProfile from './pages/UserProfile';

// protected route
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes Block */}
        <Route element={<ProtectedRoute />}>
          {/* Admin Path System */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Overview />} />
            <Route path="onboard-branch" element={<OnboardBranch />} />
            <Route path="all-data" element={<AllBranchData />} />
          </Route>

          {/* Regular User Path System */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="/user/data-entry" replace />} />
            <Route path="data-entry" element={<DataEntry />} />
            <Route path="view-data" element={<ViewData />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;