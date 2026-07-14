import React, { useState } from 'react';
import { FileText, Download, Clock } from 'lucide-react';
import { useToast } from '../components/ToastContext';

interface SavedReport {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  size: string;
  status: string;
}

const Report: React.FC = () => {
  const { addToast } = useToast();
  const [reportType, setReportType] = useState('temp-logs');
  const [timeRange, setTimeRange] = useState('7-days');
  const [format, setFormat] = useState('csv');

  const [savedReports] = useState<SavedReport[]>([
    { id: 'REP-102', name: 'Weekly Temperature Stability Report - July W2', type: 'Stability Audit', generatedAt: '2026-07-12 08:30', size: '1.2 MB', status: 'Completed' },
    { id: 'REP-101', name: 'Alarms & Deviations Incident Log - June 2026', type: 'Incident Report', generatedAt: '2026-07-01 10:15', size: '420 KB', status: 'Completed' },
    { id: 'REP-100', name: 'Calibration Verification Log - Q2 2026', type: 'Calibration Log', generatedAt: '2026-06-30 16:45', size: '2.5 MB', status: 'Completed' },
    { id: 'REP-099', name: 'Moderna Cold Chain Log - Ultra Low Freezer #1', type: 'Temperature Log', generatedAt: '2026-06-15 09:00', size: '850 KB', status: 'Completed' }
  ]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Initiating report generation...', 'info');
    setTimeout(() => {
      addToast(`Report successfully generated and downloaded in .${format.toUpperCase()} format!`, 'success');
    }, 1500);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Reports & Logs</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Compile, view, and export vaccine cold chain storage data</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Generator Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Generate New Report</h3>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label">Report Category</label>
              <select 
                className="form-control"
                value={reportType}
                onChange={e => setReportType(e.target.value)}
              >
                <option value="temp-logs">Temperature Telemetry Logs</option>
                <option value="alarms">Alarms and Critical Deviations</option>
                <option value="calibration">Sensor Calibration Logs</option>
                <option value="audit">System Access Audit Trail</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Timeframe Filter</label>
              <select 
                className="form-control"
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}
              >
                <option value="today">Today (Past 24 Hours)</option>
                <option value="7-days">Last 7 Days</option>
                <option value="30-days">Last 30 Days</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Export Format</label>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                <label className="flex items-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="format" value="csv" checked={format === 'csv'} onChange={() => setFormat('csv')} />
                  <span>CSV Spreadsheet</span>
                </label>
                <label className="flex items-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="format" value="pdf" checked={format === 'pdf'} onChange={() => setFormat('pdf')} />
                  <span>PDF Document</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
              <FileText size={18} />
              Generate & Download
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="card flex flex-col" style={{ gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Saved Reports Repository</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pre-compiled audit reports and periodic logs</p>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Name / Description</th>
                <th>Category</th>
                <th>Generated</th>
                <th>Size</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedReports.map(rep => (
                <tr key={rep.id}>
                  <td style={{ fontWeight: 600 }}>{rep.id}</td>
                  <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rep.name}</td>
                  <td>{rep.type}</td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div className="flex items-center" style={{ gap: '0.25rem' }}>
                      <Clock size={12} />
                      {rep.generatedAt}
                    </div>
                  </td>
                  <td>{rep.size}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn-icon"
                      onClick={() => addToast(`Downloading saved report ${rep.id} in PDF format...`, 'success')}
                    >
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
