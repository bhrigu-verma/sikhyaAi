'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Sparkles, BookOpen, PencilLine, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut, Library, Timer, Camera,
  Repeat, CalendarCheck, FileText, User,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Avatar } from '@/components/ui/avatar';
import { StreakFlame } from '@/components/feature/gamification';
import { useGamification } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const GROUPS: { title: string; items: { href: string; label: string; icon: any }[] }[] = [
  { title: 'Learn', items: [
    { href: '/dashboard', label: 'Home',      icon: Home },
    { href: '/tutor',     label: 'AI Tutor',  icon: Sparkles },
    { href: '/doubts',    label: 'Doubts',    icon: Camera },
    { href: '/learn',     label: 'Lessons',   icon: BookOpen },
    { href: '/books',     label: 'Books',     icon: Library },
  ]},
  { title: 'Practice', items: [
    { href: '/practice',  label: 'Practice',  icon: PencilLine },
    { href: '/mock-test', label: 'Mock Tests',icon: Timer },
    { href: '/revise',    label: 'Revise',    icon: Repeat },
    { href: '/pyq',       label: 'PYQ Bank',  icon: FileText },
  ]},
  { title: 'Me', items: [
    { href: '/profile',    label: 'Profile',    icon: User },
    { href: '/progress',   label: 'Progress',   icon: BarChart3 },
    { href: '/study-plan', label: 'Study Plan', icon: CalendarCheck },
    { href: '/settings',   label: 'Settings',   icon: Settings },
  ]},
];

export function Sidebar({
  collapsed, onCollapseChange, mobileOpen, onMobileClose,
}: {
  collapsed: boolean;
  onCollapseChange: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const { data: game } = useGamification();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <aside className={cn(
        'hidden lg:flex flex-col bg-surface border-r border-border h-screen overflow-hidden',
        'transition-[width] duration-200 ease-out',
        'fixed lg:static top-0 left-0 z-50',
        mobileOpen ? 'translate-x-0 flex' : '-translate-x-full lg:translate-x-0',
        collapsed ? 'w-[68px]' : 'w-[230px]',
      )}>
        {/* Logo + collapse */}
        <div className={cn('flex items-center justify-between border-b border-border min-h-[60px]', collapsed ? 'px-3' : 'px-4')}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-bg grid place-items-center shadow-glow shrink-0">
              <span className="text-white font-bold text-[17px] leading-none select-none font-indic">ਸ</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-none">
                <span className="font-head text-[14.5px] font-bold text-fg tracking-tight">Sikhya</span>
                <span className="text-[9.5px] text-muted font-medium tracking-widest uppercase font-indic">ਸਿੱਖਿਆ</span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button onClick={() => onCollapseChange(true)} className="w-6 h-6 grid place-items-center text-muted hover:text-fg rounded" title="Collapse">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Streak / XP chip */}
        {!collapsed && game && (
          <Link href="/profile" className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-subtle border border-border hover:border-accent/30 transition-colors">
            <StreakFlame days={game.streak} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="h-1.5 rounded-full bg-border overflow-hidden">
                <div className="h-full gradient-bg rounded-full" style={{ width: `${game.xpForLevel ? Math.min(100, (game.xpIntoLevel / game.xpForLevel) * 100) : 0}%` }} />
              </div>
            </div>
            <span className="text-[11px] font-bold text-fg">L{game.level}</span>
          </Link>
        )}

        {/* Nav */}
        <nav className={cn('flex-1 overflow-y-auto', collapsed ? 'px-2.5 py-3' : 'p-3')}>
          {GROUPS.map(group => (
            <div key={group.title} className="mb-2">
              {!collapsed && (
                <div className="text-[10.5px] font-semibold text-muted uppercase tracking-wider px-3 pt-2 pb-1.5">{group.title}</div>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map(item => (
                  <NavLink key={item.href} item={item} active={pathname === item.href} collapsed={collapsed} onNav={onMobileClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {collapsed && (
          <div className="px-2.5 pb-2">
            <button onClick={() => onCollapseChange(false)} className="w-full py-2 grid place-items-center text-muted hover:text-fg rounded-lg" title="Expand">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* User block */}
        <div className={cn('flex items-center gap-2.5 border-t border-border', collapsed ? 'p-2.5' : 'p-3')}>
          <Avatar name={mounted ? (user?.name || 'Y') : 'Y'} size={collapsed ? 32 : 34} />
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-fg truncate">{mounted ? (user?.name || 'You') : '…'}</div>
                <div className="text-[11px] text-muted truncate">{user?.email || ''}</div>
              </div>
              <button onClick={() => signOut({ callbackUrl: '/signin' })} className="w-7 h-7 grid place-items-center text-muted hover:text-danger rounded" title="Sign out">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* mobile drawer (full sidebar) */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onMobileClose} />
          <aside className="fixed top-0 left-0 z-50 h-screen w-[260px] bg-surface border-r border-border flex flex-col lg:hidden animate-fade-in">
            <div className="flex items-center gap-2.5 px-4 min-h-[60px] border-b border-border">
              <div className="w-8 h-8 rounded-xl gradient-bg grid place-items-center"><span className="text-white font-bold font-indic">ਸ</span></div>
              <span className="font-head text-[14.5px] font-bold text-fg">Sikhya</span>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              {GROUPS.map(group => (
                <div key={group.title} className="mb-2">
                  <div className="text-[10.5px] font-semibold text-muted uppercase tracking-wider px-3 pt-2 pb-1.5">{group.title}</div>
                  {group.items.map(item => (
                    <NavLink key={item.href} item={item} active={pathname === item.href} collapsed={false} onNav={onMobileClose} />
                  ))}
                </div>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}

function NavLink({ item, active, collapsed, onNav }: {
  item: { href: string; label: string; icon: any }; active: boolean; collapsed: boolean; onNav: () => void;
}) {
  const Ic = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNav}
      className={cn(
        'relative flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13.5px] transition-colors duration-150',
        active ? 'bg-surface-2 text-fg font-semibold border border-border' : 'text-fg-2 hover:bg-subtle hover:text-fg border border-transparent',
        collapsed && 'justify-center px-2.5',
      )}
      title={collapsed ? item.label : undefined}
    >
      {active && !collapsed && <span className="absolute -left-3 top-2 bottom-2 w-[3px] bg-accent rounded-full" />}
      <Ic className="w-[17px] h-[17px] shrink-0" strokeWidth={active ? 2 : 1.75} />
      {!collapsed && <span className="flex-1">{item.label}</span>}
    </Link>
  );
}
