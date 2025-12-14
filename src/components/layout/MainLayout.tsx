import { ReactNode } from 'react';
import { TopNav, MobileNav } from './Navigation';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <MobileNav />
      <main className="pb-20 pt-16 md:pb-0">
        <div className="mx-auto max-w-[630px] px-4 py-4 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
