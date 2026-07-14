import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Thermometer, 
  AlertTriangle, 
  Activity,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../components/ToastContext';

// Mock Data
export const mockLots = [
  { id: 'LOT-2569-001', vaccine: 'BCG vaccine EPI 0-5 ปี', manufacturer: 'องค์การเภสัชกรรม', temp: 4.5, requiredTemp: '2 ถึง 8 °C', qty: 31, status: 'ปกติ', statusType: 'success', mfgDate: '2025-01-15', expDate: '2026-12-15' },
  { id: 'LOT-2569-002', vaccine: 'bOPV vaccine EPI 0-5 ปี', manufacturer: 'องค์การเภสัชกรรม', temp: -18.2, requiredTemp: '-15 ถึง -25 °C', qty: 42, status: 'ปกติ', statusType: 'success', mfgDate: '2025-02-10', expDate: '2026-11-10' },
  { id: 'LOT-2569-003', vaccine: 'DTP-HB-Hib vaccine EPI 0-5 ปี', manufacturer: 'Serum Institute', temp: 9.1, requiredTemp: '2 ถึง 8 °C', qty: 14, status: 'เฝ้าระวัง', statusType: 'warning', mfgDate: '2026-03-05', expDate: '2027-03-05' },
  { id: 'LOT-2569-004', vaccine: 'Influ vaccine ญ.ตั้งครรภ์', manufacturer: 'Sanofi', temp: 5.0, requiredTemp: '2 ถึง 8 °C', qty: 35, status: 'ปกติ', statusType: 'success', mfgDate: '2025-12-20', expDate: '2026-12-20' },
  { id: 'LOT-2569-005', vaccine: 'Rabies vaccine (PCEC)', manufacturer: 'Chiron', temp: 12.3, requiredTemp: '2 ถึง 8 °C', qty: 100, status: 'วิกฤต', statusType: 'danger', mfgDate: '2026-05-01', expDate: '2027-05-01' }
];

const Dashboard: React.FC = () => {
  const { addToast } = useToast();

  React.useEffect(() => {
    // Notify about active alert on dashboard load
    addToast('Critical Alert: Fluarix Influenza (LOT-2026-005) temperature is 12.3°C!', 'error');
  }, [addToast]);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Cold Chain Dashboard</h1>
        <button 
          className="btn btn-primary"
          onClick={() => addToast('System status refreshed successfully.', 'success')}
        >
          <Activity size={16} />
          Refresh Stats
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-content">
            <h3>Active Lots</h3>
            <p>{mockLots.length}</p>
          </div>
          <div className="stat-icon blue">
            <Package size={24} />
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-content">
            <h3>Mean Temp</h3>
            <p>2.3 °C</p>
          </div>
          <div className="stat-icon green">
            <Thermometer size={24} />
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-content">
            <h3>Active Alerts</h3>
            <p style={{ color: 'var(--status-danger)' }}>2</p>
          </div>
          <div className="stat-icon red">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-content">
            <h3>Chain Integrity</h3>
            <p>98.7%</p>
          </div>
          <div className="stat-icon yellow">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Tables and Activity Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Active Lots table */}
        <div className="card" style={{ overflowX: 'auto' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Critical Cold Chain Lots</h3>
            <Link to="/inventory" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Lot ID</th>
                <th>Vaccine</th>
                <th>Temp</th>
                <th>Required Temp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockLots.map(lot => (
                <tr key={lot.id}>
                  <td>
                    <Link to={`/inventory/${lot.id}`} style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                      {lot.id}
                    </Link>
                  </td>
                  <td>{lot.vaccine}</td>
                  <td style={{ fontWeight: 600 }}>{lot.temp} °C</td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{lot.requiredTemp}</td>
                  <td>
                    <span className={`badge ${lot.statusType}`}>{lot.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity Logs */}
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Chain Activity Log</h3>
          <div className="flex flex-col" style={{ gap: '1.25rem' }}>
            <div style={{ borderLeft: '3px solid var(--status-danger)', paddingLeft: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Temperature Alert</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Fluarix Influenza (LOT-2026-005) spike: 12.3°C</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10 mins ago</span>
            </div>
            <div style={{ borderLeft: '3px solid var(--status-warning)', paddingLeft: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Temperature Warning</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AstraZeneca (LOT-2026-003) warning: 9.1°C</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>32 mins ago</span>
            </div>
            <div style={{ borderLeft: '3px solid var(--status-success)', paddingLeft: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>New Lot Registered</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Moderna COVID-19 (LOT-2026-002) in storage</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 hours ago</span>
            </div>
            <div style={{ borderLeft: '3px solid var(--status-info)', paddingLeft: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Sensor Calibrated</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Storage Unit 4 sensor calibrated by admin</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
