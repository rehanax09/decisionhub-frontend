import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages (using the index.jsx convention so paths stay mostly the same but point to folders)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DecisionBoards from './pages/DecisionBoards';
import CreateDecision from './pages/CreateDecision';
import DecisionDetails from './pages/DecisionDetails';
import Polls from './pages/Polls';
import Communities from './pages/Communities';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import ComparisonPage from './pages/ComparisonPage';
import Discussion from './pages/Discussion';
import Settings from './pages/Settings';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-quint',
    });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes with Sidebar and Top Navbar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/decision-board" element={<DecisionBoards />} />
          <Route path="/create-decision" element={<CreateDecision />} />
          <Route path="/decision/:id" element={<DecisionDetails />} />
          <Route path="/decision/:id/compare" element={<ComparisonPage />} />
          <Route path="/decision/:id/discuss" element={<Discussion />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
