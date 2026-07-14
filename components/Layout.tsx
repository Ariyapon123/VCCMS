import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Thermometer, 
  Settings, 
  Snowflake,
  Bell,
  User,
  ScanLine,
  Truck,
  Activity,
  CalendarDays,
  Smartphone,
  BarChart3,
  ScrollText
} from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-area">
          <Snowflake size={28} />
          <span>VCCMS</span>
        </div>
        <nav className="nav-menu">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} /><span>แดชบอร์ด</span>
          </NavLink>
          <NavLink to="/scanner" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <ScanLine size={20} /><span>สแกน QR ตัดสต็อก</span>
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Package size={20} /><span>คลังหลัก</span>
          </NavLink>
          <NavLink to="/transfer" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Truck size={20} /><span>เบิก-จ่ายวัคซีน</span>
          </NavLink>
          <NavLink to="/ward-view" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Activity size={20} /><span>คลังรอง (วอร์ด)</span>
          </NavLink>
          <NavLink to="/monitoring" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Thermometer size={20} /><span>ติดตามอุณหภูมิ</span>
          </NavLink>
          <NavLink to="/expiry" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <CalendarDays size={20} /><span>ปฏิทินหมดอายุ</span>
          </NavLink>
          <NavLink to="/line-preview" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Smartphone size={20} /><span>ตัวอย่าง LINE</span>
          </NavLink>
          <NavLink to="/monthly-report" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <BarChart3 size={20} /><span>สรุปประจำเดือน</span>
          </NavLink>
          <NavLink to="/audit" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <ScrollText size={20} /><span>ประวัติการใช้งาน</span>
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Settings size={20} /><span>ตั้งค่าระบบ</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Vaccine Cold Chain</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status: Active & Secure</p>
          </div>
          <div className="flex" style={{ gap: '1.5rem', alignItems: 'center' }}>
            <button className="btn-icon" style={{ position: 'relative' }}>
              <Bell size={20} />
              <span style={{ 
                position: 'absolute', 
                top: 4, 
                right: 4, 
                width: 8, 
                height: 8, 
                backgroundColor: 'var(--status-danger)', 
                borderRadius: '50%' 
              }}></span>
            </button>
            <div className="flex" style={{ gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                backgroundColor: 'var(--accent-light)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                fontWeight: 600
              }}>
                <User size={18} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Administrator</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Role: Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
