import { useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import { NavItem } from './NavItem';

import {
  LayoutDashboard,
  Calculator,
  Wallet,
  ShoppingBag,
  Package,
  ChevronDown,
  ChevronRight,
  Layers,
  Box,
  Tags,
  Bell,
  Settings,
  HelpCircle,
  Zap,
} from 'lucide-react';

export const Sidebar = () => {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const location = useLocation();
  const isInventoryActive = location.pathname.startsWith('/inventory');

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800/80 flex flex-col sticky top-0 select-none text-zinc-100">
      {/* Header / Brand */}
      <div className="p-5 flex items-center gap-3 border-b border-zinc-800/60">
        <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
          <Zap className="w-5 h-5 fill-purple-400/20" />
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-base font-bold tracking-tight text-white truncate">
            Neon Nova
          </h1>
          <span className="text-xs text-zinc-400 truncate">Taller de Impresiones</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <NavItem
          to="/"
          icon={LayoutDashboard}
          label="Inicio"
          exact={true} />

        <NavItem
          to="/calculator"
          icon={Calculator}
          label="Calculadora" />

        <NavItem
          to="/orders"
          icon={ShoppingBag}
          label="Pedidos" />

        <NavItem
          to="/finances"
          icon={Wallet}
          label="Finanzas" />

        {/* Collapsible Section: Inventario */}
        <div>
          <button
            type="button"
            onClick={() => setIsInventoryOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 ${isInventoryActive
              ? 'text-white font-medium'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Inventario</span>
            </div>
            {isInventoryOpen || isInventoryActive
              ? (<ChevronDown className="w-4 h-4 text-zinc-500" />)
              : (<ChevronRight className="w-4 h-4 text-zinc-500" />)
            }
          </button>

          {(isInventoryOpen || isInventoryActive) && (
            <div className="ml-4 pl-3 mt-1 space-y-1 border-l border-zinc-800">
              <NavItem
                to="/inventory/filaments"
                icon={Layers}
                label="Filamentos" />

              <NavItem
                to="/inventory/supplies"
                icon={Box}
                label="Insumos" />

              <NavItem
                to="/inventory/products"
                icon={Tags}
                label="Productos" />
            </div>
          )}
        </div>

        {/* Secondary Links Separator */}
        <div className="pt-4 pb-1">
          <div className="h-px bg-zinc-800/80 mx-2" />
        </div>

        <NavItem
          to="/notifications"
          icon={Bell}
          label="Notificaciones" />

        <NavItem
          to="/settings"
          icon={Settings}
          label="Configuración" />

        <NavItem
          to="/support"
          icon={HelpCircle}
          label="Soporte" />
      </nav>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-zinc-800/60">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900/80 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-xs text-purple-300 shrink-0">
            OP
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-white truncate">
              Operador Taller
            </span>
            <span className="text-[11px] text-zinc-400 truncate">Admin Mode</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
