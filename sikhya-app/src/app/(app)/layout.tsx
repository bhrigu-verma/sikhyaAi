'use client';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { CommandPalette } from '@/components/layout/command-palette';
import { useEffect, useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem('sikhya-collapsed');
    if (v === '1') setCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem('sikhya-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onCollapseChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar onMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto animate-fade-in pb-20 lg:pb-0">{children}</main>
      </div>
      <BottomNav />
      <CommandPalette />
    </div>
  );
}
