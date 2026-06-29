'use client';
import { useState } from 'react';
import {
  Download, Printer, X, BookOpen, ChevronDown, Search,
} from 'lucide-react';
import {
  BOOKS, CLASS_RANGE, SUBJECT_COLORS, SUBJECT_EMOJI,
  getBooksForClass, type PsebBook,
} from '@/lib/books';
import { cn } from '@/lib/utils';

// ─── Viewer ─────────────────────────────────────────────────────────────────

function PdfViewer({ book, onClose }: { book: PsebBook; onClose: () => void }) {

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = book.downloadUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  const handlePrint = () => {
    window.open(book.viewUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      {/* Viewer topbar */}
      <div className="flex items-center gap-3 px-4 h-[56px] bg-surface border-b border-border shrink-0">
        <button
          onClick={onClose}
          className="w-8 h-8 grid place-items-center rounded-lg text-muted hover:text-fg hover:bg-subtle border border-transparent hover:border-border transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="font-head text-[14px] font-semibold text-fg truncate">{book.title}</div>
          <div className="text-[11px] text-muted">
            Class {book.classNum} · {book.subject}
            {book.stream && <> · <span className="capitalize">{book.stream}</span></>}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrint}
            className="h-8 px-3 flex items-center gap-1.5 text-[12px] font-medium text-fg-2 hover:text-fg bg-subtle hover:bg-border rounded-lg border border-border transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open</span>
          </button>
          <button
            onClick={handleDownload}
            className="h-8 px-3 flex items-center gap-1.5 text-[12px] font-semibold text-white gradient-bg rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* PDF iframe — Google Drive preview embeds cleanly */}
      <div className="flex-1 overflow-hidden bg-[#404040]">
        <iframe
          key={book.viewUrl}
          src={book.viewUrl}
          className="w-full h-full border-0"
          title={book.title}
          allow="autoplay"
        />
      </div>
    </div>
  );
}

// ─── Book card ───────────────────────────────────────────────────────────────

function BookCard({ book, onClick }: { book: PsebBook; onClick: () => void }) {
  const bg = SUBJECT_COLORS[book.subject] ?? 'rgb(180 103 7 / .08)';
  const emoji = SUBJECT_EMOJI[book.subject] ?? '📚';

  return (
    <button
      onClick={onClick}
      className={cn(
        'group text-left w-full rounded-2xl border border-border bg-surface',
        'p-5 transition-all duration-200',
        'hover:-translate-y-1 hover:shadow-soft-2 hover:border-accent/30',
      )}
    >
      {/* Subject icon badge */}
      <div
        className="w-11 h-11 rounded-xl grid place-items-center text-xl mb-4 border border-white/10"
        style={{ background: bg }}
      >
        {emoji}
      </div>

      {/* Stream chip */}
      {book.stream && (
        <div className="mb-2">
          <span className={cn(
            'inline-block text-[9.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border',
            book.stream === 'Science'  && 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
            book.stream === 'Commerce' && 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
            book.stream === 'Arts'     && 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
          )}>
            {book.stream}
          </span>
        </div>
      )}

      <div className="font-head text-[14px] font-bold text-fg leading-snug mb-1.5 group-hover:text-accent transition-colors">
        {book.title}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
        <span className="text-[11px] text-muted font-medium">{book.language}</span>
        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full text-success bg-success/10">
          Available
        </span>
      </div>
    </button>
  );
}

// ─── Subject group ───────────────────────────────────────────────────────────

