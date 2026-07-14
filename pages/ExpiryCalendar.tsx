import React, { useState } from 'react';
import { CalendarDays, AlertTriangle, Trash2, Bell, ShieldCheck } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface ExpiryItem { vaccine: string; lot: string; expiry: string; daysLeft: number; qty: number; group: 'expired' | 'urgent' | 'soon' | 'safe'; }

const expiryData: ExpiryItem[] = [
  { vaccine: 'Fluarix Influenza (GSK)', lot: 'LOT-2025-099', expiry: '01/07/2569', daysLeft: -12, qty: 30, group: 'expired' },
  { vaccine: 'Fluarix Influenza', lot: 'LOT-2026-005', expiry: '30/08/2569', daysLeft: 18, qty: 1200, group: 'urgent' },
  { vaccine: 'AstraZeneca COVID-19', lot: 'LOT-2026-003', expiry: '15/09/2569', daysLeft: 64, qty: 4000, group: 'soon' },
  { vaccine: 'Moderna COVID-19', lot: 'LOT-2026-002', expiry: '20/11/2569', daysLeft: 130, qty: 3200, group: 'safe' },
  { vaccine: 'Sinovac COVID-19', lot: 'LOT-2026-004', expiry: '28/02/2570', daysLeft: 230, qty: 2500, group: 'safe' },
  { vaccine: 'Pfizer-BioNTech COVID-19', lot: 'LOT-2026-001', expiry: '30/06/2570', daysLeft: 352, qty: 5000, group: 'safe' },
];

const groupConfig = {
  expired: { title: '🔴 หมดอายุแล้ว', color: 'var(--status-danger)', countColor: 'var(--status-danger)' },
  urgent:  { title: '🟠 หมดอายุภายใน 30 วัน', color: 'var(--status-warning)', countColor: 'var(--status-warning)' },
  soon:    { title: '🟡 หมดอายุภายใน 90 วัน', color: '#eab308', countColor: '#eab308' },
  safe:    { title: '🟢 ยังไม่ถึงกำหนด', color: 'var(--status-success)', countColor: 'var(--status-success)' },
};

const ExpiryCalendar: React.FC = () => {
  const { addToast } = useToast();
  const groups: (keyof typeof groupConfig)[] = ['expired', 'urgent', 'soon', 'safe'];
  const counts = { expired: expiryData.filter(e => e.group === 'expired').length, urgent: expiryData.filter(e => e.group === 'urgent').length, soon: expiryData.filter(e => e.group === 'soon').length, safe: expiryData.filter(e => e.group === 'safe').length };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>📅 ปฏิทินวันหมดอายุวัคซีน</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>ติดตามวันหมดอายุของวัคซีนทุกล็อต</p>
      </div>

      {/* Summary Cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card stat-card">
          <div className="stat-content">
            <h3>หมดอายุแล้ว</h3>
            <p style={{ color: 'var(--status-danger)' }}>{counts.expired}</p>
          </div>
          <div className="stat-icon red"><AlertTriangle size={24} /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-content">
            <h3>หมดอายุใน 30 วัน</h3>
            <p style={{ color: 'var(--status-warning)' }}>{counts.urgent}</p>
          </div>
          <div className="stat-icon yellow"><CalendarDays size={24} /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-content">
            <h3>หมดอายุใน 90 วัน</h3>
            <p>{counts.soon}</p>
          </div>
          <div className="stat-icon blue"><CalendarDays size={24} /></div>
        </div>
      </div>

      {/* Grouped List */}
      {groups.map(group => {
        const items = expiryData.filter(e => e.group === group);
        if (items.length === 0) return null;
        const cfg = groupConfig[group];
        return (
          <div key={group} className="expiry-section">
            <h2 className="expiry-section-title">{cfg.title} ({items.length} รายการ)</h2>
            {items.map((item, i) => (
              <div key={i} className={`expiry-card ${group}`}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.vaccine}</p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Lot: {item.lot} &nbsp;|&nbsp; คงเหลือ: {item.qty.toLocaleString()} โดส &nbsp;|&nbsp; หมดอายุ: {item.expiry}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div className="days-remaining" style={{ color: cfg.countColor }}>
                    {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)}` : item.daysLeft}
                    <p style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{item.daysLeft < 0 ? 'วันที่แล้ว' : 'วันเหลือ'}</p>
                  </div>
                  {group === 'expired' ? (
                    <button className="btn btn-danger" style={{ fontSize: '0.95rem', padding: '0.7rem 1.2rem', gap: '0.4rem', whiteSpace: 'nowrap' }}
                      onClick={() => addToast(`บันทึกการทำลายยา ${item.vaccine} (${item.lot}) เรียบร้อย`, 'warning')}>
                      <Trash2 size={16} /> ทำลายทิ้ง
                    </button>
                  ) : group === 'urgent' || group === 'soon' ? (
                    <button className="btn btn-secondary" style={{ fontSize: '0.95rem', padding: '0.7rem 1.2rem', gap: '0.4rem', whiteSpace: 'nowrap' }}
                      onClick={() => addToast(`ส่งแจ้งเตือนทีมเรื่อง ${item.vaccine} เรียบร้อย`, 'success')}>
                      <Bell size={16} /> แจ้งเตือนทีม
                    </button>
                  ) : (
                    <span className="flex items-center" style={{ gap: '0.3rem', color: 'var(--status-success)', whiteSpace: 'nowrap' }}>
                      <ShieldCheck size={16} /> ปลอดภัย
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ExpiryCalendar;
