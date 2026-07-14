import React, { useState } from 'react';
import { Camera, Search, Trash2, X, CheckCircle, ScanLine } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { mockLots } from './Dashboard';

const QRScanner: React.FC = () => {
  const { addToast } = useToast();
  const [scannedLot, setScannedLot] = useState<typeof mockLots[0] | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [stockCut, setStockCut] = useState(false);

  const simulateScan = () => {
    const randomLot = mockLots[Math.floor(Math.random() * mockLots.length)];
    setScannedLot(randomLot);
    setStockCut(false);
    addToast(`สแกนสำเร็จ — พบข้อมูล ${randomLot.vaccine}`, 'success');
  };

  const handleManualSearch = () => {
    if (!manualInput.trim()) { addToast('กรุณาพิมพ์รหัส Lot', 'error'); return; }
    const found = mockLots.find(l => l.id.toLowerCase().includes(manualInput.toLowerCase()));
    if (found) { setScannedLot(found); setStockCut(false); addToast(`พบข้อมูล ${found.vaccine}`, 'success'); }
    else { addToast('ไม่พบรหัส Lot ในระบบ กรุณาตรวจสอบอีกครั้ง', 'error'); }
  };

  const confirmCut = () => {
    setShowConfirm(false);
    setStockCut(true);
    addToast(`✅ ตัดสต็อกสำเร็จ — ${scannedLot?.vaccine} (${scannedLot?.id}) ถูกตัดออกจากคลังแล้ว`, 'success');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>📷 สแกน QR/Barcode ตัดสต็อก</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
          สแกนรหัสบนขวดวัคซีนเพื่อตัดยาออกจากคลัง
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* LEFT: Scanner */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            <ScanLine size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            สแกนวัคซีน
          </h3>

          {/* Simulated Viewfinder */}
          <div className="scanner-viewfinder" onClick={simulateScan}>
            <span className="scan-icon">📷</span>
            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>กดที่นี่ หรือกดปุ่มด้านล่าง<br />เพื่อจำลองการสแกน</p>
          </div>

          <button
            className="btn btn-primary w-full"
            style={{ marginTop: '1.5rem', fontSize: '1.15rem', padding: '1rem 2rem', gap: '0.75rem' }}
            onClick={simulateScan}
          >
            <Camera size={22} />
            จำลองการสแกน
          </button>

          {/* Manual Input */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
              หรือพิมพ์รหัส Lot ด้วยตนเอง
            </label>
            <div className="flex" style={{ gap: '0.75rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น LOT-2026-001"
                style={{ flex: 1, fontSize: '1.1rem', padding: '0.9rem 1rem' }}
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
              />
              <button className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '0.9rem 1.5rem', gap: '0.5rem' }} onClick={handleManualSearch}>
                <Search size={20} />
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Result */}
        <div>
          {!scannedLot ? (
            <div className="card" style={{
              padding: '4rem 2rem', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: '400px', color: 'var(--text-muted)'
            }}>
              <ScanLine size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
              <p style={{ fontSize: '1.3rem', fontWeight: 600 }}>ยังไม่ได้สแกน</p>
              <p style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>กรุณาสแกนรหัสยาหรือพิมพ์รหัส Lot</p>
            </div>
          ) : (
            <div className="card scan-result-card" style={{ padding: '2rem' }}>
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>📋 ข้อมูลวัคซีน</h3>
                <span className={`badge ${scannedLot.statusType}`} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                  {scannedLot.status}
                </span>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                {scannedLot.vaccine}
              </h2>

              <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                {[
                  ['รหัส Lot', scannedLot.id],
                  ['ผู้ผลิต', scannedLot.manufacturer],
                  ['วันหมดอายุ', '30 มิถุนายน 2570'],
                  ['อุณหภูมิปัจจุบัน', `${scannedLot.temp} °C`],
                  ['ช่วงอุณหภูมิที่กำหนด', scannedLot.requiredTemp],
                  ['สต็อกคงเหลือ', `${scannedLot.qty.toLocaleString()} โดส`],
                ].map(([label, val], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: i < 5 ? '1px solid var(--border-color)' : 'none' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{label}</span>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{val}</span>
                  </div>
                ))}
              </div>

              {stockCut ? (
                <div style={{ background: 'var(--status-success-bg)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', textAlign: 'center' }}>
                  <CheckCircle size={40} style={{ color: 'var(--status-success)', marginBottom: '0.75rem' }} />
                  <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--status-success)' }}>ตัดสต็อกเรียบร้อยแล้ว</p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>ยาถูกนำออกจากคลังแล้ว</p>
                </div>
              ) : (
                <button
                  className="btn btn-danger w-full"
                  style={{ fontSize: '1.2rem', padding: '1.1rem 2rem', gap: '0.75rem' }}
                  onClick={() => setShowConfirm(true)}
                >
                  <Trash2 size={22} />
                  ตัดออกจากสต็อก
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && scannedLot && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ fontSize: '1.3rem' }}>⚠️ ยืนยันการตัดสต็อก</h3>
              <button className="btn-icon" onClick={() => setShowConfirm(false)}><X size={22} /></button>
            </div>
            <div style={{ background: 'var(--status-danger-bg)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>{scannedLot.vaccine}</p>
              <p style={{ fontSize: '1rem' }}>Lot: {scannedLot.id}</p>
              <p style={{ fontSize: '1rem' }}>จำนวนที่จะตัด: 1 โดส</p>
              <p style={{ fontSize: '1rem' }}>สต็อกคงเหลือหลังตัด: {(scannedLot.qty - 1).toLocaleString()} โดส</p>
            </div>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>
              คุณแน่ใจหรือไม่ว่าต้องการตัดยานี้ออกจากสต็อก?
            </p>
            <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '0.9rem 1.5rem' }} onClick={() => setShowConfirm(false)}>
                ยกเลิก
              </button>
              <button className="btn btn-danger" style={{ fontSize: '1.05rem', padding: '0.9rem 1.5rem', gap: '0.5rem' }} onClick={confirmCut}>
                <CheckCircle size={18} />
                ยืนยันตัดสต็อก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
