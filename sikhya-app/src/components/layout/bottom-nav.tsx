'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Home, BookOpen, Sparkles, PencilLine, User, Camera, Timer, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet } from '@/components/ui/sheet';

const TABS = [
  { href: '/dashboard', label: 'Home',     icon: Home },
  { href: '/learn',     label: 'Learn',    icon: BookOpen },
  { href: '/tutor',     label: 'Ask',      icon: Sparkles, center: true },
  { href: '/practice',  label: 'Practice', icon: PencilLine },
  { href: '/profile',   label: 'Me',       icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-border pb-safe">
        <div className="grid grid-cols-5 h-14">
          {TABS.map(t => {
            const active = pathname === t.href || pathname.startsWith(t.href + '/');
            const Ic = t.icon;
            if (t.center) {
              return (
                <Link key={t.href} href={t.href} className="relative grid place-items-center">
                  <span className="absolute -top-5 w-12 h-12 rounded-2xl gradient-bg grid place-items-center shadow-glow">
                    <Ic className="w-5 h-5 text-white" />
                  </span>
                  <span className="text-[9.5px] font-semibold text-fg-2 mt-7">{t.label}</span>
                </Link>
              );
            }
            return (
              <Link key={t.href} href={t.href}
                className={cn('flex flex-col items-center justify-center gap-0.5', active ? 'text-accent' : 'text-muted')}>
                <Ic className="w-[19px] h-[19px]" strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[9.5px] font-semibold">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating quick-action button */}
      <button
        onClick={() => setQuickOpen(true)}
        className="lg:hidden fixed right-4 bottom-20 z-40 w-12 h-12 rounded-full bg-fg text-bg grid place-items-center shadow-soft-3"
        aria-label="Quick actions"
      >
        <Plus className="w-5 h-5" />
      </button>

      <Sheet open={quickOpen} onClose={() => setQuickOpen(false)} side="bottom" title="Quick actions">
        <div className="p-4 grid grid-cols-3 gap-3 pb-8">
          <QuickAction icon={<Camera className="w-5 h-5" />} label="Snap a doubt" onClick={() => { setQuickOpen(false); router.push('/doubts'); }} />
          <QuickAction icon={<Sparkles className="w-5 h-5" />} label="Ask AI" onClick={() => { setQuickOpen(false); router.push('/tutor'); }} />
          <QuickAction icon={<Timer className="w-5 h-5" />} label="Mock test" onClick={() => { setQuickOpen(false); router.push('/mock-test'); }} />
        </div>
      </Sheet>
    </>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface hover:border-accent/40 transition-colors">
      <span className="w-11 h-11 rounded-xl bg-accent/10 text-accent grid place-items-center">{icon}</span>
      <span className="text-[11.5px] font-semibold text-fg-2 text-center">{label}</span>
    </button>
  );
}
