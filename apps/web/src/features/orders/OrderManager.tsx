import { useState } from 'react';
import type { Order, OrderStatus, Product, Filament, Supply } from '../../../types/domain';
import { OrderTable } from './OrderTable';
import { OrderModal } from './modals/OrderModal';

const initialOrders: Order[] = [
  {
    id: 'ord-1',
    customer_name: 'Carlos Giménez',
    customer_phone: '11 4589 1234',
    customer_notes: 'Seña del 50% recibida por transferencia bancaria.',
    status: 'CONFIRMED',
    total_cost: 15000,
    total_price: 45000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: 'oi-1',
        order_id: 'ord-1',
        product_id: 'prod-1',
        item_name: 'Cartel LED Neón Batman 40x30',
        quantity: 1,
        unit_cost: 8500,
        unit_sale_price: 25500,
      },
      {
        id: 'oi-2',
        order_id: 'ord-1',
        item_name: 'Soporte de Pared Custom para Cartel',
        quantity: 2,
        unit_cost: 3250,
        unit_sale_price: 9750,
      },
    ],
  },
  {
    id: 'ord-2',
    customer_name: 'Estudio Creativo Alpha',
    customer_phone: '11 9876 5432',
    customer_notes: 'Presupuesto enviado por WhatsApp. Esperando aprobación de diseño.',
    status: 'BUDGETED',
    total_cost: 38000,
    total_price: 120000,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    items: [
      {
        id: 'oi-3',
        order_id: 'ord-2',
        item_name: 'Isologo 3D Neón RGB 80x50',
        quantity: 1,
        unit_cost: 38000,
        unit_sale_price: 120000,
      },
    ],
  },
  {
    id: 'ord-3',
    customer_name: 'María Fernández',
    customer_phone: '11 2233 4455',
    customer_notes: 'Pagado en efectivo al retirar en taller.',
    status: 'PAID',
    total_cost: 3200,
    total_price: 9800,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    items: [
      {
        id: 'oi-4',
        order_id: 'ord-3',
        product_id: 'prod-2',
        item_name: 'Lámpara Minecraft Bloque LED',
        quantity: 1,
        unit_cost: 3200,
        unit_sale_price: 9800,
      },
    ],
  },
];

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Cartel LED Neón Batman 40x30',
    description: '',
    category_id: 'Carteles Neón',
    stock_quantity: 4,
    min_stock_alert: 2,
    unit_cost: 8500,
    sale_price: 25500,
    tags: ['neon'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Lámpara Minecraft Bloque LED',
    description: '',
    category_id: 'Lámparas 3D',
    stock_quantity: 1,
    min_stock_alert: 3,
    unit_cost: 3200,
    sale_price: 9800,
    tags: ['minecraft'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockFilaments: Filament[] = [
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
];

const mockSupplies: Supply[] = [
  {
    id: 'sup-1',
    name: 'Fuente 12V 5A',
    unit_cost: 4500,
    stock_quantity: 5,
    unit_of_measure: 'unit',
    min_stock_alert: 2,
    created_at: new Date().toISOString(),
  },
];

export const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Handlers CRUD
  const handleSaveOrder = (savedItem: Order) => {
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === savedItem.id);
      if (exists) {
        return prev.map((o) => (o.id === savedItem.id ? savedItem : o));
      }
      return [savedItem, ...prev];
    });
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta venta / presupuesto?')) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const handleChangeStatus = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o))
    );
  };

  // Filtrado por buscador y estado
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customer_phone && o.customer_phone.includes(searchTerm)) ||
      o.items.some((i) => i.item_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'Todos' || o.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // KPIs de Ventas y Presupuestos
  const totalSalesAmount = orders
    .filter((o) => o.status === 'PAID' || o.status === 'CONFIRMED')
    .reduce((acc, o) => acc + o.total_price, 0);

  const activeOrdersCount = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PENDING').length;
  const budgetedCount = orders.filter((o) => o.status === 'BUDGETED').length;

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
            📋 Ventas / Pedidos & Presupuestos
          </h1>
          <p style={{ color: '#a1a1aa', margin: 0, fontSize: '15px' }}>
            Gestión comercial, cotización de nuevas piezas a medida y matriz de estados.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingOrder(null);
            setIsModalOpen(true);
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
          + Nuevo Pedido / Cotización
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={kpiCardStyle}>
          <span style={kpiLabelStyle}>Total Ventas (Confirmadas/Pagadas)</span>
          <strong style={{ fontSize: '24px', fontWeight: 900, color: '#4ade80' }}>
            ${totalSalesAmount.toLocaleString('es-AR')}
          </strong>
        </div>

        <div style={kpiCardStyle}>
          <span style={kpiLabelStyle}>Pedidos en Producción / Activos</span>
          <strong style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>
            {activeOrdersCount} pedido(s)
          </strong>
        </div>

        <div style={kpiCardStyle}>
          <span style={kpiLabelStyle}>Presupuestos Pendientes</span>
          <strong style={{ fontSize: '24px', fontWeight: 900, color: '#60a5fa' }}>
            {budgetedCount} cotización(es)
          </strong>
        </div>
      </div>

      {/* Barra de Controles: Filtro de Estado y Buscador */}
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
        {/* Selector de Estado */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            color: '#ffffff',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="Todos">Todos los Estados</option>
          <option value="BUDGETED">Presupuestado</option>
          <option value="PENDING">Pendiente</option>
          <option value="CONFIRMED">Confirmado</option>
          <option value="PAID">Pagado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>

        {/* Buscador Rápido por Nombre o Ítem */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Buscar cliente, teléfono o ítem..."
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

      {/* Tabla de Pedidos */}
      <OrderTable
        orders={filteredOrders}
        onEdit={(ord) => {
          setEditingOrder(ord);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteOrder}
        onChangeStatus={handleChangeStatus}
      />

      {/* Modal de Alta / Edición de Pedido */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
        }}
        onSave={handleSaveOrder}
        editingOrder={editingOrder}
        availableProducts={mockProducts}
        availableFilaments={mockFilaments}
        availableSupplies={mockSupplies}
      />
    </div>
  );
};

const kpiCardStyle: React.CSSProperties = {
  backgroundColor: '#18181b',
  borderRadius: '12px',
  padding: '16px 20px',
  border: '1px solid #27272a',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const kpiLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#a1a1aa',
  fontWeight: 600,
};

export default OrderManager;
