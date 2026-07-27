import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import type { AppView } from './components/layout/Sidebar';
import { CostCalculator } from './components/features/calculator/CostCalculator';
import { InventoryManager } from './components/features/inventory/InventoryManager';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('inventory-filaments');

  return (
    <AppLayout currentView={currentView} onNavigate={setCurrentView}>
      {/* Vistas Renderizadas de Forma Fluida en el Contenedor Principal */}
      {currentView === 'inventory-filaments' && (
        <InventoryManager key="filaments" initialTab="filaments" />
      )}
      {currentView === 'inventory-supplies' && (
        <InventoryManager key="supplies" initialTab="supplies" />
      )}
      {currentView === 'calculator' && <CostCalculator />}

      {/* Placeholders para las siguientes vistas del mapa de rutas */}
      {currentView === 'dashboard' && (
        <PlaceholderView
          icon="🏠"
          title="Inicio / Dashboard"
          description="Métricas de ventas, gráfico MoM de 6 meses y resumen mensual en desarrollo."
        />
      )}
      {currentView === 'catalog' && (
        <PlaceholderView
          icon="🛍️"
          title="Catálogo de Productos"
          description="Gestión ligera de productos terminados en formato tabla + modal de detalle en desarrollo."
        />
      )}
      {currentView === 'orders' && (
        <PlaceholderView
          icon="📋"
          title="Ventas / Pedidos"
          description="Gestor de pedidos con matriz de estados (BUDGETED -> CONFIRMED -> PAID) en desarrollo."
        />
      )}
      {currentView === 'finances' && (
        <PlaceholderView
          icon="💰"
          title="Finanzas & Ventas"
          description="Registro contable de ingresos automáticos y gastos manuales en desarrollo."
        />
      )}
    </AppLayout>
  );
}

const PlaceholderView = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div style={{ padding: '40px', width: '100%', boxSizing: 'border-box' }}>
    <div style={{ fontSize: '40px', marginBottom: '16px' }}>{icon}</div>
    <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>
      {title}
    </h2>
    <p style={{ color: '#a1a1aa', fontSize: '15px', lineHeight: '1.6', maxWidth: '600px' }}>
      {description}
    </p>
  </div>
);

export default App;
