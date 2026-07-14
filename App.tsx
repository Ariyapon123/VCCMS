import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastProvider } from './components/ToastContext';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import LotDetail from './pages/LotDetail';
import Monitoring from './pages/Monitoring';
import Report from './pages/Report';
import Admin from './pages/Admin';

// New Mock Pages
import Login from './pages/Login';
import QRScanner from './pages/QRScanner';
import Transfer from './pages/Transfer';
import WardView from './pages/WardView';
import LinePreview from './pages/LinePreview';
import MonthlyReport from './pages/MonthlyReport';
import ExpiryCalendar from './pages/ExpiryCalendar';
import AuditLog from './pages/AuditLog';
import BarcodePrinter from './pages/BarcodePrinter';

const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scanner" element={<QRScanner />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<LotDetail />} />
            <Route path="/print-barcodes/:id" element={<BarcodePrinter />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/ward-view" element={<WardView />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/expiry" element={<ExpiryCalendar />} />
            <Route path="/line-preview" element={<LinePreview />} />
            <Route path="/report" element={<Report />} />
            <Route path="/monthly-report" element={<MonthlyReport />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </ToastProvider>
    </Router>
  );
};

export default App;
