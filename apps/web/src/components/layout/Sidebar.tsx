import { Link, useLocation } from '@tanstack/react-router';
import { useState } from 'react';

export const Sidebar = () => {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
  // const { pathname } = useLocation()
  // pathname.startsWith('/inventory')

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#09090b',
        borderRight: '1px solid #27272a',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #18181b',
        }}
      >
        <div>
          ⚡
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Neon Nova
          </h1>
          <span style={{ fontSize: '11px', color: '#71717a', fontWeight: 500 }}>Taller 3D & Neón LED</span>
        </div>
      </div>

      {/* Menú Principal */}
      <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <Link to='/'>
          <span>Inicio</span>
        </Link>
        <Link to='/calculator'>
          <span>Calculadora</span>
        </Link>
        <Link to='/finances'>
          <span>Finanzas</span>
        </Link>
        <Link to='/orders'>
          <span>Ventas / Pedidos</span>
        </Link>

        <div>
          <button
            type="button"
            onClick={() => setIsInventoryOpen(prev => !prev)}>
            <div>
              <span style={{ fontSize: '16px' }}>📦</span>
              <span>Inventario</span>
            </div>
            <span>{isInventoryOpen ? '▼' : '▶'}</span>
          </button>

          {
            isInventoryOpen && (
              <div>
                <Link to='/inventory/filaments'>
                  <span>Filamentos</span>
                </Link>
                <Link to='/inventory/supplies'>
                  <span>Insumos</span>
                </Link>
                <Link to='/inventory/products'>
                  <span>Productos</span>
                </Link>
              </div>
            )
          }
        </div>
      </nav>

      {/* Footer Usuario */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid #18181b',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#27272a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#a855f7',
            fontSize: '14px',
          }}
        >
          OP
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Operador Taller
          </span>
          <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>Admin Mode</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
