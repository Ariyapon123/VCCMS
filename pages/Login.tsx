import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snowflake, LogIn, User, Lock } from 'lucide-react';
import { useToast } from '../components/ToastContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('pharmacist_head');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      addToast('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน', 'error');
      return;
    }
    addToast(`เข้าสู่ระบบสำเร็จ — ยินดีต้อนรับคุณ ${username}`, 'success');
    setTimeout(() => navigate('/'), 500);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', color: 'white'
          }}>
            <Snowflake size={36} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '-0.025em' }}>VCCMS</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            ระบบจัดการคลังวัคซีนและห่วงโซ่ความเย็น
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '1.05rem' }}>
              <User size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              ชื่อผู้ใช้งาน
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="เช่น somsri_pharm"
              style={{ fontSize: '1.1rem', padding: '1rem 1.25rem' }}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '1.05rem' }}>
              <Lock size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              รหัสผ่าน
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="กรอกรหัสผ่าน"
              style={{ fontSize: '1.1rem', padding: '1rem 1.25rem' }}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '1.05rem' }}>ตำแหน่ง / บทบาท</label>
            <select
              className="form-control"
              style={{ fontSize: '1.1rem', padding: '1rem 1.25rem' }}
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="pharmacist_head">🔑 เภสัชกรหัวหน้า (Admin)</option>
              <option value="pharmacist">💊 เภสัชกร</option>
              <option value="nurse_a">🏥 พยาบาลวอร์ด A</option>
              <option value="nurse_b">🏥 พยาบาลวอร์ด B</option>
              <option value="nurse_c">🏥 พยาบาลวอร์ด C</option>
              <option value="doctor">👨‍⚕️ แพทย์</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ fontSize: '1.2rem', padding: '1.1rem 2rem', marginTop: '1.5rem', gap: '0.75rem' }}
          >
            <LogIn size={22} />
            เข้าสู่ระบบ
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Vaccine Cold Chain Management System v1.0
        </p>
      </div>
    </div>
  );
};

export default Login;
