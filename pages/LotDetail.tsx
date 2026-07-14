import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Thermometer, ShieldCheck, AlertOctagon, Download, RefreshCw } from 'lucide-react';
import { mockLots } from './Dashboard';
import { useToast } from '../components/ToastContext';

// Mock logs data for lots
const mockLogsData: Record<string, Array<{ time: string, temp: number, status: string, statusType: string, recorder: string }>> = {
  'LOT-2026-001': [
    { time: '2026-07-13 19:30:00', temp: 3.5, status: 'Normal', statusType: 'success', recorder: 'Sensor-A4' },
    { time: '2026-07-13 18:30:00', temp: 3.6, status: 'Normal', statusType: 'success', recorder: 'Sensor-A4' },
    { time: '2026-07-13 17:30:00', temp: 3.4, status: 'Normal', statusType: 'success', recorder: 'Sensor-A4' },
    { time: '2026-07-13 16:30:00', temp: 3.5, status: 'Normal', statusType: 'success', recorder: 'Sensor-A4' }
  ],
  'LOT-2026-002': [
    { time: '2026-07-13 19:30:00', temp: -18.2, status: 'Normal', statusType: 'success', recorder: 'Sensor-B2' },
    { time: '2026-07-13 18:30:00', temp: -18.0, status: 'Normal', statusType: 'success', recorder: 'Sensor-B2' },
    { time: '2026-07-13 17:30:00', temp: -18.5, status: 'Normal', statusType: 'success', recorder: 'Sensor-B2' }
  ],
  'LOT-2026-003': [
    { time: '2026-07-13 19:30:00', temp: 9.1, status: 'Warning (High)', statusType: 'warning', recorder: 'Sensor-A1' },
    { time: '2026-07-13 18:30:00', temp: 8.8, status: 'Warning (High)', statusType: 'warning', recorder: 'Sensor-A1' },
    { time: '2026-07-13 17:30:00', temp: 8.2, status: 'Warning (High)', statusType: 'warning', recorder: 'Sensor-A1' },
    { time: '2026-07-13 16:30:00', temp: 7.9, status: 'Normal', statusType: 'success', recorder: 'Sensor-A1' }
  ],
  'LOT-2026-005': [
    { time: '2026-07-13 19:30:00', temp: 12.3, status: 'Critical (High)', statusType: 'danger', recorder: 'Sensor-C9' },
    { time: '2026-07-13 18:30:00', temp: 10.5, status: 'Critical (High)', statusType: 'danger', recorder: 'Sensor-C9' },
    { time: '2026-07-13 17:30:00', temp: 7.8, status: 'Normal', statusType: 'success', recorder: 'Sensor-C9' }
  ]
};

const LotDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  
  // Find lot details or default to mock
  const lot = mockLots.find(l => l.id === id) || mockLots[0];
  const logs = mockLogsData[lot.id] || [
    { time: '2026-07-13 19:30:00', temp: lot.temp, status: lot.status, statusType: lot.statusType, recorder: 'Sensor-Gen' }
  ];

  const [currentLogs, setCurrentLogs] = useState(logs);

  const triggerCalibrate = () => {
    addToast(`Sensor recalibration sequence started for ${lot.id}.`, 'info');
    setTimeout(() => {
      addToast(`Sensor recalibrated successfully.`, 'success');
    }, 1500);
  };

  const handleManualLog = () => {
    const manualTemp = parseFloat(prompt("Enter manual temperature reading (°C):") || '');
    if (isNaN(manualTemp)) {
      addToast('Invalid temperature entered.', 'error');
      return;
    }

    let status = 'Normal';
    let statusType = 'success';

    if (lot.requiredTemp === '2°C to 8°C') {
      if (manualTemp < 2 || manualTemp > 8) {
        status = manualTemp > 10 ? 'Critical' : 'Warning';
        statusType = manualTemp > 10 ? 'danger' : 'warning';
      }
    } else {
      if (manualTemp < -25 || manualTemp > -15) {
        status = manualTemp > -10 ? 'Critical' : 'Warning';
        statusType = manualTemp > -10 ? 'danger' : 'warning';
      }
    }

    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setCurrentLogs([
      { time: timeString, temp: manualTemp, status, statusType, recorder: 'Manual Entry (Admin)' },
      ...currentLogs
    ]);
    addToast('Logged temperature reading successfully.', 'success');
  };

  // Temperature indicator helper
  const renderRangeIndicator = () => {
    const isStandard = lot.requiredTemp === '2°C to 8°C';
    const min = isStandard ? 0 : -30;
    const max = isStandard ? 12 : -10;
    const lowLimit = isStandard ? 2 : -25;
    const highLimit = isStandard ? 8 : -15;
    
    // Calculate percentage width for styling
    const total = max - min;
    const lowPct = ((lowLimit - min) / total) * 100;
    const highPct = ((highLimit - min) / total) * 100;
    const currentVal = Math.max(min, Math.min(max, lot.temp));
    const currentPct = ((currentVal - min) / total) * 100;

    return (
      <div style={{ marginTop: '1.5rem', position: 'relative', height: '40px', background: 'var(--bg-tertiary)', borderRadius: '20px', overflow: 'visible' }}>
        {/* Safety Range Zone */}
        <div style={{ 
          position: 'absolute', 
          left: `${lowPct}%`, 
          width: `${highPct - lowPct}%`, 
          height: '100%', 
          backgroundColor: 'rgba(5, 150, 105, 0.15)',
          borderLeft: '2px dashed var(--status-success)',
          borderRight: '2px dashed var(--status-success)'
        }} />
        
        {/* Current Value Pointer */}
        <div style={{ 
          position: 'absolute', 
          left: `${currentPct}%`, 
          top: '-10px',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 5
        }}>
          <span style={{ 
            backgroundColor: lot.statusType === 'success' ? 'var(--status-success)' : lot.statusType === 'warning' ? 'var(--status-warning)' : 'var(--status-danger)', 
            color: 'white', 
            padding: '2px 8px', 
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {lot.temp} °C
          </span>
          <div style={{ 
            width: '4px', 
            height: '24px', 
            backgroundColor: lot.statusType === 'success' ? 'var(--status-success)' : lot.statusType === 'warning' ? 'var(--status-warning)' : 'var(--status-danger)' 
          }} />
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '45px 10px 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>{min} °C</span>
          <span style={{ fontWeight: 600, color: 'var(--status-success)' }}>Safe Zone ({lot.requiredTemp})</span>
          <span>{max} °C</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Link to="/inventory" className="btn btn-secondary" style={{ marginBottom: '1.5rem', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Inventory
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Card: Info & Actions */}
        <div className="card flex flex-col" style={{ gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>LOT DETAILED SUMMARY</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>{lot.id}</h2>
          </div>

          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Vaccine:</span>
              <span style={{ fontWeight: 600 }}>{lot.vaccine}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Manufacturer:</span>
              <span style={{ fontWeight: 600 }}>{lot.manufacturer}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Batch Quantity:</span>
              <span style={{ fontWeight: 600 }}>{lot.qty.toLocaleString()} doses</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Temp Limits:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{lot.requiredTemp}</span>
            </div>
          </div>

          {/* Alert Status Card */}
          <div className={`card`} style={{ 
            backgroundColor: lot.statusType === 'success' ? 'var(--status-success-bg)' : lot.statusType === 'warning' ? 'var(--status-warning-bg)' : 'var(--status-danger-bg)',
            borderColor: lot.statusType === 'success' ? 'var(--status-success)' : lot.statusType === 'warning' ? 'var(--status-warning)' : 'var(--status-danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem'
          }}>
            {lot.statusType === 'success' ? (
              <ShieldCheck size={32} style={{ color: 'var(--status-success)' }} />
            ) : (
              <AlertOctagon size={32} style={{ color: lot.statusType === 'warning' ? 'var(--status-warning)' : 'var(--status-danger)' }} />
            )}
            <div>
              <p style={{ fontWeight: 700, margin: 0, color: lot.statusType === 'success' ? 'var(--status-success)' : lot.statusType === 'warning' ? 'var(--status-warning)' : 'var(--status-danger)' }}>
                System: {lot.status}
              </p>
              <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-primary)' }}>
                {lot.statusType === 'success' ? 'Chain integrity verified.' : 'Temperature deviation detected!'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col" style={{ gap: '0.75rem', marginTop: 'auto' }}>
            <button className="btn btn-primary" onClick={handleManualLog}>
              <Thermometer size={16} /> Log Manual Temp
            </button>
            <button className="btn btn-secondary" onClick={triggerCalibrate}>
              <RefreshCw size={16} /> Recalibrate Sensor
            </button>
            <button className="btn btn-secondary" onClick={() => addToast('Log report generated for export.', 'success')}>
              <Download size={16} /> Export Logs (.CSV)
            </button>
          </div>
        </div>

        {/* Right Card: Graph and Detailed Logs */}
        <div className="card flex flex-col" style={{ gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Temperature Range Monitoring</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Real-time sensor position relative to storage requirements</p>
            {renderRangeIndicator()}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Sensor Telemetry Log</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Recorded Temp</th>
                  <th>Reporter Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, idx) => (
                  <tr key={idx}>
                    <td>{log.time}</td>
                    <td style={{ fontWeight: 600 }}>{log.temp} °C</td>
                    <td>{log.recorder}</td>
                    <td>
                      <span className={`badge ${log.statusType}`}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotDetail;
