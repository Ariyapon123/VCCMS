import React, { useState } from 'react';
import { Search, Download, ChevronDown } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface AuditEntry { id: number; datetime: string; user: string; role: string; type: string; typeClass: string; detail: string; }

const mockAudit: AuditEntry[] = [
  { id: 1, datetime: '13/07/2569 20:15', user: 'เภสัช สมศรี', role: 'เภสัชกร', type: 'เข้าสู่ระบบ', typeClass: 'login', detail: 'เข้าสู่ระบบสำเร็จ จาก IP 192.168.1.45' },
  { id: 2, datetime: '13/07/2569 19:50', user: 'พยาบาล วิภา', role: 'วอร์ด A', type: 'ตัดสต็อก', typeClass: 'stock-cut', detail: 'สแกนตัดสต็อก Pfizer (LOT-2026-001) จำนวน 10 โดส' },
  { id: 3, datetime: '13/07/2569 18:30', user: 'ระบบ', role: 'อัตโนมัติ', type: 'แจ้งเตือน', typeClass: 'alert-log', detail: 'แจ้งเตือนอุณหภูมิตู้เย็นหลักสูงผิดปกติ 12.3°C (ช่วงปลอดภัย 2-8°C)' },
  { id: 4, datetime: '13/07/2569 15:20', user: 'เภสัช สมศรี', role: 'เภสัชกร', type: 'อนุมัติเบิก', typeClass: 'approve', detail: 'อนุมัติคำขอเบิกยา REQ-007 (AstraZeneca 150 โดส ไปวอร์ด A)' },
  { id: 5, datetime: '13/07/2569 14:00', user: 'ระบบ', role: 'อัตโนมัติ', type: 'แจ้งเตือน', typeClass: 'alert-log', detail: 'ส่งสรุปอุณหภูมิบ่ายผ่าน LINE Notify สำเร็จ' },
  { id: 6, datetime: '13/07/2569 11:30', user: 'พยาบาล มาลี', role: 'วอร์ด B', type: 'เบิกยา', typeClass: 'requisition', detail: 'ขอเบิกวัคซีน Sinovac 200 โดส ไปวอร์ด B (REQ-009)' },
  { id: 7, datetime: '13/07/2569 10:45', user: 'พยาบาล วิภา', role: 'วอร์ด A', type: 'ตัดสต็อก', typeClass: 'stock-cut', detail: 'สแกนตัดสต็อก AstraZeneca (LOT-2026-003) จำนวน 5 โดส' },
  { id: 8, datetime: '13/07/2569 09:15', user: 'เภสัช สมศรี', role: 'เภสัชกร', type: 'แก้ไขข้อมูล', typeClass: 'edit', detail: 'แก้ไขจำนวนสต็อก Moderna (LOT-2026-002) จาก 3,250 เป็น 3,200 โดส' },
  { id: 9, datetime: '13/07/2569 08:30', user: 'ระบบ', role: 'อัตโนมัติ', type: 'แจ้งเตือน', typeClass: 'alert-log', detail: 'ส่งสรุปอุณหภูมิเช้าผ่าน LINE Notify สำเร็จ' },
  { id: 10, datetime: '12/07/2569 16:00', user: 'แพทย์ สมชาย', role: 'วอร์ด C', type: 'เบิกยา', typeClass: 'requisition', detail: 'ขอเบิกวัคซีน Sinovac 200 โดส ไปวอร์ด C (REQ-008)' },
  { id: 11, datetime: '12/07/2569 14:20', user: 'พยาบาล สุดา', role: 'วอร์ด C', type: 'ตัดสต็อก', typeClass: 'stock-cut', detail: 'สแกนตัดสต็อก Pfizer (LOT-2026-001) จำนวน 20 โดส' },
  { id: 12, datetime: '12/07/2569 08:00', user: 'เภสัช สมศรี', role: 'เภสัชกร', type: 'เข้าสู่ระบบ', typeClass: 'login', detail: 'เข้าสู่ระบบสำเร็จ จาก IP 192.168.1.45' },
];

const AuditLog: React.FC = () => {
  const { addToast } = useToast();
  const [typeFilter, setTypeFilter] = useState('ทั้งหมด');
  const [userFilter, setUserFilter] = useState('ทั้งหมด');
  const [visibleCount, setVisibleCount] = useState(8);

  const types = ['ทั้งหมด', 'เข้าสู่ระบบ', 'เบิกยา', 'ตัดสต็อก', 'แก้ไขข้อมูล', 'แจ้งเตือน', 'อนุมัติเบิก'];
  const users = ['ทั้งหมด', ...Array.from(new Set(mockAudit.map(a => a.user)))];

  const filtered = mockAudit.filter(a =>
    (typeFilter === 'ทั้งหมด' || a.type === typeFilter) &&
    (userFilter === 'ทั้งหมด' || a.user === userFilter)
  );

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>📜 บันทึกประวัติการใช้งานระบบ</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>Audit Log — ข้อมูลทุกการกระทำในระบบ</p>
        </div>
        <button className="btn btn-secondary" style={{ fontSize: '1rem', padding: '0.8rem 1.5rem', gap: '0.5rem' }}
          onClick={() => addToast('ดาวน์โหลดรายงาน Audit Log สำเร็จ', 'success')}>
          <Download size={18} /> ส่งออก CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card flex" style={{ gap: '1.5rem', marginBottom: '2rem', padding: '1.25rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ minWidth: '200px' }}>
          <label className="form-label" style={{ fontSize: '0.95rem' }}>ประเภทกิจกรรม</label>
          <select className="form-control" style={{ padding: '0.7rem 1rem' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ minWidth: '200px' }}>
          <label className="form-label" style={{ fontSize: '0.95rem' }}>ผู้ใช้งาน</label>
          <select className="form-control" style={{ padding: '0.7rem 1rem' }} value={userFilter} onChange={e => setUserFilter(e.target.value)}>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <button className="btn btn-secondary" style={{ gap: '0.4rem', padding: '0.7rem 1.2rem' }} onClick={() => { setTypeFilter('ทั้งหมด'); setUserFilter('ทั้งหมด'); }}>
          <Search size={16} /> ล้างตัวกรอง
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ลำดับ</th>
              <th>วันที่-เวลา</th>
              <th>ผู้ใช้งาน</th>
              <th>ตำแหน่ง</th>
              <th>ประเภท</th>
              <th>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, visibleCount).map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{a.id}</td>
                <td style={{ fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{a.datetime}</td>
                <td style={{ fontWeight: 600 }}>{a.user}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{a.role}</td>
                <td>
                  <span className={`badge audit-badge ${a.typeClass}`} style={{ padding: '0.4rem 0.85rem' }}>{a.type}</span>
                </td>
                <td style={{ fontSize: '0.95rem', maxWidth: '400px' }}>{a.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleCount < filtered.length && (
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <button className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '0.8rem 2rem', gap: '0.5rem' }}
              onClick={() => setVisibleCount(prev => prev + 8)}>
              <ChevronDown size={18} /> แสดงเพิ่มเติม ({filtered.length - visibleCount} รายการ)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
