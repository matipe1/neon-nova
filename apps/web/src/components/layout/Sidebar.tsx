import { useState } from 'react';

export type AppView =
  | 'dashboard'
  | 'inventory-filaments'
  | 'inventory-supplies'
  | 'catalog'
  | 'calculator'
  | 'orders'
  | 'finances';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Sidebar = ({ currentView, onNavigate }: SidebarProps) => {
  const [isInventoryOpen, setIsInventoryOpen] = useState(true);

  const isInventoryActive =
    currentView === 'inventory-filaments' || currentView === 'inventory-supplies';

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
      {/* Header Logo */}
      <div
        style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #18181b',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
          }}
        >
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
        {/* 1. Dashboard */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          style={{
            ...navItemStyle,
            backgroundColor: currentView === 'dashboard' ? '#ef4444' : 'transparent',
            color: currentView === 'dashboard' ? '#ffffff' : '#a1a1aa',
          }}
        >
          <span style={{ fontSize: '16px' }}>🏠</span>
          <span>Inicio / Dashboard</span>
        </button>

        {/* 2. Inventario (Desplegable / Accordion) */}
        <div>
          <button
            type="button"
            onClick={() => setIsInventoryOpen((prev) => !prev)}
            style={{
              ...navItemStyle,
              justifyContent: 'space-between',
              color: isInventoryActive ? '#ffffff' : '#a1a1aa',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>📦</span>
              <span style={{ fontWeight: isInventoryActive ? 700 : 500 }}>Inventario</span>
            </div>
            <span style={{ fontSize: '10px', transition: 'transform 0.2s', transform: isInventoryOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              ▶
            </span>
          </button>

          {/* Sub-Items Desplegables de Inventario */}
          {isInventoryOpen && (
            <div style={{ paddingLeft: '28px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button
                type="button"
                onClick={() => onNavigate('inventory-filaments')}
                style={{
                  ...subNavItemStyle,
                  backgroundColor: currentView === 'inventory-filaments' ? '#ef4444' : 'transparent',
                  color: currentView === 'inventory-filaments' ? '#ffffff' : '#a1a1aa',
                  fontWeight: currentView === 'inventory-filaments' ? 700 : 500,
                }}
              >
                <span>🧵 Filamentos</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('inventory-supplies')}
                style={{
                  ...subNavItemStyle,
                  backgroundColor: currentView === 'inventory-supplies' ? '#ef4444' : 'transparent',
                  color: currentView === 'inventory-supplies' ? '#ffffff' : '#a1a1aa',
                  fontWeight: currentView === 'inventory-supplies' ? 700 : 500,
                }}
              >
                <span>🔩 Insumos</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Productos */}
        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          style={{
            ...navItemStyle,
            backgroundColor: currentView === 'catalog' ? '#ef4444' : 'transparent',
            color: currentView === 'catalog' ? '#ffffff' : '#a1a1aa',
          }}
        >
          <span style={{ fontSize: '16px' }}>🛍️</span>
          <span>Productos</span>
        </button>

        {/* 4. Calculadora */}
        <button
          type="button"
          onClick={() => onNavigate('calculator')}
          style={{
            ...navItemStyle,
            backgroundColor: currentView === 'calculator' ? '#ef4444' : 'transparent',
            color: currentView === 'calculator' ? '#ffffff' : '#a1a1aa',
          }}
        >
          <span style={{ fontSize: '16px' }}>🧮</span>
          <span>Calculadora</span>
        </button>

        {/* 5. Pedidos / Ventas */}
        <button
          type="button"
          onClick={() => onNavigate('orders')}
          style={{
            ...navItemStyle,
            backgroundColor: currentView === 'orders' ? '#ef4444' : 'transparent',
            color: currentView === 'orders' ? '#ffffff' : '#a1a1aa',
          }}
        >
          <span style={{ fontSize: '16px' }}>📋</span>
          <span>Ventas / Pedidos</span>
        </button>

        {/* 6. Finanzas */}
        <button
          type="button"
          onClick={() => onNavigate('finances')}
          style={{
            ...navItemStyle,
            backgroundColor: currentView === 'finances' ? '#ef4444' : 'transparent',
            color: currentView === 'finances' ? '#ffffff' : '#a1a1aa',
          }}
        >
          <span style={{ fontSize: '16px' }}>💰</span>
          <span>Finanzas</span>
        </button>
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

const navItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.15s ease',
};

const subNavItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '13px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.15s ease',
};

export default Sidebar;
