import { FlaskConical, Sigma, Globe2, Languages, BookText, Atom, Leaf, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

// Per-subject color + icon for instant visual scanning across the app.
const MAP: Record<string, { color: string; bg: string; icon: any }> = {
  science:        { color: '#0d9488', bg: 'rgba(13,148,136,.12)',  icon: FlaskConical },
  mathematics:    { color: '#6366f1', bg: 'rgba(99,102,241,.12)',  icon: Sigma },
  maths:          { color: '#6366f1', bg: 'rgba(99,102,241,.12)',  icon: Sigma },
  'social science': { color: '#d97706', bg: 'rgba(217,119,6,.12)', icon: Landmark },
  sst:            { color: '#d97706', bg: 'rgba(217,119,6,.12)',   icon: Globe2 },
  english:        { color: '#e11d48', bg: 'rgba(225,29,72,.12)',   icon: BookText },
  punjabi:        { color: '#7c3aed', bg: 'rgba(124,58,237,.12)',  icon: Languages },
  hindi:          { color: '#0891b2', bg: 'rgba(8,145,178,.12)',   icon: Languages },
  physics:        { color: '#2563eb', bg: 'rgba(37,99,235,.12)',   icon: Atom },
  biology:        { color: '#16a34a', bg: 'rgba(22,163,74,.12)',   icon: Leaf },
};

export function subjectStyle(subject?: string | null) {
  const key = (subject ?? '').toLowerCase().trim();
  return MAP[key] ?? { color: 'rgb(var(--accent))', bg: 'rgb(var(--accent) / .12)', icon: BookText };
}

export function SubjectIcon({ subject, size = 36, className }: { subject?: string | null; size?: number; className?: string }) {
  const s = subjectStyle(subject);
  const Ic = s.icon;
  return (
    <div className={cn('grid place-items-center rounded-xl shrink-0', className)}
      style={{ width: size, height: size, background: s.bg, color: s.color }}>
      <Ic style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2} />
    </div>
  );
}
