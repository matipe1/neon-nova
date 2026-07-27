import type { ReactNode } from 'react';
import { Sidebar, type AppView } from './Sidebar';

interface AppLayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  children: ReactNode;
}

export const AppLayout = ({ currentView, onNavigate, children }: AppLayoutProps) => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#09090b',
        color: '#ffffff',
        boxSizing: 'border-box',
      }}
    >
      {/* Sidebar Fijo a la Izquierda */}
      <Sidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Área Principal de Contenido Fluido a Pantalla Completa */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          minWidth: 0,
          width: '100%',
          backgroundColor: '#09090b',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
