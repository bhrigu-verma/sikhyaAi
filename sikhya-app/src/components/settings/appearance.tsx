'use client';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { cn } from '@/lib/utils';

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [accent, setAccent] = useState('blue');
  const accents = [
    { id: 'blue',   bg: '#2563EB' },
    { id: 'violet', bg: '#7C3AED' },
    { id: 'teal',   bg: '#0891B2' },
    { id: 'amber',  bg: '#D97706' },
    { id: 'rose',   bg: '#E11D48' },
  ];
  return (
    <div>
      <SectionHeader title="Appearance" subtitle="Customize the look and feel" />
      <Card padding="lg" className="mb-3.5">
        <div className="text-[13px] font-semibold text-fg mb-3">Theme</div>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'light',  label: 'Light',  bg: '#FAFAF9', fg: '#18181B', border: '#E7E5E2' },
            { id: 'dark',   label: 'Dark',   bg: '#0A0A0B', fg: '#FAFAFA', border: '#27272A' },
            { id: 'system', label: 'System', bg: 'linear-gradient(135deg, #FAFAF9 50%, #0A0A0B 50%)', fg: '#888', border: '#888' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                'bg-surface border-[1.5px] rounded-xl p-3 cursor-pointer text-left transition-colors',
                t.id === theme ? 'border-accent' : 'border-border',
              )}
            >
              <div className="h-[70px] rounded-lg mb-2.5 border relative overflow-hidden" style={{ background: t.bg, borderColor: t.border }}>
                <div className="absolute top-2 left-2 right-2 h-1 rounded opacity-20" style={{ background: t.fg }} />
                <div className="absolute top-[18px] left-2 w-7 h-[3px] rounded opacity-15" style={{ background: t.fg }} />
              </div>
              <div className="text-[12.5px] font-semibold text-fg">{t.label}</div>
            </button>
          ))}
        </div>
      </Card>
      <Card padding="lg">
        <div className="text-[13px] font-semibold text-fg mb-3">Accent color</div>
        <div className="flex gap-2.5">
          {accents.map(a => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              className={cn(
                'w-8 h-8 rounded-[10px] border-2 transition-all',
                accent === a.id ? 'border-fg scale-110' : 'border-transparent',
              )}
              style={{ background: a.bg }}
            />
          ))}
        </div>
        <div className="text-[11.5px] text-muted mt-2.5">
          Affects buttons, links and highlights across the app.
        </div>
      </Card>
    </div>
  );
}
