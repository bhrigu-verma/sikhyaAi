'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { Toggle } from '@/components/ui/toggle';

export function PreferencesSection() {
  const [s, setS] = useState({ notif: true, sounds: false, reduce: false, autoSave: true });
  const Item = ({ k, title, sub }: { k: keyof typeof s; title: string; sub: string }) => (
    <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
      <div className="flex-1">
        <div className="text-[13.5px] font-semibold text-fg">{title}</div>
        <div className="text-xs text-muted mt-0.5">{sub}</div>
      </div>
      <Toggle checked={s[k]} onChange={(v) => setS(p => ({ ...p, [k]: v }))} />
    </div>
  );
  return (
    <div>
      <SectionHeader title="Preferences" subtitle="Customize your experience" />
      <Card padding="md" className="px-5">
        <Item k="notif"    title="Push notifications" sub="Streak reminders, AI replies, new content" />
        <Item k="sounds"   title="Sound effects"      sub="Subtle clicks and confirmations" />
        <Item k="reduce"   title="Reduce motion"      sub="Minimize animations and transitions" />
        <Item k="autoSave" title="Auto-save chats"    sub="Save AI tutor conversations" />
      </Card>
    </div>
  );
}
