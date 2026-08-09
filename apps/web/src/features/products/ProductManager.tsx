import { useState } from 'react';
import type { Product, Filament, Supply } from '../../../types/domain';
import { ProductTable } from './ProductTable';
import { LowStockProductBanner } from './LowStockProductBanner';
import { ProductModal } from './modals/ProductModal';

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Cartel LED Neón Batman 40x30',
    description: 'Cartel acrílico con silueta Batman e iluminación neón LED flex amarillo.',
    category_id: 'Carteles Neón',
    stock_quantity: 4,
    min_stock_alert: 2,
    unit_cost: 8500,
    sale_price: 25500,
    tags: ['neon', 'batman', 'led', 'dc'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Lámpara Minecraft Bloque LED',
    description: 'Lámpara velador impresa en PLA transparente con luz LED intercambiable.',
    category_id: 'Lámparas 3D',
    stock_quantity: 1, // Stock Bajo (<= 3)
    min_stock_alert: 3,
    unit_cost: 3200,
    sale_price: 9800,
    tags: ['minecraft', 'lampara', '3d', 'gaming'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Mate 3D Escudo AFA 3 Estrellas',
    description: 'Mate polímero térmico impreso en PLA con polímero apto consumo.',
    category_id: 'Mates & Accesorios',
    stock_quantity: 12,
    min_stock_alert: 5,
    unit_cost: 1400,
    sale_price: 4500,
    tags: ['mate', 'afa', 'argentina', '3d'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Insumos y filamentos del inventario de muestra
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
  {
    id: 'fil-2',
    brand: 'PrintaLot',
    type: 'PETG',
    color: 'Transparente',
    cost_per_gram: 24,
    stock_grams: 150,
    min_stock_alert: 200,
    created_at: new Date().toISOString(),
  },
];

const mockSupplies: Supply[] = [
  {
    id: 'sup-1',
    name: 'Fuente de Alimentación 12V 5A',
    unit_cost: 4500,
    stock_quantity: 3,
    unit_of_measure: 'unit',
    min_stock_alert: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sup-2',
    name: 'Neón Flex Amarillo 12V (metro)',
    unit_cost: 1200,
    stock_quantity: 15,
    unit_of_measure: 'unit',
    min_stock_alert: 5,
    created_at: new Date().toISOString(),
  },
];

export const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = ['Todos', 'Carteles Neón', 'Lámparas 3D', 'Mates & Accesorios', 'General'];

  // Handlers CRUD
  const handleSaveProduct = (savedItem: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedItem.id);
      if (exists) {
        return prev.map((p) => (p.id === savedItem.id ? savedItem : p));
      }
      return [savedItem, ...prev];
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto del catálogo?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAdjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newQty = Math.max(0, p.stock_quantity + delta);
        return { ...p, stock_quantity: newQty };
      })
    );
  };

  // Filtrado ultra-rápido por texto y categoría
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Todos' || p.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter((p) => p.stock_quantity <= p.min_stock_alert).length;

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
            🛍️ Catálogo de Productos
          </h1>
          <p style={{ color: '#a1a1aa', margin: 0, fontSize: '15px' }}>
            Gestión eficiente de productos terminados en estantería y precios de venta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
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
          + Nuevo Producto
        </button>
      </div>

      {/* Banner de Stock Crítico en Estantería */}
      <LowStockProductBanner lowStockCount={lowStockCount} />

      {/* Barra de Controles: Filtro de Categorías y Buscador */}
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
        {/* Selector de Categorías (Dropdown Select) */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'Todos' ? 'Todas las Categorías' : cat}
            </option>
          ))}
        </select>

        {/* Buscador Rápido por Nombre o Tag */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre o tag..."
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

      {/* Tabla de Productos */}
      <ProductTable
        products={filteredProducts}
        onEdit={(p) => {
          setEditingProduct(p);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteProduct}
        onAdjustStock={handleAdjustStock}
      />

      {/* Modal de Detalle / Edición / Alta */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        availableFilaments={mockFilaments}
        availableSupplies={mockSupplies}
      />
    </div>
  );
};

export default ProductManager;
