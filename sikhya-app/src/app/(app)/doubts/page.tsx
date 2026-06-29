'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera, Upload, Sparkles, X, Loader2, KeyRound, History, ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/tabs';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { AudioPlayer } from '@/components/feature/citation';
import { useToast } from '@/components/ui/toast';
import { PSEB_SYLLABUS } from '@/lib/syllabus';
import { cn } from '@/lib/utils';

interface SolvedDoubt {
  id: string;
  imageUrl: string;
  question: string;
  answer: string;
  subject: string;
  at: number;
}

const SUBJECT_OPTIONS = [
  { value: '', label: 'Auto-detect subject' },
  ...Array.from(new Set(PSEB_SYLLABUS.map(s => s.subject))).map(s => ({ value: s, label: s })),
];

const uid = () => Math.random().toString(36).slice(2);

export default function DoubtsPage() {
  const t = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [solving, setSolving] = useState(false);
  const [answer, setAnswer] = useState<{ question: string; answer: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);
  const [history, setHistory] = useState<SolvedDoubt[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  // Pick up an image handed over from the Tutor page's camera button.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('sikhya-doubt-image');
      if (stored) {
        setImageUrl(stored);
        sessionStorage.removeItem('sikhya-doubt-image');
      }
    } catch { /* ignore */ }
  }, []);

  const readFile = useCallback((file: File) => {
    setError(null);
    setNeedsKey(false);
    setAnswer(null);
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.onerror = () => setError('Could not read that image. Please try another.');
    reader.readAsDataURL(file);
  }, []);

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) readFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) readFile(file);
  };

  const reset = () => {
    setImageUrl(null);
    setAnswer(null);
    setError(null);
    setNeedsKey(false);
  };

  const solve = useCallback(async () => {
    if (!imageUrl || solving) return;
    setSolving(true);
    setError(null);
    setNeedsKey(false);
    setAnswer(null);
    try {
      const res = await fetch('/api/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          language: 'auto',
          ...(subject ? { subject } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 400 && data?.needsKey) {
        setNeedsKey(true);
        return;
      }
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);

      const result = { question: data.question || 'Your question', answer: data.answer || '' };
      setAnswer(result);
      setHistory(prev => [
        { id: data.id || uid(), imageUrl, question: result.question, answer: result.answer, subject: subject || 'Auto', at: Date.now() },
        ...prev,
      ].slice(0, 12));
      t.success('Solved!', 'Scroll down for the full step-by-step answer.');
    } catch (e: any) {
      setError(e?.message || 'Could not solve this doubt. Please try again.');
    } finally {
      setSolving(false);
    }
  }, [imageUrl, subject, solving, t]);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-head text-lg font-bold text-fg flex items-center gap-2">
          <Camera className="w-5 h-5 text-accent" /> Snap a doubt
        </h1>
        <p className="text-[12.5px] text-fg-2 mt-0.5">
          Take a photo of any question — handwritten or from a textbook — and get a step-by-step solution.
        </p>
      </div>

      {/* Subject selector */}
      <div className="flex items-center gap-2">
        <Select value={subject} onChange={setSubject} options={SUBJECT_OPTIONS} />
      </div>

      {/* Capture / preview */}
      <Card padding="md">
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFilePick} />
        <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={onFilePick} />

        {!imageUrl ? (
          <div
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-2xl py-12 px-6 flex flex-col items-center text-center gap-4 hover:border-accent/40 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/10 grid place-items-center text-accent">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <p className="font-head text-[15px] font-bold text-fg">Capture or upload a question</p>
              <p className="text-[13px] text-fg-2 mt-1 max-w-xs">Use your camera on mobile, or drop an image here.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant="gradient" icon={<Camera className="w-4 h-4" />} onClick={() => fileRef.current?.click()}>
                Take photo
              </Button>
              <Button variant="outline" icon={<Upload className="w-4 h-4" />} onClick={() => uploadRef.current?.click()}>
                Upload image
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Your question" className="w-full max-h-[420px] object-contain rounded-xl border border-border bg-subtle" />
              <button
                onClick={reset}
                className="absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-lg bg-bg/80 border border-border text-fg-2 hover:text-fg backdrop-blur"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="gradient"
                full
                loading={solving}
                icon={!solving ? <Sparkles className="w-4 h-4" /> : undefined}
                onClick={solve}
                disabled={solving}
              >
                {solving ? 'Solving…' : 'Solve this'}
              </Button>
              <Button variant="outline" icon={<Upload className="w-4 h-4" />} onClick={() => uploadRef.current?.click()} disabled={solving}>
                Replace
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* needsKey notice */}
      {needsKey && (
        <Card padding="md" className="border-warning/30 bg-warning/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 grid place-items-center text-warning shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-head text-[14px] font-bold text-fg">An OpenAI key is needed</p>
              <p className="text-[13px] text-fg-2 mt-1">
                Photo solving uses vision AI. Add your own OpenAI API key in Settings to unlock it.
              </p>
              <Link href="/settings" className="inline-block mt-3">
                <Button variant="soft" size="sm" icon={<KeyRound className="w-4 h-4" />}>Add a key in Settings</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* error */}
      {error && (
        <p className="text-[13px] text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* answer / loading */}
      {solving && (
        <Card padding="md">
          <div className="flex items-center gap-2 text-fg-2 text-[13px] mb-3">
            <Loader2 className="w-4 h-4 animate-spin" /> Reading your question…
          </div>
          <SkeletonText lines={6} />
        </Card>
      )}

      {answer && !solving && (
        <Card padding="md" className="animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h2 className="font-head text-[14px] font-bold text-fg">Solution</h2>
          </div>
          <div className="font-sans text-[14px] text-fg leading-relaxed whitespace-pre-wrap">{answer.answer}</div>
          <div className="mt-3 pt-3 border-t border-border">
            <AudioPlayer text={answer.answer} />
          </div>
        </Card>
      )}

      {/* Session history */}
      <div>
        <h3 className="font-head text-[13px] font-bold text-fg-2 flex items-center gap-1.5 mb-3">
          <History className="w-4 h-4" /> This session
        </h3>
        {history.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="w-5 h-5" />}
            title="No doubts solved yet"
            description="Doubts you solve in this session will appear here. History isn't saved across visits."
          />
        ) : (
          <div className="space-y-2">
            {history.map(d => (
              <Card key={d.id} padding="sm" className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.imageUrl} alt="" className="w-14 h-14 object-cover rounded-lg border border-border bg-subtle shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-fg line-clamp-1">{d.question}</p>
                  <p className="text-[12px] text-fg-2 line-clamp-2 mt-0.5">{d.answer}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
