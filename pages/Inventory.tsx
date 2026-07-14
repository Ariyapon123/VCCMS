import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, Eye, X } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { mockLots as initialLots } from './Dashboard';

const Inventory: React.FC = () => {
  const [lots, setLots] = useState(initialLots);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  // Form State
  const [newLot, setNewLot] = useState({
    id: '',
    vaccine: '',
    manufacturer: '',
    temp: '',
    requiredTemp: '2°C to 8°C',
    qty: '',
    mfgDate: '',
    expDate: ''
  });

  const handleDelete = (id: string) => {
    setLots(lots.filter(lot => lot.id !== id));
    addToast(`Lot ${id} has been deleted.`, 'warning');
  };

  const handleAddLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLot.id || !newLot.vaccine || !newLot.manufacturer || !newLot.temp || !newLot.qty || !newLot.mfgDate || !newLot.expDate) {
      addToast('Please fill in all fields.', 'error');
      return;
    }

    const tempNum = parseFloat(newLot.temp);
    const qtyNum = parseInt(newLot.qty);

    let status = 'Normal';
    let statusType = 'success';

    // Simplified status calculation
    if (newLot.requiredTemp === '2°C to 8°C') {
      if (tempNum < 2 || tempNum > 8) {
        status = tempNum > 10 ? 'Critical' : 'Warning';
        statusType = tempNum > 10 ? 'danger' : 'warning';
      }
    } else if (newLot.requiredTemp === '-25°C to -15°C') {
      if (tempNum < -25 || tempNum > -15) {
        status = tempNum > -10 ? 'Critical' : 'Warning';
        statusType = tempNum > -10 ? 'danger' : 'warning';
      }
    }

    const createdLot = {
      id: newLot.id.toUpperCase(),
      vaccine: newLot.vaccine,
      manufacturer: newLot.manufacturer,
      temp: tempNum,
      requiredTemp: newLot.requiredTemp,
      qty: qtyNum,
      status,
      statusType,
      mfgDate: newLot.mfgDate,
      expDate: newLot.expDate
    };

    setLots([...lots, createdLot]);
    setIsModalOpen(false);
    setNewLot({ id: '', vaccine: '', manufacturer: '', temp: '', requiredTemp: '2°C to 8°C', qty: '', mfgDate: '', expDate: '' });
    addToast(`Successfully registered new lot ${createdLot.id}!`, 'success');
  };

  const filteredLots = lots.filter(lot => {
    const matchesSearch = lot.vaccine.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lot.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Vaccine Inventory</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Register New Lot
        </button>
      </div>

      {/* Filters */}
      <div className="card flex" style={{ gap: '1rem', marginBottom: '2rem', padding: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="flex items-center" style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by lot ID, vaccine name, manufacturer..." 
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center" style={{ gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Status:</span>
          <select 
            className="form-control" 
            style={{ width: '150px', padding: '0.5rem 1rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Normal">Normal</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Lot ID</th>
              <th>Vaccine Name</th>
              <th>Manufacturer</th>
              <th>Quantity</th>
              <th>Current Temp</th>
              <th>Range Limit</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLots.length > 0 ? (
              filteredLots.map(lot => (
                <tr key={lot.id}>
                  <td>
                    <Link to={`/inventory/${lot.id}`} style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                      {lot.id}
                    </Link>
                  </td>
                  <td>{lot.vaccine}</td>
                  <td>{lot.manufacturer}</td>
                  <td>{lot.qty.toLocaleString()} doses</td>
                  <td style={{ fontWeight: 600 }}>{lot.temp} °C</td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{lot.requiredTemp}</td>
                  <td>
                    <span className={`badge ${lot.statusType}`}>{lot.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex" style={{ justifyContent: 'flex-end', gap: '0.25rem' }}>
                      <Link to={`/print-barcodes/${lot.id}`} className="btn-icon" title="Print Barcodes">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>
                      </Link>
                      <Link to={`/inventory/${lot.id}`} className="btn-icon" title="View Details">
                        <Eye size={18} />
                      </Link>
                      <button className="btn-icon delete" onClick={() => handleDelete(lot.id)} title="Delete Lot">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No vaccine lots match your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Register Vaccine Lot</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddLot}>
              <div className="form-group">
                <label className="form-label">Lot ID / Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. LOT-2026-006"
                  required
                  value={newLot.id}
                  onChange={e => setNewLot({ ...newLot, id: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vaccine Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Pfizer COVID-19"
                  required
                  value={newLot.vaccine}
                  onChange={e => setNewLot({ ...newLot, vaccine: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Manufacturer</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Pfizer / BioNTech"
                  required
                  value={newLot.manufacturer}
                  onChange={e => setNewLot({ ...newLot, manufacturer: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">MFG Date (Date of Manufacture)</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    required
                    value={newLot.mfgDate}
                    onChange={e => setNewLot({ ...newLot, mfgDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">EXP Date (Expiration Date)</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    required
                    value={newLot.expDate}
                    onChange={e => setNewLot({ ...newLot, expDate: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Qty (Doses)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 5000"
                    required
                    value={newLot.qty}
                    onChange={e => setNewLot({ ...newLot, qty: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Temp (°C)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-control" 
                    placeholder="e.g. 4.5"
                    required
                    value={newLot.temp}
                    onChange={e => setNewLot({ ...newLot, temp: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Required Range</label>
                <select 
                  className="form-control"
                  value={newLot.requiredTemp}
                  onChange={e => setNewLot({ ...newLot, requiredTemp: e.target.value })}
                >
                  <option value="2°C to 8°C">Standard Cold Chain (2°C to 8°C)</option>
                  <option value="-25°C to -15°C">Ultra Cold Chain (-25°C to -15°C)</option>
                </select>
              </div>
              <div className="flex" style={{ justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
