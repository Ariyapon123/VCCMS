import React, { useState } from 'react';
import { Package, Thermometer, AlertTriangle, ShieldCheck, Plus, Lock } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface WardStock { vaccine: string; lot: string; qty: number; expiry: string; status: string; statusType: string; }

const wardData: Record<string, { temp: number; stocks: WardStock[] }> = {
  'วอร์ด A': {
    temp: 4.5,
    stocks: [
      { vaccine: 'Pfizer-BioNTech COVID-19', lot: 'LOT-2026-001', qty: 120, expiry: '30/06/2570', status: 'ปกติ', statusType: 'success' },
      { vaccine: 'AstraZeneca COVID-19', lot: 'LOT-2026-003', qty: 80, expiry: '15/09/2569', status: 'ใกล้หมดอายุ', statusType: 'warning' },
      { vaccine: 'Sinovac COVID-19', lot: 'LOT-2026-004', qty: 45, expiry: '28/02/2570', status: 'ปกติ', statusType: 'success' },
    ]
  },
  'วอร์ด B': {
    temp: 5.2,
    stocks: [
      { vaccine: 'Moderna COVID-19', lot: 'LOT-2026-002', qty: 200, expiry: '20/11/2569', status: 'ปกติ', statusType: 'success' },
      { vaccine: 'Fluarix Influenza', lot: 'LOT-2026-005', qty: 30, expiry: '30/08/2569', status: 'ใกล้หมดอายุ', statusType: 'warning' },
    ]
  },
  'วอร์ด C': {
    temp: 3.8,
    stocks: [
      { vaccine: 'Pfizer-BioNTech COVID-19', lot: 'LOT-2026-001', qty: 300, expiry: '30/06/2570', status: 'ปกติ', statusType: 'success' },
      { vaccine: 'Sinovac COVID-19', lot: 'LOT-2026-004', qty: 150, expiry: '28/02/2570', status: 'ปกติ', statusType: 'success' },
      { vaccine: 'AstraZeneca COVID-19', lot: 'LOT-2026-003', qty: 60, expiry: '15/09/2569', status: 'ใกล้หมดอายุ', statusType: 'warning' },
      { vaccine: 'Moderna COVID-19', lot: 'LOT-2026-002', qty: 90, expiry: '20/11/2569', status: 'ปกติ', statusType: 'success' },
    ]
  }
};

const WardView: React.FC = () => {
  const { addToast } = useToast();
  const [selectedWard, setSelectedWard] = useState('วอร์ด A');
  const data = wardData[selectedWard];
  const totalQty = data.stocks.reduce((sum, s) => sum + s.qty, 0);
  const expiringCount = data.stocks.filter(s => s.statusType === 'warning').length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>🏥 คลังรองประจำวอร์ด</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>ดูสต็อกวัคซีนประจำวอร์ดของคุณ</p>
      </div>

      {/* Ward Selector */}
      <div className="ward-selector">
        {Object.keys(wardData).map(ward => (
          <button key={ward} className={`ward-card ${selectedWard === ward ? 'active' : ''}`} onClick={() => setSelectedWard(ward)}>
            🏥 {ward}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-content">
            <h3>จำนวนยาทั้งหมด</h3>
            <p>{totalQty.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 400 }}>โดส</span></p>
          </div>
          <div className="stat-icon blue"><Package size={24} /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-content">
            <h3>ยาใกล้หมดอายุ</h3>
            <p style={{ color: expiringCount > 0 ? 'var(--status-warning)' : 'var(--status-success)' }}>{expiringCount} <span style={{ fontSize: '1rem', fontWeight: 400 }}>รายการ</span></p>
          </div>
          <div className="stat-icon yellow"><AlertTriangle size={24} /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-content">
            <h3>อุณหภูมิปัจจุบัน</h3>
            <p>{data.temp} °C</p>
          </div>
          <div className="stat-icon green"><Thermometer size={24} /></div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="card" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            <ShieldCheck size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--accent-primary)' }} />
            สต็อกวัคซีนใน{selectedWard}
          </h3>
          <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem', gap: '0.5rem' }}
            onClick={() => addToast(`ส่งคำขอเบิกวัคซีนเพิ่มจากคลังหลักไปยัง ${selectedWard} แล้ว`, 'success')}>
            <Plus size={18} /> ขอเบิกวัคซีนเพิ่ม
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ชื่อวัคซีน</th>
              <th>Lot No.</th>
              <th>จำนวนคงเหลือ (โดส)</th>
              <th>วันหมดอายุ</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {data.stocks.map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, fontSize: '1rem' }}>{s.vaccine}</td>
                <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{s.lot}</td>
                <td style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.qty.toLocaleString()}</td>
                <td>{s.expiry}</td>
                <td><span className={`badge ${s.statusType}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Isolation Notice */}
      <div className="data-notice">
        <Lock size={20} />
        <span>คุณกำลังดูข้อมูลของ <strong>{selectedWard}</strong> เท่านั้น — แผนกอื่นไม่สามารถเห็นข้อมูลนี้ได้</span>
      </div>
    </div>
  );
};

export default WardView;
