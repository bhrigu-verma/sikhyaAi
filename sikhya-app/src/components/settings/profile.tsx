'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { SectionHeader } from '@/components/ui/section-header';
import { Upload, Copy, Check, Users } from 'lucide-react';

export function ProfileSection() {
  const { data } = useSession();
  const [form, setForm] = useState({ name: '', email: '', grade: '', board: '' });
  const [saving, setSaving] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/user/me').then(r => r.json()).then(({ user }) => {
      if (user) {
        setForm({ name: user.name || '', email: user.email, grade: user.grade || 'Class 10', board: user.board || 'PSEB' });
        setAccessCode(user.id || '');
      }
    });
  }, []);

  const copyCode = async () => {
    if (!accessCode) return;
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const save = async () => {
    setSaving(true);
    await fetch('/api/user/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
  };

  return (
    <div>
      <SectionHeader title="Profile" subtitle="How others see you on Sikhya" />
      <Card padding="lg">
        <div className="flex gap-4 items-center mb-7">
          <Avatar name={form.name || data?.user?.name || '?'} size={64} />
          <div className="flex-1">
            <div className="font-head text-lg font-bold text-fg">{form.name || 'Your name'}</div>
            <div className="text-[13px] text-fg-2 mt-0.5">{form.email}</div>
          </div>
          <Button variant="outline" size="sm" icon={<Upload className="w-3.5 h-3.5" />}>Change photo</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <Input label="Full name"  value={form.name}  onChange={e => setForm(f => ({ ...f, name:  e.target.value }))} />
          <Input label="Email"       value={form.email} type="email" disabled />
          <Input label="Class"       value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} />
          <Input label="Board"       value={form.board} onChange={e => setForm(f => ({ ...f, board: e.target.value }))} />
        </div>
        <div className="flex gap-2.5 mt-5 justify-end">
          <Button variant="ghost">Reset</Button>
          <Button variant="accent" loading={saving} onClick={save}>Save changes</Button>
        </div>
      </Card>

      {/* Parent Access Code */}
      <div className="mt-7">
        <SectionHeader title="Parent Access Code" subtitle="Share this code with a parent so they can view your progress on the Parent Dashboard." />
        <Card padding="lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent grid place-items-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-[12.5px] text-fg-2 leading-relaxed">
              Your parent or guardian can enter this code at <code className="px-1.5 py-0.5 rounded bg-subtle border border-border/60 text-[11.5px] font-mono text-accent">/parent</code> to view your learning streak, subjects, and recent practice. No login required for them.
            </div>
          </div>
          <div className="flex items-stretch gap-2">
            <div className="flex-1 px-3.5 py-2.5 bg-subtle border border-border rounded-lg font-mono text-[12.5px] text-fg break-all select-all">
              {accessCode || 'Loading…'}
            </div>
            <button
              onClick={copyCode}
              disabled={!accessCode}
              className={
                'shrink-0 inline-flex items-center gap-1.5 px-3.5 rounded-lg border text-[12.5px] font-semibold transition-all ' +
                (copied
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-border bg-surface text-fg hover:border-accent/40 hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed')
              }
            >
              {copied
                ? <><Check className="w-3.5 h-3.5" /> Copied</>
                : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
