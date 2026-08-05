import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#09090b' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0, width: '100%', backgroundColor: '#09090b' }}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
