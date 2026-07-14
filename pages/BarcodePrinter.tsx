import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Barcode from 'react-barcode';
import { ArrowLeft, Printer } from 'lucide-react';
import { mockLots } from './Dashboard';

const BarcodePrinter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const lot = mockLots.find(l => l.id === id);
  const [printCount, setPrintCount] = useState(10); // Default to 10 for preview

  useEffect(() => {
    // Inject print styles when component mounts
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #printable-area, #printable-area * {
          visibility: visible;
        }
        #printable-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
        .barcode-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          page-break-inside: avoid;
        }
        .barcode-item {
          page-break-inside: avoid;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!lot) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Lot not found.</h2>
        <Link to="/inventory" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Inventory
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Generate an array of barcodes based on printCount
  const barcodesToPrint = Array.from({ length: printCount }).map((_, index) => {
    // Format serial number e.g., 0001, 0002
    const serialNum = String(index + 1).padStart(4, '0');
    return `${lot.id}-${serialNum}`;
  });

  return (
    <div>
      <div className="no-print" style={{ marginBottom: '2rem' }}>
        <Link to="/inventory" className="btn btn-secondary" style={{ marginBottom: '1.5rem', display: 'inline-flex', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Inventory
        </Link>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Print Barcodes: {lot.id}</h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Vaccine Name</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{lot.vaccine}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>MFG Date</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{lot.mfgDate || 'N/A'}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>EXP Date</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{lot.expDate || 'N/A'}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Total Qty</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{lot.qty}</p>
            </div>
          </div>

          <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0, maxWidth: '200px' }}>
              <label className="form-label">Quantity to Print</label>
              <input 
                type="number" 
                className="form-control" 
                value={printCount} 
                onChange={(e) => setPrintCount(Math.max(1, Math.min(lot.qty, parseInt(e.target.value) || 1)))}
                min={1}
                max={lot.qty}
              />
            </div>
            <button className="btn btn-primary" onClick={handlePrint} style={{ gap: '0.5rem' }}>
              <Printer size={18} /> Print Now
            </button>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Preview showing {printCount} barcodes. In a real scenario, you can print all {lot.qty} items via batch processing.
          </p>
        </div>
      </div>

      <div id="printable-area" style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
        <h3 className="no-print" style={{ marginBottom: '1rem' }}>Print Preview</h3>
        <div 
          className="barcode-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}
        >
          {barcodesToPrint.map((code, idx) => (
            <div key={idx} className="barcode-item" style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center', borderRadius: '4px', backgroundColor: '#fff' }}>
              <Barcode 
                value={code} 
                width={1.5} 
                height={50} 
                fontSize={12}
                margin={5}
                background="#ffffff"
              />
              <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>
                {lot.vaccine} <br/>
                EXP: {lot.expDate || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarcodePrinter;
