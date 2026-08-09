import { useState } from 'react';
import type { Filament, Supply } from '../../../types/domain';
import { FilamentTable } from './FilamentTable';
import { SupplyTable } from './SupplyTable';
import { LowStockAlertBanner } from './LowStockAlertBanner';
import { FilamentModal } from './modals/FilamentModal';
import { SupplyModal } from './modals/SupplyModal';

// Datos Mock Iniciales para desarrollo y pruebas
const initialFilaments: Filament[] = [
  {
    id: 'fil-1',
    brand: 'Grilon3',
    type: 'PLA',
    color: 'Negro',
    cost_per_gram: 18,
    stock_grams: 850,
    min_stock_alert: 200,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fil-2',
    brand: 'PrintaLot',
    type: 'PETG',
    color: 'Transparente',
    cost_per_gram: 24,
    stock_grams: 150, // Stock Bajo (<= 200g)
    min_stock_alert: 200,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fil-3',
    brand: 'eSUN',
    type: 'PLA',
    color: 'Rojo Neón',
    cost_per_gram: 20,
    stock_grams: 1000,
    min_stock_alert: 250,
    created_at: new Date().toISOString(),
  },
];

const initialSupplies: Supply[] = [
  {
    id: 'sup-1',
    name: 'Fuente de Alimentación 12V 5A',
    unit_cost: 4500,
    stock_quantity: 3, // Stock Bajo (<= 5)
    unit_of_measure: 'unit',
    min_stock_alert: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sup-2',
    name: 'Imán Neodimio 5x2mm',
    unit_cost: 150,
    stock_quantity: 48,
    unit_of_measure: 'unit',
    min_stock_alert: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sup-3',
    name: 'Cianoacrilato 20g',
    unit_cost: 1800,
    stock_quantity: 2, // Stock Bajo (<= 5)
    unit_of_measure: 'unit',
    min_stock_alert: 5,
    created_at: new Date().toISOString(),
  },
];

interface InventoryManagerProps {
  initialTab?: 'filaments' | 'supplies';
}

export const InventoryManager = ({ initialTab = 'filaments' }: InventoryManagerProps) => {
  const [activeTab] = useState<'filaments' | 'supplies'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  const [filaments, setFilaments] = useState<Filament[]>(initialFilaments);
  const [supplies, setSupplies] = useState<Supply[]>(initialSupplies);

  // Estados de Modales
  const [isFilamentModalOpen, setIsFilamentModalOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null);

  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);

  // --- Handlers Filamentos ---
  const handleSaveFilament = (savedItem: Filament) => {
    setFilaments((prev) => {
      const exists = prev.some((f) => f.id === savedItem.id);
      if (exists) {
        return prev.map((f) => (f.id === savedItem.id ? savedItem : f));
      }
      return [savedItem, ...prev];
    });
  };

  const handleDeleteFilament = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta bobina de filamento?')) {
      setFilaments((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleAdjustFilamentStock = (id: string, deltaGrams: number) => {
    setFilaments((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const newStock = Math.max(0, f.stock_grams + deltaGrams);
        return { ...f, stock_grams: newStock };
      })
    );
  };

  // --- Handlers Insumos ---
  const handleSaveSupply = (savedItem: Supply) => {
    setSupplies((prev) => {
      const exists = prev.some((s) => s.id === savedItem.id);
      if (exists) {
        return prev.map((s) => (s.id === savedItem.id ? savedItem : s));
      }
      return [savedItem, ...prev];
    });
  };

  const handleDeleteSupply = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este insumo?')) {
      setSupplies((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleAdjustSupplyStock = (id: string, deltaQty: number) => {
    setSupplies((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newStock = Math.max(0, s.stock_quantity + deltaQty);
        return { ...s, stock_quantity: newStock };
      })
    );
  };

  // Filtrado por buscador
  const filteredFilaments = filaments.filter((f) =>
    `${f.brand} ${f.type} ${f.color}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSupplies = supplies.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Conteo de Alertas basado en min_stock_alert propio de cada ítem
  const lowStockFilamentsCount = filaments.filter((f) => f.stock_grams <= f.min_stock_alert).length;
  const lowStockSuppliesCount = supplies.filter((s) => s.stock_quantity <= s.min_stock_alert).length;

  return (
    <div
      style={{
        width: '100%',
        padding: '32px 40px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#f4f4f5',
      }}
    >
      {/* Header Principal */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px 0', color: '#ffffff' }}>
            📦 Inventario & Stock
          </h1>
          <p style={{ color: '#a1a1aa', margin: 0, fontSize: '15px' }}>
            Control de materia prima: bobinas de filamento e insumos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (activeTab === 'filaments') {
              setEditingFilament(null);
              setIsFilamentModalOpen(true);
            } else {
              setEditingSupply(null);
              setIsSupplyModalOpen(true);
            }
          }}
          style={{
            backgroundColor: '#a855f7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
          }}
        >
          {activeTab === 'filaments' ? '+ Nuevo Filamento' : '+ Nuevo Insumo'}
        </button>
      </div>

      {/* Banner de Stock Crítico */}
      <LowStockAlertBanner
        lowStockFilamentsCount={lowStockFilamentsCount}
        lowStockSuppliesCount={lowStockSuppliesCount}
      />

      {/* Barra de Controles: Buscador */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Buscador Rápido */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder={
              activeTab === 'filaments'
                ? 'Buscar por marca, tipo o color...'
                : 'Buscar insumo por nombre...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Renderizado de la Tabla Activa */}
      {activeTab === 'filaments' ? (
        <FilamentTable
          filaments={filteredFilaments}
          onEdit={(f) => {
            setEditingFilament(f);
            setIsFilamentModalOpen(true);
          }}
          onDelete={handleDeleteFilament}
          onAdjustStock={handleAdjustFilamentStock}
        />
      ) : (
        <SupplyTable
          supplies={filteredSupplies}
          onEdit={(s) => {
            setEditingSupply(s);
            setIsSupplyModalOpen(true);
          }}
          onDelete={handleDeleteSupply}
          onAdjustStock={handleAdjustSupplyStock}
        />
      )}

      {/* Modales */}
      <FilamentModal
        isOpen={isFilamentModalOpen}
        onClose={() => {
          setIsFilamentModalOpen(false);
          setEditingFilament(null);
        }}
        onSave={handleSaveFilament}
        editingFilament={editingFilament}
      />

      <SupplyModal
        isOpen={isSupplyModalOpen}
        onClose={() => {
          setIsSupplyModalOpen(false);
          setEditingSupply(null);
        }}
        onSave={handleSaveSupply}
        editingSupply={editingSupply}
      />
    </div>
  );
};

export default InventoryManager;
