import React, { useState } from 'react';
import { Save, BellRing, ShieldAlert, Database, RefreshCw } from 'lucide-react';
import { useToast } from '../components/ToastContext';

const Admin: React.FC = () => {
  const { addToast } = useToast();
  const [minChiller, setMinChiller] = useState('2.0');
  const [maxChiller, setMaxChiller] = useState('8.0');
  const [minFreezer, setMinFreezer] = useState('-25.0');
  const [maxFreezer, setMaxFreezer] = useState('-15.0');
  const [interval, setIntervalVal] = useState('5');
  
  // Notification channels
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pagerDutyAlerts, setPagerDutyAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Saving cold chain alert configurations...', 'info');
    setTimeout(() => {
      addToast('Admin configurations saved successfully!', 'success');
    }, 1000);
  };

  const handleBackup = () => {
    addToast('Compressing and exporting cold chain database logs...', 'info');
    setTimeout(() => {
      addToast('Database backup archive created (vccms_backup_20260713.sql).', 'success');
    }, 1500);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>System Administration</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Configure vaccine temperature thresholds, telemetry schedules, and backups</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Settings Form */}
        <div className="card">
          <h3 className="flex items-center" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', gap: '0.5rem' }}>
            <ShieldAlert size={20} style={{ color: 'var(--accent-primary)' }} />
            Cold Chain Temperature Rules
          </h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Standard Chiller (2°C to 8°C)</span>
                <div className="form-group">
                  <label className="form-label">Min Threshold (°C)</label>
                  <input type="number" step="0.1" className="form-control" value={minChiller} onChange={e => setMinChiller(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Threshold (°C)</label>
                  <input type="number" step="0.1" className="form-control" value={maxChiller} onChange={e => setMaxChiller(e.target.value)} />
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Ultra Freezer (-25°C to -15°C)</span>
                <div className="form-group">
                  <label className="form-label">Min Threshold (°C)</label>
                  <input type="number" step="0.1" className="form-control" value={minFreezer} onChange={e => setMinFreezer(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Threshold (°C)</label>
                  <input type="number" step="0.1" className="form-control" value={maxFreezer} onChange={e => setMaxFreezer(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <label className="form-label">Sensor Polling Frequency</label>
              <select className="form-control" value={interval} onChange={e => setIntervalVal(e.target.value)}>
                <option value="1">Every 1 Minute (High Precision)</option>
                <option value="5">Every 5 Minutes (Standard)</option>
                <option value="15">Every 15 Minutes</option>
                <option value="60">Every 60 Minutes (Battery Saver)</option>
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                Higher frequency values decrease IoT battery life but provide faster alert warnings.
              </span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem', marginTop: '1rem' }}>
              <Save size={18} />
              Save Configurations
            </button>
          </form>
        </div>

        {/* Sidebar panels: Notifications & Database */}
        <div className="flex flex-col" style={{ gap: '1.5rem' }}>
          {/* Notification settings */}
          <div className="card">
            <h3 className="flex items-center" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', gap: '0.5rem' }}>
              <BellRing size={18} style={{ color: 'var(--status-warning)' }} />
              Alert Notifications
            </h3>
            <div className="flex flex-col" style={{ gap: '1rem' }}>
              <label className="flex items-center" style={{ gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Broadcasts</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Send instant alert emails to staff</p>
                </div>
              </label>
              <label className="flex items-center" style={{ gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={smsAlerts} onChange={e => setSmsAlerts(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>SMS Urgent Texting</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Send SMS to on-duty managers</p>
                </div>
              </label>
              <label className="flex items-center" style={{ gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={pagerDutyAlerts} onChange={e => setPagerDutyAlerts(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>PagerDuty Integration</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Trigger incidents on pager alert console</p>
                </div>
              </label>
            </div>
          </div>

          {/* Database System Management */}
          <div className="card">
            <h3 className="flex items-center" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', gap: '0.5rem' }}>
              <Database size={18} style={{ color: 'var(--status-success)' }} />
              Database Storage
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Backup or restore telemetry logs and device states.
            </p>
            <div className="flex flex-col" style={{ gap: '0.75rem' }}>
              <button className="btn btn-secondary w-full" style={{ gap: '0.5rem' }} onClick={handleBackup}>
                <Database size={14} />
                Run Storage Backup
              </button>
              <button className="btn btn-secondary w-full" style={{ gap: '0.5rem' }} onClick={() => addToast('System logs database optimized.', 'success')}>
                <RefreshCw size={14} />
                Optimize Database Index
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
