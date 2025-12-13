import { ReactNode } from 'react';
import { Sidebar, MobileNav } from './Navigation';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      <main className="pb-20 lg:ml-[72px] lg:pb-0 xl:ml-[244px]">
        <div className="mx-auto max-w-[630px] px-4 py-4 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
