import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, AlertCircle, FileBarChart, Package } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { mockLots } from './Dashboard';

const mockIncidents = [
  { date: '05/07/2569 14:22', unit: 'ตู้เย็นหลัก (คลังหลัก)', temp: 9.5, safe: '2-8 °C', status: 'สูงเกินกำหนด', action: 'เภสัชกรตรวจสอบพบประตูตู้ปิดไม่สนิท' },
  { date: '12/07/2569 03:15', unit: 'ตู้แช่แข็ง OPV (คลังหลัก)', temp: -12.0, safe: '-15 ถึง -25 °C', status: 'สูงเกินกำหนด', action: 'ไฟตก ระบบสำรองไฟทำงานปกติ' },
  { date: '18/07/2569 10:45', unit: 'ตู้เย็น (วอร์ด B)', temp: 1.5, safe: '2-8 °C', status: 'ต่ำเกินกำหนด', action: 'พยาบาลปรับลดความเย็นตู้' },
];

const MonthlyReport: React.FC = () => {
  const { addToast } = useToast();
  const [month, setMonth] = useState('กรกฎาคม 2569');
  
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'].map(m => `${m} 2569`);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>📊 รายงานสรุปประจำเดือน</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>รายงานความคลาดเคลื่อนอุณหภูมิและการเคลื่อนไหวสต็อก</p>
        </div>
        <div className="flex" style={{ gap: '1rem' }}>
          <select className="form-control" style={{ fontSize: '1.05rem', padding: '0.8rem 1rem', width: '200px' }} value={month} onChange={e => setMonth(e.target.value)}>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 1.5rem', gap: '0.5rem' }}
            onClick={() => addToast(`ดาวน์โหลดรายงานเดือน ${month} สำเร็จ`, 'success')}>
            <Download size={18} /> ดาวน์โหลด PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card stat-card">
          <div className="stat-content">
            <h3 style={{ fontSize: '1rem' }}>ยอดรับเข้า</h3>
            <p style={{ color: 'var(--status-success)' }}>2,500 <span style={{ fontSize: '1rem' }}>โดส</span></p>
          </div>
          <div className="stat-icon green"><TrendingUp size={24} /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-content">
            <h3 style={{ fontSize: '1rem' }}>ยอดตัดใช้</h3>
            <p style={{ color: 'var(--accent-primary)' }}>1,800 <span style={{ fontSize: '1rem' }}>โดส</span></p>
          </div>
          <div className="stat-icon blue"><TrendingDown size={24} /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-content">
            <h3 style={{ fontSize: '1rem' }}>ยาเสื่อม/สูญเสีย</h3>
            <p style={{ color: 'var(--status-danger)' }}>5 <span style={{ fontSize: '1rem' }}>โดส</span></p>
          </div>
          <div className="stat-icon red"><AlertCircle size={24} /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-content">
            <h3 style={{ fontSize: '1rem' }}>คงเหลือสิ้นเดือน</h3>
            <p style={{ color: '#eab308' }}>15,900 <span style={{ fontSize: '1rem' }}>โดส</span></p>
          </div>
          <div className="stat-icon yellow"><FileBarChart size={24} /></div>
        </div>
      </div>

      {/* Temp Incident Section */}
      <div className="card" style={{ marginBottom: '2.5rem', overflowX: 'auto' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={22} style={{ color: 'var(--status-warning)' }} /> สรุปความคลาดเคลื่อนอุณหภูมิ ({mockIncidents.length} ครั้ง)
        </h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>วันที่-เวลา</th>
              <th>ตู้ / จุดติดตั้ง</th>
              <th>อุณหภูมิที่วัดได้</th>
              <th>ช่วงปลอดภัย</th>
              <th>สถานะ</th>
              <th>การดำเนินการ/สาเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {mockIncidents.map((inc, i) => (
              <tr key={i}>
                <td style={{ fontSize: '0.95rem' }}>{inc.date}</td>
                <td style={{ fontWeight: 600 }}>{inc.unit}</td>
                <td style={{ fontWeight: 700, color: 'var(--status-danger)' }}>{inc.temp} °C</td>
                <td style={{ color: 'var(--text-secondary)' }}>{inc.safe}</td>
                <td><span className="badge danger">{inc.status}</span></td>
                <td style={{ fontSize: '0.95rem' }}>{inc.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Movement Section */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={22} style={{ color: 'var(--accent-primary)' }} /> สรุปการเคลื่อนไหวสต็อกวัคซีน
        </h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>วัคซีน</th>
              <th style={{ textAlign: 'right' }}>ยอดยกมา (ต้นเดือน)</th>
              <th style={{ textAlign: 'right' }}>รับเข้า</th>
              <th style={{ textAlign: 'right' }}>ตัดใช้</th>
              <th style={{ textAlign: 'right' }}>สูญเสีย/หมดอายุ</th>
              <th style={{ textAlign: 'right' }}>คงเหลือสิ้นเดือน</th>
            </tr>
          </thead>
          <tbody>
            {mockLots.map(lot => {
              const start = lot.qty - 500 + 200 + 5;
              return (
                <tr key={lot.id}>
                  <td style={{ fontWeight: 600 }}>{lot.vaccine} <br/><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Lot: {lot.id}</span></td>
                  <td style={{ textAlign: 'right' }}>{start.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', color: 'var(--status-success)', fontWeight: 600 }}>+500</td>
                  <td style={{ textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 600 }}>-200</td>
                  <td style={{ textAlign: 'right', color: 'var(--status-danger)' }}>-5</td>
                  <td style={{ textAlign: 'right', fontWeight: 800 }}>{lot.qty.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyReport;
