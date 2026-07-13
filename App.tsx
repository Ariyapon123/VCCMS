import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import LotDetail from './pages/LotDetail';
import Monitoring from './pages/Monitoring';
import Report from './pages/Report';
import Admin from './pages/Admin';
import { ToastProvider } from './components/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory/:id" element={<LotDetail />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="report" element={<Report />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
