import React, { useState } from 'react';
import { Bell, Send, CheckSquare, MessageCircle } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface ChatMessage { text: string; time: string; type: 'normal' | 'alert' | 'warning'; }

const mockMessages: ChatMessage[] = [
  { text: '🌡️ สรุปอุณหภูมิเช้า 08:30\n✅ ตู้เย็นหลัก: 4.2°C (ปกติ)\n✅ ตู้แช่แข็ง OPV: -18.5°C (ปกติ)\nสต็อกรวม: 15,900 โดส', time: '08:30', type: 'normal' },
  { text: '🌡️ สรุปอุณหภูมิบ่าย 14:00\n✅ ตู้เย็นหลัก: 4.8°C (ปกติ)\n✅ ตู้แช่แข็ง OPV: -17.9°C (ปกติ)\nสต็อกรวม: 15,850 โดส', time: '14:00', type: 'normal' },
  { text: '🚨 แจ้งเตือนฉุกเฉิน!\nตู้เย็นหลัก อุณหภูมิสูงผิดปกติ: 12.3°C\nช่วงปลอดภัย: 2-8°C\nกรุณาตรวจสอบทันที!', time: '15:22', type: 'alert' },
  { text: '⚠️ แจ้งเตือนยาใกล้หมดอายุ\nFluarix Influenza (LOT-2026-005)\nหมดอายุ: 30 ส.ค. 2569\nเหลืออีก 28 วัน', time: '09:00', type: 'warning' },
  { text: '📊 สรุปประจำเดือน กรกฎาคม 2569\nรับเข้า: 2,500 โดส\nตัดใช้: 1,800 โดส\nคงเหลือ: 15,900 โดส\nอุณหภูมิคลาดเคลื่อน: 3 ครั้ง', time: '17:00 (สิ้นเดือน)', type: 'normal' },
];

const LinePreview: React.FC = () => {
  const { addToast } = useToast();
  const [alerts, setAlerts] = useState({ temp: true, expiry: true, daily: true, monthly: true });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>📱 ตัวอย่างการแจ้งเตือน LINE</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>ตัวอย่างข้อความที่ระบบจะส่งผ่าน LINE Notify</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
        {/* LEFT: LINE Chat Mock */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="line-chat-header">
            <MessageCircle size={22} />
            VCCMS Alert — กลุ่มแจ้งเตือนวัคซีน
          </div>
          <div className="line-chat">
            {mockMessages.map((msg, i) => (
              <div key={i}>
                <div className={`line-bubble ${msg.type === 'alert' ? 'alert-bubble' : msg.type === 'warning' ? 'warning-bubble' : ''}`}>
                  {msg.text}
                </div>
                <p className="line-bubble-time">{msg.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Config */}
        <div className="flex flex-col" style={{ gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              <Bell size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--status-warning)' }} />
              ตั้งค่าการแจ้งเตือน
            </h3>
            <div className="flex flex-col" style={{ gap: '1.25rem' }}>
              {([
                { key: 'temp', label: '🚨 อุณหภูมิผิดปกติ (ทันที)', desc: 'แจ้งเตือนเมื่ออุณหภูมิเกินช่วงที่กำหนด' },
                { key: 'expiry', label: '⚠️ ยาใกล้หมดอายุ', desc: 'แจ้งเตือนล่วงหน้า 30 วัน และทุกสัปดาห์' },
                { key: 'daily', label: '🌡️ สรุปอุณหภูมิประจำวัน', desc: '2 ครั้ง/วัน (08:30 และ 14:00)' },
                { key: 'monthly', label: '📊 สรุปประจำเดือน', desc: 'วันสุดท้ายของเดือน' },
              ] as const).map(item => (
                <label key={item.key} className="flex items-center" style={{ gap: '1rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={alerts[item.key]} onChange={e => setAlerts({ ...alerts, [item.key]: e.target.checked })}
                    style={{ width: 22, height: 22, accentColor: 'var(--accent-primary)' }} />
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 600 }}>{item.label}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
              <Send size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              ข้อมูลการส่ง
            </h3>
            <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              {[['ช่องทาง', 'LINE Notify'], ['กลุ่มเป้าหมาย', 'กลุ่ม VCCMS Alert'], ['โควตา/เดือน', '60 ข้อความ'], ['ใช้ไปแล้ว', '44 ข้อความ']].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary w-full" style={{ fontSize: '1.1rem', padding: '1rem 2rem', gap: '0.5rem' }}
              onClick={() => addToast('ทดสอบส่ง LINE สำเร็จ! ตรวจสอบกลุ่ม LINE ของคุณ', 'success')}>
              <Send size={18} />
              ทดสอบส่ง LINE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinePreview;
