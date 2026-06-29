'use client';
import { useState } from 'react';
import {
  RotateCcw, Sparkles, AlertTriangle, RefreshCw, CalendarClock, CheckCircle2, Layers,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/ring';
import { SubjectIcon } from '@/components/feature/subject-icon';
import { useToast } from '@/components/ui/toast';
import { useReviews, ReviewCard } from '@/lib/hooks';
import { cn } from '@/lib/utils';

const RATINGS: { label: string; quality: number; variant: 'danger' | 'outline' | 'soft' | 'accent'; hint: string }[] = [
  { label: 'Again', quality: 0, variant: 'danger', hint: 'Forgot' },
  { label: 'Hard', quality: 3, variant: 'outline', hint: 'Tough' },
  { label: 'Good', quality: 4, variant: 'soft', hint: 'Recalled' },
  { label: 'Easy', quality: 5, variant: 'accent', hint: 'Instant' },
];

export default function RevisePage() {
  const t = useToast();
  const { data, error, isLoading, mutate } = useReviews();

  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [grading, setGrading] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const due = data?.due ?? [];
  const total = due.length;
  const card = due[pos];
  const sessionDone = !!data && total > 0 && pos >= total;

  async function rate(quality: number) {
    if (!card || grading) return;
    setGrading(true);
    try {
      const res = await fetch(`/api/review/${card.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quality }),
      });
      if (!res.ok) throw new Error('Failed to save rating');
      t.xp(quality >= 4 ? 5 : 2);
      setReviewedCount(n => n + 1);
      setFlipped(false);
      setPos(p => p + 1);
    } catch {
      t.error('Could not save', 'Please try again.');
    } finally {
      setGrading(false);
    }
  }

  // ── loading ──
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  // ── error ──
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <Card>
          <EmptyState
            icon={<AlertTriangle className="w-6 h-6" />}
            title="Couldn't load your deck"
            description="Something went wrong fetching your revision cards. Please try again."
            action={<Button variant="outline" icon={<RefreshCw className="w-4 h-4" />} onClick={() => mutate()}>Retry</Button>}
          />
        </Card>
      </div>
    );
  }

  // ── nothing due ──
  if (data && total === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <Header upcoming={data.upcomingCount} reviewed={reviewedCount} done={0} total={0} />
        <Card className="mt-6">
          <EmptyState
            icon={<Layers className="w-6 h-6" />}
            title="Nothing due right now"
            description={data.upcomingCount > 0
              ? `You're all caught up. ${data.upcomingCount} card${data.upcomingCount === 1 ? '' : 's'} coming up soon.`
              : 'Add cards from Practice or the tutor to start a revision deck.'}
            action={<Button variant="outline" icon={<RefreshCw className="w-4 h-4" />} onClick={() => mutate()}>Refresh</Button>}
          />
        </Card>
      </div>
    );
  }

  // ── session complete ──
  if (sessionDone) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <Header upcoming={data!.upcomingCount} reviewed={reviewedCount} done={total} total={total} />
        <Card className="mt-6" glow>
          <EmptyState
            icon={<Sparkles className="w-6 h-6 text-accent" />}
            title="Deck cleared! 🎉"
            description={`You reviewed ${reviewedCount} card${reviewedCount === 1 ? '' : 's'}. ${
              data!.upcomingCount > 0
                ? `${data!.upcomingCount} more will be due soon — come back later.`
                : 'Nothing else is scheduled right now.'
            }`}
            action={
              <Button
                variant="gradient"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={() => { setPos(0); setReviewedCount(0); setFlipped(false); mutate(); }}
              >
                Reload deck
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  // ── flashcard ──
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <Header upcoming={data!.upcomingCount} reviewed={reviewedCount} done={pos} total={total} />

      <FlashCard card={card} flipped={flipped} onFlip={() => setFlipped(f => !f)} />

      {!flipped ? (
        <Button variant="gradient" size="lg" full icon={<RotateCcw className="w-4 h-4" />} onClick={() => setFlipped(true)}>
          Show answer
        </Button>
      ) : (
        <div className="space-y-2">
          <p className="text-center text-[12px] text-muted">How well did you recall this?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RATINGS.map(r => (
              <Button
                key={r.quality}
                variant={r.variant}
                full
                disabled={grading}
                onClick={() => rate(r.quality)}
                className="flex-col h-auto py-2.5"
              >
                <span>{r.label}</span>
                <span className="text-[10px] font-normal opacity-70">{r.hint}</span>
              </Button>
            ))}
          </div>
          {grading && <div className="flex justify-center pt-1"><Spinner /></div>}
        </div>
      )}
    </div>
  );
}

function Header({ upcoming, reviewed, done, total }: { upcoming: number; reviewed: number; done: number; total: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-head text-2xl font-bold text-fg">Revise</h1>
          <p className="text-[13px] text-fg-2 mt-1">Spaced repetition — review just before you forget.</p>
        </div>
        {upcoming > 0 && (
          <Badge variant="neutral" className="shrink-0">
            <CalendarClock className="w-3 h-3" /> {upcoming} upcoming
          </Badge>
        )}
      </div>
      {total > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[12px] text-muted">
            <span>{done} / {total} reviewed</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[rgb(var(--success))]" />{reviewed} done</span>
          </div>
          <Progress value={total > 0 ? (done / total) * 100 : 0} />
        </div>
      )}
    </div>
  );
}

function FlashCard({ card, flipped, onFlip }: { card: ReviewCard; flipped: boolean; onFlip: () => void }) {
  return (
    <div className="[perspective:1600px]">
      <button
        onClick={onFlip}
        aria-label={flipped ? 'Show prompt' : 'Reveal answer'}
        className="relative w-full text-left transition-transform duration-500 [transform-style:preserve-3d] min-h-[16rem]"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* front */}
        <Card className="absolute inset-0 flex flex-col [backface-visibility:hidden]">
          <FaceHeader card={card} label="Prompt" />
          <div className="flex-1 grid place-items-center px-2 py-6">
            <p className="font-head text-[18px] sm:text-[20px] font-semibold text-fg text-center leading-snug">{card.prompt}</p>
          </div>
          <p className="text-center text-[11.5px] text-muted">Tap to flip</p>
        </Card>

        {/* back */}
        <Card className="absolute inset-0 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface-2">
          <FaceHeader card={card} label="Answer" />
          <div className="flex-1 grid place-items-center px-2 py-6 overflow-auto">
            <p className="text-[14.5px] text-fg text-center leading-relaxed whitespace-pre-wrap">{card.answer}</p>
          </div>
          <p className="text-center text-[11.5px] text-muted">Tap to flip back</p>
        </Card>
      </button>
    </div>
  );
}

function FaceHeader({ card, label }: { card: ReviewCard; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <SubjectIcon subject={card.subject} size={32} />
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-semibold text-fg truncate">{card.subject}</p>
        <p className="text-[11px] text-muted truncate">{card.chapter}{card.topic ? ` · ${card.topic}` : ''}</p>
      </div>
      <Badge variant="neutral" size="sm">{label}</Badge>
    </div>
  );
}
