'use client';
import { useRef, useState } from 'react';
import { BookOpen, Play, Pause, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// A clickable source citation that can deep-link into the book reader.
export function Citation({ label, href }: { label: string; href?: string }) {
  const inner = (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-subtle border border-border text-[11.5px] text-fg-2 hover:border-accent/40 hover:text-fg transition-colors">
      <BookOpen className="w-3 h-3" />
      {label}
    </span>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

// Plays tutor answers aloud via /api/voice/tts (lazy fetch on first play).
export function AudioPlayer({ text, className }: { text: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  async function toggle() {
    if (state === 'playing') {
      audioRef.current?.pause();
      setState('idle');
      return;
    }
    if (urlRef.current && audioRef.current) {
      audioRef.current.play(); setState('playing'); return;
    }
    setState('loading');
    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 3500) }),
      });
      if (!res.ok) { setState('idle'); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setState('idle');
      await audio.play();
      setState('playing');
    } catch { setState('idle'); }
  }

  return (
    <button
      onClick={toggle}
      className={cn('inline-flex items-center gap-1 text-[11.5px] text-fg-2 hover:text-accent transition-colors', className)}
      aria-label="Play answer aloud"
    >
      {state === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
       state === 'playing' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      Listen
    </button>
  );
}