function SubjectSection({
  subject, books, onSelect,
}: { subject: string; books: PsebBook[]; onSelect: (b: PsebBook) => void }) {
  const [open, setOpen] = useState(true);
  const emoji = SUBJECT_EMOJI[subject] ?? '📚';

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 w-full text-left mb-3 group"
      >
        <span className="text-base">{emoji}</span>
        <span className="font-head text-[14px] font-bold text-fg group-hover:text-accent transition-colors">{subject}</span>
        <span className="text-[11px] text-muted ml-1">({books.length})</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted ml-auto transition-transform', !open && '-rotate-90')} />
      </button>
      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {books.map(b => (
            <BookCard key={b.id} book={b} onClick={() => onSelect(b)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BooksPage() {
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState<string>('All');
  const [openBook, setOpenBook] = useState<PsebBook | null>(null);

  const books = getBooksForClass(selectedClass);

  const filteredBooks = books.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.subject.toLowerCase().includes(search.toLowerCase());
    const matchStream = streamFilter === 'All' || !b.stream || b.stream === streamFilter;
    return matchSearch && matchStream;
  });

  const subjects = [...new Set(filteredBooks.map(b => b.subject))];

  const streams = selectedClass >= 11
    ? ['All', 'Science', 'Commerce', 'Arts']
    : ['All'];

  const stats = {
    total: BOOKS.length,
    available: BOOKS.length,
  };

  return (
    <>
      {openBook && <PdfViewer book={openBook} onClose={() => setOpenBook(null)} />}

      <div className="px-6 py-7 pb-20 max-w-[1200px] mx-auto">

        {/* Hero header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl gradient-bg grid place-items-center shadow-glow">
                <BookOpen className="w-[18px] h-[18px] text-white" />
              </div>
              <h1 className="font-head text-[22px] font-extrabold text-fg tracking-tight">PSEB Textbooks</h1>
            </div>
            <p className="text-[13px] text-muted max-w-[480px] leading-relaxed">
              Complete library of Punjab School Education Board textbooks, Class 6–12.
              Read, annotate, and download.
            </p>
          </div>
          <div className="flex gap-4 text-right shrink-0">
            <div>
              <div className="font-head text-[24px] font-bold text-fg">{stats.available}</div>
              <div className="text-[11px] text-muted">Available</div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="font-head text-[24px] font-bold text-fg">{stats.total}</div>
              <div className="text-[11px] text-muted">Total books</div>
            </div>
          </div>
        </div>

        {/* Class selector */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-[11.5px] font-semibold text-muted uppercase tracking-wider mr-1">Class</span>
          {CLASS_RANGE.map(c => (
            <button
              key={c}
              onClick={() => { setSelectedClass(c); setStreamFilter('All'); }}
              className={cn(
                'w-9 h-9 rounded-full text-[13px] font-bold border transition-all',
                selectedClass === c
                  ? 'gradient-bg text-white border-transparent shadow-glow'
                  : 'bg-surface border-border text-fg-2 hover:border-accent/40 hover:text-fg',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Stream filter (11/12 only) + search row */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {streams.length > 1 && (
            <div className="flex gap-1.5">
              {streams.map(s => (
                <button
                  key={s}
                  onClick={() => setStreamFilter(s)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all',
                    streamFilter === s
                      ? 'bg-accent/10 text-accent border-accent/25'
                      : 'text-fg-2 hover:text-fg border-border',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 bg-subtle border border-border rounded-xl focus-within:border-accent transition-colors ml-auto max-w-[260px] w-full">
            <Search className="w-3.5 h-3.5 text-muted shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search subjects or titles…"
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-muted hover:text-fg">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Books grouped by subject */}
        {subjects.length === 0 ? (
          <div className="py-20 text-center text-muted text-[14px]">No books match your search.</div>
        ) : (
          subjects.map(subject => (
            <SubjectSection
              key={subject}
              subject={subject}
              books={filteredBooks.filter(b => b.subject === subject)}
              onSelect={setOpenBook}
            />
          ))
        )}

        {/* Upload guide */}
        <div className="mt-10 rounded-2xl border border-dashed border-border p-6 bg-surface/50 text-center">
          <div className="text-[13px] text-muted max-w-[460px] mx-auto leading-relaxed">
            To add a book, upload the PDF to Cloudflare R2, copy the public URL, and paste it into{' '}
            <code className="text-accent text-[12px] bg-accent/8 px-1.5 py-0.5 rounded">src/lib/books.ts</code>{' '}
            next to the matching book&apos;s <code className="text-[12px] bg-subtle px-1 rounded">url</code> field.
          </div>
        </div>
      </div>
    </>
  );
}
