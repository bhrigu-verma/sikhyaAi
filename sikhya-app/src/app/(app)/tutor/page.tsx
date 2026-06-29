'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Send, Mic, Square, Camera, Sparkles, History, Plus,
  Bookmark, Loader2, GraduationCap, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, Select } from '@/components/ui/tabs';
import { Sheet } from '@/components/ui/sheet';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { AudioPlayer } from '@/components/feature/citation';
import { SubjectIcon } from '@/components/feature/subject-icon';
import { useToast } from '@/components/ui/toast';
import { useChats } from '@/lib/hooks';
import { PSEB_SYLLABUS } from '@/lib/syllabus';
import { cn } from '@/lib/utils';

type Role = 'user' | 'assistant';
interface Msg { id: string; role: Role; content: string }

type Mode = 'simple' | 'exam' | 'deep';

const MODES = [
  { value: 'simple', label: 'Simple', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { value: 'exam', label: 'Exam', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { value: 'deep', label: 'Deep', icon: <MessageSquare className="w-3.5 h-3.5" /> },
];

const SUGGESTIONS = [
  'Explain photosynthesis with a simple example',
  "State and prove the Pythagoras theorem",
  'How do I balance a chemical equation?',
  'What caused the rise of nationalism in India?',
];

// Subjects available in the PSEB syllabus (deduped).
const SUBJECT_OPTIONS = [
  { value: '', label: 'Any subject' },
  ...Array.from(new Set(PSEB_SYLLABUS.map(s => s.subject))).map(s => ({ value: s, label: s })),
];

const uid = () => Math.random().toString(36).slice(2);

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function TutorPage() {
  const t = useToast();
  const [mode, setMode] = useState<Mode>('simple');
  const [subject, setSubject] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { data: chatsData, isLoading: chatsLoading, error: chatsError, mutate: mutateChats } = useChats();

  // Auto-scroll to the bottom as messages stream in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const newChat = useCallback(() => {
    setMessages([]);
    setChatId(null);
    setError(null);
    setInput('');
  }, []);

  // ─── Streaming send ───
  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError(null);
    const userMsg: Msg = { id: uid(), role: 'user', content: trimmed };
    const assistantId = uid();
    const baseHistory = [...messages, userMsg];

    setMessages([...baseHistory, { id: assistantId, role: 'assistant', content: '' }]);
    setInput('');
    setStreaming(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: baseHistory.map(m => ({ role: m.role, content: m.content })),
          mode,
          ...(chatId ? { chatId } : {}),
          ...(subject ? { subject_filter: subject } : {}),
        }),
      });

      const newChatId = res.headers.get('X-Chat-Id');
      if (newChatId) setChatId(newChatId);

      if (res.status === 503) {
        const info = await res.json().catch(() => ({}));
        const msg = info?.error || 'The AI backend is waking up (cold start). Please try again in ~30 seconds.';
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: `⏳ ${msg}` } : m));
        setError(msg);
        return;
      }

      if (!res.ok || !res.body) {
        const info = await res.json().catch(() => ({}));
        throw new Error(info?.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: acc } : m));
      }
      acc += decoder.decode();
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: acc } : m));
      mutateChats();
    } catch (e: any) {
      const msg = e?.message || 'Something went wrong. Please try again.';
      setError(msg);
      setMessages(prev => prev.map(m => m.id === assistantId
        ? { ...m, content: m.content || `⚠️ ${msg}` }
        : m));
    } finally {
      setStreaming(false);
    }
  }, [messages, mode, chatId, subject, streaming, mutateChats]);

  // ─── Voice: record → STT → fill input ───
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach(tr => tr.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        if (blob.size === 0) return;
        setTranscribing(true);
        try {
          const fd = new FormData();
          fd.append('audio', blob, 'recording.webm');
          const res = await fetch('/api/voice/stt', { method: 'POST', body: fd });
          if (!res.ok) throw new Error('Transcription failed');
          const data = await res.json();
          if (data?.text) {
            setInput(prev => (prev ? prev + ' ' : '') + data.text);
            taRef.current?.focus();
          }
        } catch {
          t.error('Could not transcribe audio', 'Please try typing instead.');
        } finally {
          setTranscribing(false);
        }
      };
      recorderRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      t.error('Microphone unavailable', 'Please allow mic access to use voice.');
    }
  }, [t]);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
    setRecording(false);
  }, []);

  const toggleMic = () => (recording ? stopRecording() : startRecording());

  // ─── Image: read as dataURL then route to /doubts ───
  const onImagePick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { sessionStorage.setItem('sikhya-doubt-image', String(reader.result)); } catch { /* ignore */ }
      window.location.href = '/doubts';
    };
    reader.readAsDataURL(file);
  }, []);

  // ─── Save an assistant answer to spaced-repetition reviews ───
  const saveToRevise = useCallback(async (assistantId: string) => {
    const idx = messages.findIndex(m => m.id === assistantId);
    if (idx < 0) return;
    const answer = messages[idx].content;
    // Nearest preceding user message is the prompt.
    let prompt = '';
    for (let i = idx - 1; i >= 0; i--) {
      if (messages[i].role === 'user') { prompt = messages[i].content; break; }
    }
    if (!prompt || !answer) return;
    setSaving(assistantId);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject || 'General',
          chapter: 'From tutor',
          prompt,
          answer,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      t.success('Saved to revise', 'Find it in your spaced-repetition reviews.');
    } catch {
      t.error('Could not save', 'Please try again.');
    } finally {
      setSaving(null);
    }
  }, [messages, subject, t]);

  // ─── Load a past chat from history ───
  const loadChat = useCallback(async (id: string) => {
    setHistoryOpen(false);
    setLoadingChat(true);
    setError(null);
    try {
      const res = await fetch(`/api/chats/${id}`);
      if (!res.ok) throw new Error('Could not load chat');
      const data = await res.json();
      setMessages((data.messages || []).map((m: any) => ({
        id: m.id, role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content,
      })));
      setChatId(id);
      if (data?.chat?.mode) setMode(data.chat.mode as Mode);
    } catch {
      t.error('Could not load chat');
    } finally {
      setLoadingChat(false);
    }
  }, [t]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100dvh-theme(spacing.16))] max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 sm:px-6 pt-4 pb-3 shrink-0">
        <div className="min-w-0">
          <h1 className="font-head text-lg font-bold text-fg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> Tutor
          </h1>
          <p className="text-[12.5px] text-fg-2 mt-0.5">Ask anything — text, voice, or a photo.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" icon={<Plus className="w-4 h-4" />} onClick={newChat}>
            <span className="hidden sm:inline">New</span>
          </Button>
          <Button variant="outline" size="sm" icon={<History className="w-4 h-4" />} onClick={() => setHistoryOpen(true)}>
            <span className="hidden sm:inline">History</span>
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 pb-3 shrink-0">
        <Tabs items={MODES} value={mode} onChange={v => setMode(v as Mode)} size="sm" />
        <Select
          value={subject}
          onChange={setSubject}
          options={SUBJECT_OPTIONS}
          className="h-8 text-[12px]"
        />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-4 pb-4">
        {loadingChat ? (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-16 w-2/3 ml-auto" />
            <SkeletonText lines={4} />
          </div>
        ) : isEmpty ? (
          <div className="pt-6">
            <EmptyState
              icon={<Sparkles className="w-6 h-6" />}
              title="What would you like to learn?"
              description="Pick a mode, then ask a question. I can explain concepts, solve problems, and prep you for exams."
            />
            <div className="grid sm:grid-cols-2 gap-2 max-w-xl mx-auto mt-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-[13px] text-fg-2 bg-surface border border-border rounded-xl px-3.5 py-2.5 hover:border-border-strong hover:text-fg transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(m => (
            <MessageBubble
              key={m.id}
              msg={m}
              streaming={streaming}
              saving={saving === m.id}
              onSave={() => saveToRevise(m.id)}
            />
          ))
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 sm:px-6 shrink-0">
          <p className="text-[12px] text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{error}</p>
        </div>
      )}

      {/* Input bar */}
      <div className="shrink-0 px-4 sm:px-6 pb-4 pt-2">
        <div className="flex items-end gap-2 bg-surface border border-border rounded-2xl shadow-soft-1 p-2 focus-within:border-border-strong transition-colors">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={onImagePick}
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="shrink-0 w-9 h-9 grid place-items-center rounded-xl text-fg-2 hover:bg-subtle hover:text-fg transition-colors"
            aria-label="Snap a photo of a question"
            title="Snap a photo → solve in Doubts"
          >
            <Camera className="w-4.5 h-4.5" />
          </button>
          <button
            type="button"
            onClick={toggleMic}
            disabled={transcribing}
            className={cn(
              'shrink-0 w-9 h-9 grid place-items-center rounded-xl transition-colors',
              recording ? 'bg-danger/10 text-danger' : 'text-fg-2 hover:bg-subtle hover:text-fg',
              transcribing && 'opacity-50 cursor-not-allowed',
            )}
            aria-label={recording ? 'Stop recording' : 'Record voice'}
            title={recording ? 'Stop recording' : 'Record voice'}
          >
            {transcribing ? <Loader2 className="w-4.5 h-4.5 animate-spin" />
              : recording ? <Square className="w-4 h-4" />
              : <Mic className="w-4.5 h-4.5" />}
          </button>
          <textarea
            ref={taRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={recording ? 'Listening…' : 'Ask a question…'}
            className="flex-1 resize-none bg-transparent outline-none text-[14px] text-fg placeholder:text-muted py-2 max-h-32 leading-relaxed"
          />
          <Button
            variant="gradient"
            size="md"
            icon={streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            onClick={() => send(input)}
            disabled={streaming || !input.trim()}
            className="shrink-0"
            aria-label="Send"
          />
        </div>
        <p className="text-[11px] text-muted text-center mt-2">
          {recording ? 'Recording… tap the stop button when done.' : 'Enter to send · Shift+Enter for a new line'}
        </p>
      </div>

      {/* History Sheet */}
      <Sheet open={historyOpen} onClose={() => setHistoryOpen(false)} side="right" title="Chat history">
        <div className="p-3 space-y-2">
          {chatsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : chatsError ? (
            <EmptyState
              icon={<History className="w-5 h-5" />}
              title="Couldn't load history"
              description="Please try again in a moment."
              action={<Button size="sm" variant="outline" onClick={() => mutateChats()}>Retry</Button>}
            />
          ) : !chatsData?.chats?.length ? (
            <EmptyState
              icon={<MessageSquare className="w-5 h-5" />}
              title="No chats yet"
              description="Your past conversations will show up here."
            />
          ) : (
            chatsData.chats.map(c => (
              <button
                key={c.id}
                onClick={() => loadChat(c.id)}
                className={cn(
                  'w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-colors',
                  c.id === chatId ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface hover:border-border-strong',
                )}
              >
                <SubjectIcon subject={c.subject} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-fg truncate">{c.title || 'Untitled chat'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge>{c.mode}</Badge>
                    <span className="text-[11px] text-muted">{c.messageCount} msgs · {formatWhen(c.updatedAt)}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </Sheet>
    </div>
  );
}

function MessageBubble({
  msg, streaming, saving, onSave,
}: {
  msg: Msg;
  streaming: boolean;
  saving: boolean;
  onSave: () => void;
}) {
  const isUser = msg.role === 'user';
  const isStreamingThis = streaming && msg.role === 'assistant';
  const showActions = msg.role === 'assistant' && msg.content.trim().length > 0 && !isStreamingThis;

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] bg-accent text-white rounded-2xl rounded-br-md px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap shadow-soft-1">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="max-w-[90%] w-full">
        <Card padding="md" className="rounded-2xl rounded-bl-md">
          {msg.content.trim().length === 0 && isStreamingThis ? (
            <div className="flex items-center gap-2 text-fg-2 text-[13px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking…
            </div>
          ) : (
            <div className="font-sans text-[14px] text-fg leading-relaxed whitespace-pre-wrap">
              {msg.content}
              {isStreamingThis && <span className="inline-block w-1.5 h-4 bg-accent/60 ml-0.5 align-middle animate-pulse" />}
            </div>
          )}
        </Card>
        {showActions && (
          <div className="flex items-center gap-4 mt-2 pl-1">
            <AudioPlayer text={msg.content} />
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-1 text-[11.5px] text-fg-2 hover:text-accent transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bookmark className="w-3.5 h-3.5" />}
              Save to revise
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
