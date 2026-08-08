import { Sidebar } from './Sidebar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto bg-zinc-950">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
