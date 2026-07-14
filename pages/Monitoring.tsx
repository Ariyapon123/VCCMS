import React, { useState, useEffect } from 'react';
import { ShieldCheck, BatteryCharging, Flame, Power, Play, Snowflake } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface StorageUnit {
  id: string;
  name: string;
  type: string;
  baseTemp: number;
  currentTemp: number;
  humidity: number;
  powerSource: 'Grid' | 'Backup Battery';
  batteryLevel: number;
  status: 'Active' | 'Defrosting' | 'Maintenance' | 'Alalarm';
  statusType: 'success' | 'warning' | 'danger' | 'primary';
}

const Monitoring: React.FC = () => {
  const { addToast } = useToast();
  const [units, setUnits] = useState<StorageUnit[]>([
    { id: 'UNIT-01', name: 'Main Vaccine Refrigerator A', type: 'Refrigerator (2°C to 8°C)', baseTemp: 4.2, currentTemp: 4.2, humidity: 45, powerSource: 'Grid', batteryLevel: 100, status: 'Active', statusType: 'success' },
    { id: 'UNIT-02', name: 'Main Vaccine Refrigerator B', type: 'Refrigerator (2°C to 8°C)', baseTemp: 5.1, currentTemp: 5.1, humidity: 48, powerSource: 'Grid', batteryLevel: 100, status: 'Active', statusType: 'success' },
    { id: 'UNIT-03', name: 'Ultra-Low Freezer Unit 1', type: 'Freezer (-25°C to -15°C)', baseTemp: -18.5, currentTemp: -18.5, humidity: 12, powerSource: 'Backup Battery', batteryLevel: 82, status: 'Active', statusType: 'success' },
    { id: 'UNIT-04', name: 'Emergency Cold Storage Room', type: 'Walk-in Chiller (2°C to 8°C)', baseTemp: 3.8, currentTemp: 3.8, humidity: 55, powerSource: 'Grid', batteryLevel: 100, status: 'Active', statusType: 'success' },
    { id: 'UNIT-05', name: 'Mobile Transport Cooler T1', type: 'Portable Box (2°C to 8°C)', baseTemp: 9.1, currentTemp: 9.1, humidity: 40, powerSource: 'Backup Battery', batteryLevel: 25, status: 'Defrosting', statusType: 'warning' },
    { id: 'UNIT-06', name: 'Deep Freeze Chest Freezer C3', type: 'Ultra-Freezer (-80°C)', baseTemp: 12.3, currentTemp: 12.3, humidity: 8, powerSource: 'Grid', batteryLevel: 0, status: 'Alalarm', statusType: 'danger' }
  ]);

  const [simulating, setSimulating] = useState(true);

  // Live fluctuating telemetry values simulation
  useEffect(() => {
    if (!simulating) return;

    const interval = setInterval(() => {
      setUnits(prev => prev.map(unit => {
        // Only fluctuate if active or warning/danger
        const fluctuation = (Math.random() - 0.5) * 0.2; // fluctuate by max +/- 0.1°C
        const newTemp = parseFloat((unit.currentTemp + fluctuation).toFixed(1));
        
        // Simulating battery discharge if on backup battery
        let newBattery = unit.batteryLevel;
        if (unit.powerSource === 'Backup Battery' && newBattery > 0) {
          newBattery = Math.max(0, newBattery - 1);
        }

        return {
          ...unit,
          currentTemp: newTemp,
          batteryLevel: newBattery
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [simulating]);

  const togglePower = (id: string) => {
    setUnits(prev => prev.map(unit => {
      if (unit.id === id) {
        const isGrid = unit.powerSource === 'Grid';
        addToast(`${unit.name} power switched to ${isGrid ? 'Backup Battery' : 'Grid power'}.`, 'info');
        return {
          ...unit,
          powerSource: isGrid ? 'Backup Battery' : 'Grid',
          batteryLevel: isGrid ? 99 : 100
        };
      }
      return unit;
    }));
  };

  const runDiagnostics = (id: string) => {
    addToast(`Running diagnostics on unit ${id}...`, 'info');
    setTimeout(() => {
      addToast(`All diagnostics on ${id} passed. Compressor, fan, and sensors normal.`, 'success');
    }, 1500);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Real-time Monitoring</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Active telemetry feeds from storage unit IoT sensors</p>
        </div>
        <button 
          className={`btn ${simulating ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setSimulating(!simulating)}
        >
          {simulating ? <Flame size={16} /> : <Play size={16} />}
          {simulating ? 'Pause Live Stream' : 'Resume Live Stream'}
        </button>
      </div>

      {/* Grid of Storage Units */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {units.map(unit => (
          <div key={unit.id} className="card flex flex-col" style={{ gap: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            {/* Status indicator bar at top */}
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '4px', 
              backgroundColor: unit.statusType === 'success' ? 'var(--status-success)' : unit.statusType === 'warning' ? 'var(--status-warning)' : 'var(--status-danger)' 
            }} />

            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{unit.id} • {unit.type}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.25rem' }}>{unit.name}</h3>
              </div>
              <span className={`badge ${unit.statusType}`}>{unit.status}</span>
            </div>

            {/* Main Temp display */}
            <div className="flex justify-between items-center" style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div className="flex items-center" style={{ gap: '0.75rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: unit.statusType === 'success' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)', 
                  color: unit.statusType === 'success' ? 'var(--status-success)' : 'var(--status-danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: simulating ? 'pulse 2s infinite' : 'none'
                }}>
                  {unit.currentTemp <= 0 ? <Snowflake size={20} /> : <ShieldCheck size={20} />}
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sensor Temp</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{unit.currentTemp} °C</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Humidity</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{unit.humidity}%</p>
              </div>
            </div>

            {/* Energy and Battery */}
            <div className="flex justify-between items-center" style={{ fontSize: '0.875rem' }}>
              <div className="flex items-center" style={{ gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <BatteryCharging size={16} />
                <span>{unit.powerSource}</span>
              </div>
              <div className="flex items-center" style={{ gap: '0.25rem' }}>
                <div style={{ width: '40px', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', display: 'inline-block' }}>
                  <div style={{ width: `${unit.batteryLevel}%`, height: '100%', background: unit.batteryLevel > 30 ? 'var(--status-success)' : 'var(--status-danger)' }} />
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>{unit.batteryLevel}%</span>
              </div>
            </div>

            {/* Actions for unit */}
            <div className="flex" style={{ gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', gap: '0.25rem' }}
                onClick={() => runDiagnostics(unit.id)}
              >
                Diagnostics
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-primary)' }}
                title="Switch Power Source"
                onClick={() => togglePower(unit.id)}
              >
                <Power size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Styles for pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Monitoring;
