import React, { useState } from 'react';
import { Plus, X, PackageCheck, Truck, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { mockLots } from './Dashboard';

interface TransferRequest {
  id: string; vaccine: string; qty: number; from: string; to: string;
  requester: string; status: string; statusType: string; date: string;
}

const initialTransfers: TransferRequest[] = [
  { id: 'REQ-010', vaccine: 'Pfizer-BioNTech COVID-19', qty: 100, from: 'คลังหลัก', to: 'วอร์ด A', requester: 'พยาบาล วิภา', status: 'รอดำเนินการ', statusType: 'warning', date: '13/07/2569 14:30' },
  { id: 'REQ-009', vaccine: 'Moderna COVID-19', qty: 50, from: 'คลังหลัก', to: 'วอร์ด B', requester: 'พยาบาล มาลี', status: 'อนุมัติแล้ว', statusType: 'primary', date: '13/07/2569 10:15' },
  { id: 'REQ-008', vaccine: 'Sinovac COVID-19', qty: 200, from: 'คลังหลัก', to: 'วอร์ด C', requester: 'แพทย์ สมชาย', status: 'กำลังจัดส่ง', statusType: 'primary', date: '12/07/2569 16:00' },
  { id: 'REQ-007', vaccine: 'AstraZeneca COVID-19', qty: 150, from: 'คลังหลัก', to: 'วอร์ด A', requester: 'พยาบาล วิภา', status: 'รับแล้ว', statusType: 'success', date: '11/07/2569 09:30' },
  { id: 'REQ-006', vaccine: 'Fluarix Influenza', qty: 80, from: 'คลังหลัก', to: 'วอร์ด B', requester: 'พยาบาล มาลี', status: 'รับแล้ว', statusType: 'success', date: '10/07/2569 11:00' },
  { id: 'REQ-005', vaccine: 'Pfizer-BioNTech COVID-19', qty: 500, from: 'คลังหลัก', to: 'วอร์ด C', requester: 'แพทย์ สมชาย', status: 'ปฏิเสธ', statusType: 'danger', date: '09/07/2569 08:45' },
];

const Transfer: React.FC = () => {
  const { addToast } = useToast();
  const [transfers, setTransfers] = useState(initialTransfers);
  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  const [showModal, setShowModal] = useState(false);
  const [newReq, setNewReq] = useState({ vaccine: mockLots[0].vaccine, qty: '', ward: 'วอร์ด A' });

  const tabs = ['ทั้งหมด', 'รอดำเนินการ', 'กำลังจัดส่ง', 'รับแล้ว'];
  const filtered = activeTab === 'ทั้งหมด' ? transfers : transfers.filter(t => t.status === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReq.qty || parseInt(newReq.qty) <= 0) { addToast('กรุณาระบุจำนวนโดส', 'error'); return; }
    const req: TransferRequest = {
      id: `REQ-0${transfers.length + 5}`, vaccine: newReq.vaccine, qty: parseInt(newReq.qty),
      from: 'คลังหลัก', to: newReq.ward, requester: 'คุณ (ผู้ใช้ปัจจุบัน)',
      status: 'รอดำเนินการ', statusType: 'warning',
      date: new Date().toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setTransfers([req, ...transfers]);
    setShowModal(false);
    setNewReq({ vaccine: mockLots[0].vaccine, qty: '', ward: 'วอร์ด A' });
    addToast(`ส่งคำขอเบิก ${req.vaccine} จำนวน ${req.qty} โดส ไปยัง ${req.to} เรียบร้อย`, 'success');
  };

  const handleReceive = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'รับแล้ว', statusType: 'success' } : t));
    addToast(`✅ รับยาคำขอ ${id} เรียบร้อยแล้ว — สต็อกคลังรองอัปเดตแล้ว`, 'success');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>📋 เบิก-จ่ายวัคซีน</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>ระบบขอเบิกวัคซีนจากคลังหลักไปยังคลังรอง</p>
        </div>
        <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', gap: '0.75rem' }} onClick={() => setShowModal(true)}>
          <Plus size={22} />
          สร้างคำขอเบิกใหม่
        </button>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        {tabs.map(tab => (
          <button key={tab} className={`status-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>เลขที่คำขอ</th>
              <th>วัคซีน</th>
              <th>จำนวน (โดส)</th>
              <th>จากคลัง → ไปยัง</th>
              <th>ผู้ขอเบิก</th>
              <th>สถานะ</th>
              <th>วันที่</th>
              <th style={{ textAlign: 'right' }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700 }}>{t.id}</td>
                <td>{t.vaccine}</td>
                <td style={{ fontWeight: 600 }}>{t.qty.toLocaleString()}</td>
                <td>
                  <span className="flex items-center" style={{ gap: '0.5rem', fontSize: '0.95rem' }}>
                    {t.from} <ArrowRight size={14} /> {t.to}
                  </span>
                </td>
                <td>{t.requester}</td>
                <td><span className={`badge ${t.statusType}`}>{t.status}</span></td>
                <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.date}</td>
                <td style={{ textAlign: 'right' }}>
                  {t.status === 'กำลังจัดส่ง' && (
                    <button className="btn btn-primary" style={{ fontSize: '0.95rem', padding: '0.6rem 1.2rem', gap: '0.4rem' }} onClick={() => handleReceive(t.id)}>
                      <PackageCheck size={16} />
                      รับยาแล้ว
                    </button>
                  )}
                  {t.status === 'รอดำเนินการ' && (
                    <span className="flex items-center" style={{ gap: '0.4rem', color: 'var(--text-muted)', justifyContent: 'flex-end' }}>
                      <Clock size={14} /> รอเภสัชอนุมัติ
                    </span>
                  )}
                  {t.status === 'รับแล้ว' && (
                    <span style={{ color: 'var(--status-success)' }}>✅ เสร็จสิ้น</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>ไม่มีรายการที่ตรงกับตัวกรอง</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ fontSize: '1.3rem' }}>
                <Truck size={22} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                สร้างคำขอเบิกวัคซีน
              </h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '1.05rem' }}>เลือกวัคซีนที่ต้องการเบิก</label>
                <select className="form-control" style={{ fontSize: '1.05rem', padding: '0.9rem 1rem' }} value={newReq.vaccine} onChange={e => setNewReq({ ...newReq, vaccine: e.target.value })}>
                  {mockLots.map(l => <option key={l.id} value={l.vaccine}>{l.vaccine} — คงเหลือ {l.qty.toLocaleString()} โดส</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '1.05rem' }}>จำนวนที่ต้องการเบิก (โดส)</label>
                <input type="number" className="form-control" placeholder="เช่น 100" min="1" required
                  style={{ fontSize: '1.1rem', padding: '0.9rem 1rem' }} value={newReq.qty} onChange={e => setNewReq({ ...newReq, qty: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '1.05rem' }}>ส่งไปยังวอร์ด</label>
                <select className="form-control" style={{ fontSize: '1.05rem', padding: '0.9rem 1rem' }} value={newReq.ward} onChange={e => setNewReq({ ...newReq, ward: e.target.value })}>
                  <option value="วอร์ด A">🏥 วอร์ด A</option>
                  <option value="วอร์ด B">🏥 วอร์ด B</option>
                  <option value="วอร์ด C">🏥 วอร์ด C</option>
                </select>
              </div>
              <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '0.9rem 1.5rem' }} onClick={() => setShowModal(false)}>ยกเลิก</button>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 1.5rem', gap: '0.5rem' }}>
                  <CheckCircle size={18} /> ส่งคำขอเบิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;
