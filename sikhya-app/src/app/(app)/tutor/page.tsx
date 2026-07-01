'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Send, Mic, Square, Camera, Sparkles, History, Plus,
  Bookmark, Loader2, GraduationCap, MessageSquare, Menu, BookOpen, Copy, Volume2, Paperclip, Play, Pause, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/tabs';
import { Sheet } from '@/components/ui/sheet';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { SubjectIcon } from '@/components/feature/subject-icon';
import { useToast } from '@/components/ui/toast';
import { useChats } from '@/lib/hooks';
import { getSyllabus, Chapter } from '@/lib/syllabus';
import { cn } from '@/lib/utils';

type Role = 'user' | 'assistant';
interface Msg { id: string; role: Role; content: string }

type Mode = 'simple' | 'notes' | 'exam' | 'deep';

interface ParsedCard {
  topicHeading: string;
  learningGoals: string[];
  englishExplanation: string;
  punjabiExplanation: string;
  examples: string[];
  formula?: string;
  examTip?: string;
  commonMistakes?: string;
  practiceQuestion?: string;
  relatedTopics: string[];
}

const FRONTEND_MODES = [
  { value: 'simple', label: 'Explain Simply', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { value: 'notes', label: 'Study Notes', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { value: 'exam', label: 'Exam Mode', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { value: 'deep', label: 'Detailed', icon: <MessageSquare className="w-3.5 h-3.5" /> },
];

const DEFAULT_WELCOME_CARD: ParsedCard = {
  topicHeading: "Welcome to your AI Study Notebook",
  learningGoals: [
    "Learn to navigate your PSEB board exam syllabus with AI tutoring",
    "Understand concepts in both English and Punjabi side-by-side",
    "Test your knowledge using practice challenges and exam tips"
  ],
  englishExplanation: "Welcome to Sikhya AI! I am your personal tutor, ready to explain any topic from your PSEB syllabus.\n\nTo begin, select a subject and class from the top selectors or a chapter from the left navigation panel. You can type a question, upload a screenshot, or click one of the pre-configured practice prompts in the left sidebar.\n\nAll my responses will be formatted as rich, digital textbook cards. Use the tabs above to toggle between full Study Notes, concise Short Answers, or dedicated Exam Mode prep.",
  punjabiExplanation: "ਸਿੱਖਿਆ AI ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ! ਮੈਂ ਤੁਹਾਡਾ ਨਿੱਜੀ ਟਿਊਟਰ ਹਾਂ, ਜੋ ਤੁਹਾਡੇ PSEB ਸਿਲੇਬਸ ਦੇ ਕਿਸੇ ਵੀ ਵਿਸ਼ੇ ਨੂੰ ਸਮਝਾਉਣ ਲਈ ਤਿਆਰ ਹਾਂ।\n\nਸ਼ੁਰੂ ਕਰਨ ਲਈ, ਖੱਬੇ ਪਾਸੇ ਦਿੱਤੇ ਚੈਪਟਰ ਨੈਵੀਗੇਸ਼ਨ ਜਾਂ ਉੱਪਰ ਦਿੱਤੇ ਵਿਸ਼ੇ ਚੋਣਕਾਰ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਤੁਸੀਂ ਕੋਈ ਵੀ ਪ੍ਰਸ਼ਨ ਪੁੱਛ ਸਕਦੇ ਹੋ, ਫੋਟੋ ਅਪਲੋਡ ਕਰ ਸਕਦੇ ਹੋ, ਜਾਂ ਖੱਬੇ ਪਾਸੇ ਦਿੱਤੇ ਨਮੂਨੇ ਦੇ ਪ੍ਰਸ਼ਨਾਂ 'ਤੇ ਕਲਿੱਕ ਕਰ ਸਕਦੇ ਹੋ।\n\nਮੇਰੇ ਸਾਰੇ ਉੱਤਰ ਇੱਕ ਡਿਜੀਟਲ ਪਾਠ-ਪੁਸਤਕ ਦੇ ਪੰਨੇ ਵਾਂਗ ਸੰਗਠਿਤ ਹੋਣਗੇ। ਤੁਸੀਂ ਵੱਖ-ਵੱਖ ਮੋਡਸ (ਜਿਵੇਂ ਕਿ ਪ੍ਰੀਖਿਆ ਮੋਡ ਜਾਂ ਵਿਸਤ੍ਰਿਤ ਨੋਟਸ) ਵਿੱਚ ਜਾਣ ਲਈ ਉੱਪਰ ਦਿੱਤੀਆਂ ਟੈਬਾਂ ਦੀ ਵਰਤੋਂ ਕਰ ਸਕਦੇ ਹੋ।",
  examples: [
    "🚀 Science Ch 9: Rocket propulsion is a classic example of Newton's Third Law.",
    "📐 Math Ch 6: Using the Pythagoras theorem to find shortest distance between two points.",
    "🌾 Science Ch 1: Balancing chemical reactions to understand mass conservation."
  ],
  formula: "a² + b² = c²  │  F_action = -F_reaction",
  examTip: "Make sure to write answers in structured bullet points during exams. Underlining key terms or formulas can gain you extra marks!",
  commonMistakes: "Students often confuse 'speed' and 'velocity' - velocity always requires specifying a direction.",
  practiceQuestion: "What is the difference between an exothermic and endothermic chemical reaction? Write the chemical equation for both.",
  relatedTopics: [
    "Chemical Reactions",
    "Newton's Laws",
    "Board Prep Strategy"
  ]
};

const uid = () => Math.random().toString(36).slice(2);

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const d_hrs = Math.floor(mins / 60);
  if (d_hrs < 24) return `${d_hrs}h ago`;
  const days = Math.floor(d_hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

function truncateExplanation(text: string): string {
  if (!text) return '';
  const paragraphs = text.split('\n\n');
  return paragraphs.slice(0, 2).join('\n\n');
}

function parseStudyCard(content: string, fallbackTopic: string = 'Active Study Topic'): ParsedCard {
  const result: ParsedCard = {
    topicHeading: '',
    learningGoals: [],
    englishExplanation: '',
    punjabiExplanation: '',
    examples: [],
    relatedTopics: []
  };

  if (!content) {
    return result;
  }

  const lines = content.split('\n');
  let currentSection: 'intro' | 'goals' | 'english' | 'punjabi' | 'examples' | 'formula' | 'examTip' | 'commonMistakes' | 'practiceQuestion' | 'related' = 'intro';
  
  const englishLines: string[] = [];
  const punjabiLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cleanLine = line.replace(/^[#\s*•-]+\s*/, '').trim();
    const lowerLine = line.toLowerCase();

    // Check for section transitions
    if (lowerLine.includes('learning goal') || lowerLine.includes('learning outcomes') || lowerLine.includes('ਸਿੱਖਣ ਦੇ ਉਦੇਸ਼')) {
      currentSection = 'goals';
      continue;
    }
    if (lowerLine.includes('english explanation') || lowerLine.startsWith('### english') || lowerLine.startsWith('**english')) {
      currentSection = 'english';
      continue;
    }
    if (lowerLine.includes('punjabi explanation') || lowerLine.startsWith('### punjabi') || lowerLine.startsWith('**punjabi') || lowerLine.includes('ਪੰਜਾਬੀ ਵਿਆਖਿਆ')) {
      currentSection = 'punjabi';
      continue;
    }
    if (lowerLine.includes('example') || lowerLine.includes('ਉਦਾਹਰਣ') || lowerLine.includes('उदाहरण')) {
      currentSection = 'examples';
      continue;
    }
    if (lowerLine.includes('formula') || lowerLine.includes('ਸੂਤਰ') || lowerLine.includes('सूत्र')) {
      currentSection = 'formula';
      continue;
    }
    if (lowerLine.includes('exam tip') || lowerLine.includes('ਬੋਰਡ ਟਿਪ') || lowerLine.includes('ਪ੍ਰੀਖਿਆ ਟਿਪ')) {
      currentSection = 'examTip';
      continue;
    }
    if (lowerLine.includes('common mistake') || lowerLine.includes('ਆਮ ਗਲਤੀਆਂ') || lowerLine.includes('ਗਲਤੀਆਂ')) {
      currentSection = 'commonMistakes';
      continue;
    }
    if (lowerLine.includes('practice question') || lowerLine.includes('ਅਭਿਆਸ ਪ੍ਰਸ਼ਨ') || lowerLine.includes('ਪ੍ਰਸ਼ਨ')) {
      currentSection = 'practiceQuestion';
      continue;
    }
    if (lowerLine.includes('related topic') || lowerLine.includes('ਸੰਬੰਧਿਤ ਵਿਸ਼ੇ')) {
      currentSection = 'related';
      continue;
    }

    // Capture Title / Heading if not set
    if (!result.topicHeading && (line.startsWith('#') || (line.startsWith('**') && line.endsWith('**') && line.length < 80))) {
      result.topicHeading = line.replace(/[#*]/g, '').trim();
      continue;
    }

    // Process line content
    switch (currentSection) {
      case 'goals':
        result.learningGoals.push(cleanLine);
        break;
      case 'english':
        englishLines.push(line);
        break;
      case 'punjabi':
        punjabiLines.push(line);
        break;
      case 'examples':
        result.examples.push(line);
        break;
      case 'formula':
        result.formula = (result.formula || '') + '\n' + line;
        break;
      case 'examTip':
        result.examTip = (result.examTip || '') + '\n' + line;
        break;
      case 'commonMistakes':
        result.commonMistakes = (result.commonMistakes || '') + '\n' + line;
        break;
      case 'practiceQuestion':
        result.practiceQuestion = (result.practiceQuestion || '') + '\n' + line;
        break;
      case 'related':
        result.relatedTopics.push(cleanLine);
        break;
      default:
        // Try to automatically sort into English/Punjabi by character set
        const hasPunjabi = /[\u0A00-\u0A7F]/.test(line);
        if (hasPunjabi) {
          punjabiLines.push(line);
        } else {
          englishLines.push(line);
        }
        break;
    }
  }

  result.englishExplanation = englishLines.join('\n\n');
  result.punjabiExplanation = punjabiLines.join('\n\n');
  if (result.formula) result.formula = result.formula.trim();
  if (result.examTip) result.examTip = result.examTip.trim();
  if (result.commonMistakes) result.commonMistakes = result.commonMistakes.trim();
  if (result.practiceQuestion) result.practiceQuestion = result.practiceQuestion.trim();

  // Fallbacks
  if (!result.topicHeading) {
    result.topicHeading = fallbackTopic;
  }
  if (result.learningGoals.length === 0) {
    result.learningGoals = [
      "Understand the key definitions and concepts of this topic",
      "Connect theory to practical board exam questions",
      "Avoid common pitfalls and conceptual mistakes"
    ];
  }
  if (result.examples.length === 0) {
    const bulletRegex = /^[-*•]\s*(.+)$/gm;
    let match;
    while ((match = bulletRegex.exec(content)) !== null) {
      if (result.examples.length < 3) {
        result.examples.push(match[0]);
      }
    }
    if (result.examples.length === 0) {
      result.examples = [
        "📚 Standard PSEB Textbook Chapter Reference",
        "💡 Real-world application of this core theory"
      ];
    }
  }
  if (result.relatedTopics.length === 0) {
    result.relatedTopics = [
      "Board Exam Syllabus",
      "Textbook Solutions",
      "Revision Notes"
    ];
  }

  return result;
}

export default function TutorPage() {
  const t = useToast();
  const [mode, setMode] = useState<string>('simple');
  const [classNum, setClassNum] = useState<number>(10);
  const [subject, setSubject] = useState<string>('Science');
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  
  const [messages, setMessages] = useState<Msg[]>([]);
  const [activeTurnIdx, setActiveTurnIdx] = useState<number | null>(null);
  
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { data: chatsData, isLoading: chatsLoading, error: chatsError, mutate: mutateChats } = useChats();

  // Set initial active chapter
  useEffect(() => {
    const syllabus = getSyllabus('Science', 10);
    if (syllabus?.chapters?.length) {
      setActiveChapter(syllabus.chapters[0]);
    }
  }, []);

  // Sync scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTurnIdx]);

  const newChat = useCallback(() => {
    setMessages([]);
    setChatId(null);
    setError(null);
    setInput('');
    setActiveTurnIdx(null);
  }, []);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError(null);
    const userMsg: Msg = { id: uid(), role: 'user', content: trimmed };
    const assistantId = uid();
    const baseHistory = [...messages, userMsg];

    setMessages([...baseHistory, { id: assistantId, role: 'assistant', content: '' }]);
    setActiveTurnIdx(baseHistory.length - 1);
    setInput('');
    setStreaming(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: baseHistory.map(m => ({ role: m.role, content: m.content })),
          mode: mode === 'notes' ? 'simple' : mode,
          ...(chatId ? { chatId } : {}),
          ...(subject ? { subject_filter: subject } : {}),
          class_filter: classNum,
        }),
      });

      const newChatId = res.headers.get('X-Chat-Id');
      if (newChatId) setChatId(newChatId);

      if (res.status === 401) {
        const msg = 'Your session has expired. Please sign in again to continue.';
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: `⚠️ ${msg}` } : m));
        setError(msg);
        return;
      }

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
  }, [messages, mode, chatId, subject, classNum, streaming, mutateChats]);

  // Voice recording
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

  const saveToRevise = useCallback(async (assistantId: string) => {
    const idx = messages.findIndex(m => m.id === assistantId);
    if (idx < 0) return;
    const answer = messages[idx].content;
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
          chapter: activeChapter?.title || 'From tutor',
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
  }, [messages, subject, activeChapter, t]);

  const loadChat = useCallback(async (id: string) => {
    setSidebarOpen(false);
    setLoadingChat(true);
    setError(null);
    try {
      const res = await fetch(`/api/chats/${id}`);
      if (!res.ok) throw new Error('Could not load chat');
      const data = await res.json();
      const loadedMsgs = (data.messages || []).map((m: any) => ({
        id: m.id, role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content,
      }));
      setMessages(loadedMsgs);
      setChatId(id);
      if (data?.chat?.mode) {
        setMode(data.chat.mode);
      }
      
      let lastUserIndex = -1;
      for (let i = loadedMsgs.length - 1; i >= 0; i--) {
        if (loadedMsgs[i].role === 'user') {
          lastUserIndex = i;
          break;
        }
      }
      setActiveTurnIdx(lastUserIndex >= 0 ? lastUserIndex : null);
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

  const userQuestions = useMemo(() => messages.filter(m => m.role === 'user'), [messages]);

  const activeUserMsg = activeTurnIdx !== null ? messages[activeTurnIdx] : null;
  const activeAssistantMsg = activeTurnIdx !== null ? messages[activeTurnIdx + 1] : null;
  const activeAssistantMsgId = activeAssistantMsg?.id || null;

  const parsedCard = useMemo(() => {
    if (activeAssistantMsg) {
      return parseStudyCard(activeAssistantMsg.content, activeUserMsg?.content || 'Study Topic');
    }
    return DEFAULT_WELCOME_CARD;
  }, [activeAssistantMsg, activeUserMsg]);

  const isThinking = streaming && activeAssistantMsg && activeAssistantMsg.content.trim().length === 0;

  const handleClassChange = (num: number) => {
    setClassNum(num);
    const syllabus = getSyllabus(subject, num);
    if (syllabus?.chapters?.length) {
      setActiveChapter(syllabus.chapters[0]);
    }
  };

  const handleSubjectChange = (subj: string) => {
    setSubject(subj);
    const syllabus = getSyllabus(subj, classNum);
    if (syllabus?.chapters?.length) {
      setActiveChapter(syllabus.chapters[0]);
    }
  };

  const handleChapterChange = (chId: string) => {
    const syllabus = getSyllabus(subject, classNum);
    const ch = syllabus?.chapters.find(c => c.id === chId);
    if (ch) {
      setActiveChapter(ch);
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full overflow-hidden bg-bg animate-fade-in">
      {/* Premium grid overlay background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* LEFT PANEL (Desktop sticky) */}
      <aside className="hidden lg:flex flex-col w-[320px] shrink-0 border-r border-border/80 bg-surface/20 backdrop-blur-sm h-full overflow-y-auto p-4 space-y-4 select-none">
        <LeftPanelContent
          classNum={classNum}
          subject={subject}
          activeChapter={activeChapter}
          onChapterSelect={setActiveChapter}
          userQuestions={userQuestions}
          messages={messages}
          activeTurnIdx={activeTurnIdx}
          onTurnSelect={setActiveTurnIdx}
          chatsData={chatsData}
          chatsLoading={chatsLoading}
          chatsError={chatsError}
          loadChat={loadChat}
          chatId={chatId}
          sendQuestion={send}
          onNewChat={newChat}
        />
      </aside>

      {/* CENTER PANEL */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Controls Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-border/60 bg-surface/30 backdrop-blur-md shrink-0 z-20">
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Pills */}
            <div className="flex items-center gap-1 p-0.5 bg-subtle/50 border border-border/60 rounded-xl">
              {FRONTEND_MODES.map(m => {
                const active = mode === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => {
                      setMode(m.value);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-bold transition-all duration-200",
                      active 
                        ? "bg-accent text-white shadow-soft-1" 
                        : "text-fg-2 hover:text-fg hover:bg-subtle"
                    )}
                  >
                    {m.icon}
                    <span className="hidden sm:inline">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-1.5">
              <Select
                value={String(classNum)}
                onChange={(v) => handleClassChange(Number(v))}
                options={[
                  { value: '10', label: 'Class 10' },
                  { value: '9', label: 'Class 9' },
                  { value: '8', label: 'Class 8' }
                ]}
                className="h-8 text-[11.5px] px-2 py-0"
              />
              <Select
                value={subject}
                onChange={handleSubjectChange}
                options={[
                  { value: 'Science', label: 'Science' },
                  { value: 'Mathematics', label: 'Math' },
                  { value: 'Social Science', label: 'SST' },
                  { value: 'English', label: 'English' }
                ]}
                className="h-8 text-[11.5px] px-2 py-0"
              />
              <Select
                value={activeChapter?.id || ''}
                onChange={handleChapterChange}
                options={
                  (getSyllabus(subject, classNum)?.chapters || []).map(ch => ({
                    value: ch.id,
                    label: `Ch ${ch.num}: ${ch.title.slice(0, 15)}${ch.title.length > 15 ? '...' : ''}`
                  }))
                }
                className="h-8 text-[11.5px] max-w-[140px] md:max-w-[200px] px-2 py-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted bg-surface-2/80 border border-border/40 px-2.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
              <span className="hidden xs:inline">Connected</span>
            </div>

            {/* Mobile Sheet Trigger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-border/80 bg-surface/50 text-fg-2 hover:text-fg hover:bg-subtle transition-all shrink-0"
              aria-label="Open Workspace Menu"
              title="Chapters & History"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main learning workspace */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6 pb-36 space-y-6">
          {error && (
            <div className="max-w-3xl mx-auto">
              <p className="text-[12.5px] text-danger bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </p>
            </div>
          )}

          {loadingChat ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-12 w-1/2 ml-auto" />
              <StudyCardSkeleton />
            </div>
          ) : isThinking ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {activeUserMsg && (
                <div className="flex justify-end w-full">
                  <div className="max-w-[80%] gradient-bg text-white rounded-2xl rounded-br-sm px-5 py-3 text-[14px] leading-relaxed shadow-soft-2 font-semibold">
                    {activeUserMsg.content}
                  </div>
                </div>
              )}
              <StudyCardSkeleton />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Active Student Question Bubble */}
              {activeUserMsg && (
                <div className="flex justify-end w-full animate-fade-in">
                  <div className="max-w-[80%] gradient-bg text-white rounded-2xl rounded-br-sm px-5 py-3 text-[14px] leading-relaxed shadow-[0_4px_20px_rgba(247,171,30,0.15)] font-semibold border border-accent/25">
                    {activeUserMsg.content}
                  </div>
                </div>
              )}

              {/* Large AI Study Card */}
              <div className="animate-fade-in">
                <Card padding="none" className="relative overflow-hidden w-full rounded-2xl bg-surface/50 border border-border/80 shadow-soft-3 backdrop-blur-md p-6">
                  {/* Header & Badges */}
                  <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-4 mb-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="accent" className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold">
                          {activeChapter ? `Ch ${activeChapter.num} · ${activeChapter.title}` : 'Sikhya Syllabus'}
                        </Badge>
                        {activeAssistantMsg && (
                          <Badge variant="success" className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold">
                            {mode === 'deep' ? 'detailed' : mode === 'exam' ? 'exam prep' : mode === 'notes' ? 'concept notes' : 'short answer'}
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-xl md:text-2xl font-head font-extrabold text-fg tracking-tight leading-tight mt-1.5">
                        {parsedCard.topicHeading}
                      </h2>
                    </div>

                    {/* Bookmark Card Action */}
                    {activeAssistantMsgId && (
                      <button
                        onClick={() => saveToRevise(activeAssistantMsgId)}
                        disabled={saving === activeAssistantMsgId}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 bg-surface/60 hover:bg-subtle text-[11.5px] text-fg-2 hover:text-accent font-semibold transition-colors disabled:opacity-50 shrink-0 mt-0.5 animate-fade-in"
                        title="Save to revision deck"
                      >
                        {saving === activeAssistantMsgId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden xs:inline">{saving === activeAssistantMsgId ? 'Saving...' : 'Save to Revise'}</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* 1. Learning Goals (shown in notes, exam, detail) */}
                    {(mode === 'notes' || mode === 'exam' || mode === 'deep') && parsedCard.learningGoals && parsedCard.learningGoals.length > 0 && (
                      <LearningGoals goals={parsedCard.learningGoals} />
                    )}

                    {/* 2. Side-by-Side English and Punjabi Explanations (desktop, stack on mobile) */}
                    {(mode === 'simple' || mode === 'notes' || mode === 'deep') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                        <LanguageBlock 
                          lang="en"
                          title="English Explanation"
                          text={mode === 'simple' ? truncateExplanation(parsedCard.englishExplanation) : parsedCard.englishExplanation}
                          icon="🇬🇧"
                          t={t}
                        />
                        <LanguageBlock 
                          lang="pa"
                          title="Punjabi Explanation (ਪੰਜਾਬੀ ਵਿਆਖਿਆ)"
                          text={mode === 'simple' ? truncateExplanation(parsedCard.punjabiExplanation) : parsedCard.punjabiExplanation}
                          icon="🌾"
                          t={t}
                        />
                      </div>
                    )}

                    {/* 3. Formulas (short, detail) */}
                    {(mode === 'simple' || mode === 'deep') && parsedCard.formula && (
                      <FormulaBlock formula={parsedCard.formula} />
                    )}

                    {/* 4. Practical Examples (notes, detail) */}
                    {(mode === 'notes' || mode === 'deep') && parsedCard.examples && parsedCard.examples.length > 0 && (
                      <ExamplesBlock examples={parsedCard.examples} />
                    )}

                    {/* 5. Diagram Placeholder (notes, detail) */}
                    {(mode === 'notes' || mode === 'deep') && (
                      <DiagramPlaceholder topic={parsedCard.topicHeading} />
                    )}

                    {/* 6. Exam Prep Cards (exam, detail) */}
                    {(mode === 'exam' || mode === 'deep') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parsedCard.examTip && <ExamTip text={parsedCard.examTip} />}
                        {parsedCard.commonMistakes && <CommonMistakes text={parsedCard.commonMistakes} />}
                      </div>
                    )}

                    {/* 7. Practice Challenge (exam, detail) */}
                    {(mode === 'exam' || mode === 'deep') && parsedCard.practiceQuestion && (
                      <PracticeQuestion text={parsedCard.practiceQuestion} />
                    )}

                    {/* 8. Related Topics tags (detail) */}
                    {mode === 'deep' && parsedCard.relatedTopics && parsedCard.relatedTopics.length > 0 && (
                      <RelatedTopicsBlock related={parsedCard.relatedTopics} onSelect={send} />
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Floating bottom input bar */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-10 bg-gradient-to-t from-bg via-bg/95 to-transparent z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-3 bg-surface/85 backdrop-blur-md border border-border/80 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] px-4 py-3 focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-accent/10 transition-all duration-300">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onImagePick}
            />
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => t.success('Image Support Only', 'Attachments are currently limited to question screenshots for doubts solving.')}
              className="shrink-0 w-11 h-11 grid place-items-center rounded-full text-fg-2 hover:bg-white/5 hover:text-accent hover:scale-105 hover:text-fg transition-colors"
              aria-label="Add attachment"
              title="Add attachment"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            {/* Image Upload Button */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="shrink-0 w-10 h-10 grid place-items-center rounded-lg text-fg-2 hover:bg-white/5 hover:text-accent transition-all duration-200"
              aria-label="Snap a photo of a question"
              title="Snap a photo → solve in Doubts"
            >
              <Camera className="w-5 h-5" />
            </button>
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleMic}
              disabled={transcribing}
              className={cn(
                'shrink-0 w-9.5 h-9.5 grid place-items-center rounded-xl transition-colors',
                recording ? 'bg-danger/10 text-danger' : 'text-fg-2 hover:bg-subtle hover:text-fg',
                transcribing && 'opacity-50 cursor-not-allowed',
              )}
              aria-label={recording ? 'Stop recording' : 'Record voice'}
              title={recording ? 'Stop recording' : 'Record voice'}
            >
              {transcribing ? <Loader2 className="w-5 h-5 animate-spin" />
                : recording ? <Square className="w-4.5 h-4.5" />
                : <Mic className="w-5 h-5" />}
            </button>
            {/* Text Area */}
            <textarea
              ref={taRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder={recording ? 'Listening…' : 'Ask anything from your syllabus...'}
              className="flex-1 resize-none bg-transparent outline-none text-[15px] text-fg placeholder:text-fg-2/60 px-2 py-3 max-h-32 leading-relaxed"
            />
            {/* Send Button */}
            <Button
              variant="gradient"
              size="md"
              icon={streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              onClick={() => send(input)}
              disabled={streaming || !input.trim()}
             className="shrink-0 rounded-full h-12 w-12 shadow-[0_0_18px_rgba(247,171,30,0.35)] hover:scale-105 transition-all duration-200"
              aria-label="Send"
            />
          </div>
          <p className="text-[11px] text-muted text-center mt-2">
            {recording ? 'Recording… tap the stop button when done.' : 'Enter to send · Shift+Enter for a new line'}
          </p>
        </div>
      </div>

      {/* Mobile Drawer Sheet */}
      <Sheet open={sidebarOpen} onClose={() => setSidebarOpen(false)} side="left" title="Syllabus & History">
        <div className="p-3 space-y-4 h-full overflow-y-auto">
          <LeftPanelContent
            classNum={classNum}
            subject={subject}
            activeChapter={activeChapter}
            onChapterSelect={setActiveChapter}
            userQuestions={userQuestions}
            messages={messages}
            activeTurnIdx={activeTurnIdx}
            onTurnSelect={(idx) => {
              setActiveTurnIdx(idx);
              setSidebarOpen(false);
            }}
            chatsData={chatsData}
            chatsLoading={chatsLoading}
            chatsError={chatsError}
            loadChat={(id) => {
              loadChat(id);
              setSidebarOpen(false);
            }}
            chatId={chatId}
            sendQuestion={(q) => {
              send(q);
              setSidebarOpen(false);
            }}
            onNewChat={() => {
              newChat();
              setSidebarOpen(false);
            }}
          />
        </div>
      </Sheet>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUBCOMPONENTS
   ───────────────────────────────────────────────────────────────────────────── */

function LeftPanelContent({
  classNum,
  subject,
  activeChapter,
  onChapterSelect,
  userQuestions,
  messages,
  activeTurnIdx,
  onTurnSelect,
  chatsData,
  chatsLoading,
  chatsError,
  loadChat,
  chatId,
  sendQuestion,
  onNewChat,
}: {
  classNum: number;
  subject: string;
  activeChapter: Chapter | null;
  onChapterSelect: (ch: Chapter) => void;
  userQuestions: Msg[];
  messages: Msg[];
  activeTurnIdx: number | null;
  onTurnSelect: (idx: number) => void;
  chatsData: any;
  chatsLoading: boolean;
  chatsError: any;
  loadChat: (id: string) => void;
  chatId: string | null;
  sendQuestion: (q: string) => void;
  onNewChat: () => void;
}) {
  const syllabus = getSyllabus(subject, classNum);
  const chapters = syllabus?.chapters || [];

  const computedSuggestions = useMemo(() => {
    if (activeChapter?.keyTopics?.length) {
      return [
        `Explain ${activeChapter.keyTopics[0]} simply with examples`,
        `Give me board prep points on ${activeChapter.keyTopics[1] || 'this chapter'}`,
        `What are the most common exam questions about ${activeChapter.keyTopics[2] || activeChapter.keyTopics[0]}?`
      ];
    }
    return [
      "Explain photosynthesis with a simple example",
      "State and prove the Pythagoras theorem",
      "How do I balance a chemical equation?"
    ];
  }, [activeChapter]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <Button 
        variant="gradient" 
        size="sm" 
        icon={<Plus className="w-4 h-4" />} 
        full 
        onClick={onNewChat}
        className="shadow-glow"
      >
        New Study Session
      </Button>

      {/* 1. Current Conversation */}
      {userQuestions.length > 0 && (
        <div className="bg-surface/50 border border-border/60 rounded-2xl p-4 backdrop-blur-md">
          <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
            <span>Session Questions</span>
          </div>
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {userQuestions.map((q, idx) => {
              const msgIdx = messages.findIndex(m => m.id === q.id);
              const isActive = activeTurnIdx === msgIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => onTurnSelect(msgIdx)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-[12.5px] font-semibold border transition-all duration-200 truncate block",
                    isActive 
                      ? "bg-accent/10 border-accent/30 text-accent font-bold" 
                      : "bg-transparent border-transparent text-fg-2 hover:bg-subtle hover:text-fg"
                  )}
                >
                  Q{idx + 1}: {q.content}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Chapter Navigation */}
      <div className="bg-surface/50 border border-border/60 rounded-2xl p-4 backdrop-blur-md">
        <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-accent" />
          <span>Chapter Navigation</span>
        </div>
        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
          {chapters.length === 0 ? (
            <span className="text-[11px] text-muted">No chapters found</span>
          ) : (
            chapters.map(ch => {
              const isActive = activeChapter?.id === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => onChapterSelect(ch)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl border transition-all duration-200 flex flex-col gap-0.5",
                    isActive 
                      ? "bg-accent/10 border-accent/40 text-fg shadow-[0_0_15px_rgba(247,171,30,0.08)] font-bold" 
                      : "bg-surface-2 border-border/40 text-fg-2 hover:border-border-strong hover:text-fg"
                  )}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-wider",
                      isActive ? "text-accent" : "text-muted"
                    )}>
                      Chapter {ch.num}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  </div>
                  <span className="text-[12.5px] font-bold truncate leading-tight">{ch.title}</span>
                  <span className="text-[10px] font-medium text-muted font-indic truncate">{ch.titlePunjabi}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Sample Questions */}
      <div className="bg-surface/50 border border-border/60 rounded-2xl p-4 backdrop-blur-md">
        <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Practice Prompts</span>
        </div>
        <div className="space-y-2">
          {computedSuggestions.map(s => (
            <button
              key={s}
              onClick={() => sendQuestion(s)}
              className="w-full text-left text-[11.5px] text-fg-2 hover:text-fg bg-surface-2 hover:bg-subtle border border-border/40 hover:border-border-strong rounded-xl p-2.5 transition-all duration-200 leading-normal"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Recent Chats */}
      <div className="bg-surface/50 border border-border/60 rounded-2xl p-4 backdrop-blur-md">
        <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-accent" />
          <span>Recent Notebooks</span>
        </div>
        <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
          {chatsLoading ? (
            <div className="space-y-1.5">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ) : chatsError ? (
            <span className="text-[11px] text-danger">Failed to load history</span>
          ) : !chatsData?.chats?.length ? (
            <span className="text-[11.5px] text-muted block text-center py-2">No past history</span>
          ) : (
            chatsData.chats.slice(0, 5).map((c: any) => {
              const isCurrent = c.id === chatId;
              return (
                <button
                  key={c.id}
                  onClick={() => loadChat(c.id)}
                  className={cn(
                    "w-full text-left px-2.5 py-2.5 rounded-xl border transition-all duration-150 flex items-start gap-2.5",
                    isCurrent 
                      ? "bg-accent/5 border-accent/20 text-accent font-semibold" 
                      : "bg-surface-2 border-border/40 text-fg-2 hover:border-border-strong hover:text-fg"
                  )}
                >
                  <SubjectIcon subject={c.subject} size={20} className="mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[12.5px] truncate leading-tight">{c.title || 'Untitled Session'}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[9px] text-muted uppercase tracking-wider font-semibold">
                      <span>{c.mode}</span>
                      <span>·</span>
                      <span>{formatWhen(c.updatedAt)}</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function LearningGoals({ goals }: { goals: string[] }) {
  return (
    <div className="bg-accent/[0.02] border border-accent/15 rounded-xl p-4 animate-fade-in shadow-soft-1">
      <div className="flex items-center gap-2 mb-2 text-accent font-bold text-[13.5px]">
        <span>🎯</span> Learning Goals
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {goals.map((g, idx) => (
          <li key={idx} className="flex items-start gap-2 text-[12.5px] text-fg-2 leading-relaxed">
            <span className="text-accent text-[14px] leading-none shrink-0">•</span>
            <span>{g}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LanguageBlock({
  lang, title, text, icon, t
}: {
  lang: 'en' | 'pa';
  title: string;
  text: string;
  icon: string;
  t: any;
}) {
  const [speechState, setSpeechState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    t.success('Copied Text', `${lang === 'en' ? 'English' : 'Punjabi'} notes copied to clipboard.`);
  };

  const handleRead = async () => {
    if (!text) return;
    if (speechState === 'playing') {
      audioRef.current?.pause();
      setSpeechState('idle');
      return;
    }
    if (urlRef.current && audioRef.current) {
      audioRef.current.play();
      setSpeechState('playing');
      return;
    }
    setSpeechState('loading');
    
    // Pause any other active speech
    if (typeof window !== 'undefined' && (window as any)._activeSikhyaAudio) {
      try {
        (window as any)._activeSikhyaAudio.pause();
      } catch (err) {}
    }

    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 3500) }),
      });
      if (!res.ok) {
        setSpeechState('idle');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      if (typeof window !== 'undefined') {
        (window as any)._activeSikhyaAudio = audio;
      }
      audio.onended = () => setSpeechState('idle');
      await audio.play();
      setSpeechState('playing');
    } catch {
      setSpeechState('idle');
    }
  };

  const isPunjabiTextEmpty = lang === 'pa' && (!text || text.trim().length === 0);

  return (
    <div className="flex flex-col h-full bg-subtle/20 border border-border/40 rounded-xl p-4 backdrop-blur-sm shadow-soft-1">
      <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[15px]">{icon}</span>
          <span className="text-[12.5px] font-bold text-fg-2">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            disabled={!text}
            className="p-1.5 rounded-lg text-muted hover:text-fg hover:bg-subtle/80 transition-colors disabled:opacity-50"
            title="Copy explanation text"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRead}
            disabled={!text}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all disabled:opacity-50",
              speechState === 'playing' 
                ? "bg-accent text-white shadow-soft-1" 
                : "bg-accent/10 hover:bg-accent/15 text-accent"
            )}
          >
            {speechState === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
             speechState === 'playing' ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{speechState === 'playing' ? 'Pause' : 'Read Aloud'}</span>
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-[140px] pr-1">
        {isPunjabiTextEmpty ? (
          <p className="text-[12.5px] text-muted italic leading-relaxed py-2">
            ਪੰਜਾਬੀ ਵਿਆਖਿਆ ਇਸ ਪ੍ਰਸ਼ਨ ਲਈ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਦੋਭਾਸ਼ੀ ਨੋਟਸ ਲਈ ਪ੍ਰਸ਼ਨ ਪੰਜਾਬੀ ਵਿੱਚ ਪੁੱਛੋ। (Punjabi translation not available for this question. Ask in Punjabi to get the translation!)
          </p>
        ) : (
          <p className={cn(
            "text-[13.5px] leading-relaxed text-fg whitespace-pre-wrap",
            lang === 'pa' ? "font-indic tracking-normal" : "font-sans"
          )}>
            {text || "Explanation will render once generated..."}
          </p>
        )}
      </div>
    </div>
  );
}

function FormulaBlock({ formula }: { formula: string }) {
  return (
    <div className="bg-accent/[0.03] border border-accent/20 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden group shadow-soft-1 animate-fade-in">
      <div className="absolute top-2 left-3.5 text-[9px] font-mono text-accent uppercase tracking-widest font-bold">Important Formula</div>
      <div className="text-xl md:text-2xl font-mono text-accent font-bold tracking-wide mt-4 mb-2 select-all text-center">
        {formula}
      </div>
      <div className="absolute -right-8 -bottom-8 text-accent/5 font-mono text-[100px] select-none group-hover:scale-105 transition-transform duration-300">∑</div>
    </div>
  );
}

function ExamplesBlock({ examples }: { examples: string[] }) {
  return (
    <div className="bg-surface-2/60 border border-border/50 rounded-xl p-4 space-y-2.5 animate-fade-in shadow-soft-1">
      <div className="text-[13.5px] font-bold text-fg flex items-center gap-1.5 mb-1">
        <span>💡</span> Concept Examples
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {examples.map((ex, idx) => (
          <div key={idx} className="text-[12.5px] text-fg-2 leading-relaxed flex items-start gap-2 bg-subtle/25 px-3 py-2.5 rounded-xl border border-border/30">
            <span className="text-accent text-[14px] leading-none shrink-0 mt-0.5">•</span>
            <span>{ex}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagramPlaceholder({ topic }: { topic: string }) {
  return (
    <div className="relative overflow-hidden w-full aspect-video rounded-xl bg-surface-2/80 border border-border/80 flex flex-col items-center justify-center p-6 group animate-fade-in shadow-soft-1">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px]" />
      
      <svg className="w-20 h-20 text-accent/20 group-hover:text-accent/30 transition-colors duration-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="50" cy="50" r="30" strokeDasharray="4 4" />
        <rect x="35" y="35" width="30" height="30" />
        <line x1="10" y1="10" x2="90" y2="90" />
        <line x1="90" y1="10" x2="10" y2="90" />
        <circle cx="50" cy="50" r="4" fill="currentColor" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
        <circle cx="80" cy="80" r="3" fill="currentColor" />
      </svg>
      
      <span className="text-[11px] font-mono text-muted uppercase tracking-wider mt-4">
        Interactive Chalkboard: {topic}
      </span>
      <span className="text-[9.5px] text-muted-2 mt-1">
        Concept blueprint layout placeholder
      </span>
    </div>
  );
}

function ExamTip({ text }: { text: string }) {
  return (
    <div className="bg-warning/5 border border-warning/15 rounded-xl p-4 flex gap-3 animate-fade-in shadow-soft-1 w-full">
      <div className="text-warning text-lg shrink-0">💡</div>
      <div>
        <div className="text-[13px] font-bold text-warning mb-1">Board Exam Tip</div>
        <p className="text-[12.5px] text-fg-2 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function CommonMistakes({ text }: { text: string }) {
  return (
    <div className="bg-danger/5 border border-danger/15 rounded-xl p-4 flex gap-3 animate-fade-in shadow-soft-1 w-full">
      <div className="text-danger text-lg shrink-0">⚠️</div>
      <div>
        <div className="text-[13px] font-bold text-danger mb-1">Common Mistakes</div>
        <p className="text-[12.5px] text-fg-2 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function PracticeQuestion({ text }: { text: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="bg-accent-2/5 border border-accent-2/15 rounded-xl p-4 animate-fade-in shadow-soft-1">
      <div className="flex items-center gap-2 mb-2 text-accent-2 font-bold text-[13.5px]">
        <span>✍️</span> Practice Challenge
      </div>
      <p className="text-[13px] text-fg leading-relaxed mb-3">{text}</p>
      <button 
        onClick={() => setRevealed(!revealed)}
        className="text-[11.5px] font-semibold text-accent hover:text-accent/80 transition-colors bg-accent/5 border border-accent/20 px-2.5 py-1.5 rounded-lg text-left inline-block"
      >
        {revealed ? 'Hide Solution Hint' : 'Reveal Solution Hint'}
      </button>
      {revealed && (
        <div className="mt-3 p-3 rounded-xl bg-surface border border-border/80 text-[12.5px] text-fg-2 leading-relaxed animate-fade-in">
          <strong>Steps:</strong> Identify the laws of conservation. Break the problem into horizontal and vertical components. Substitute variables and solve. Check units.
        </div>
      )}
    </div>
  );
}

function RelatedTopicsBlock({
  related,
  onSelect
}: {
  related: string[];
  onSelect: (topic: string) => void;
}) {
  return (
    <div className="border-t border-border/40 pt-4 mt-6 animate-fade-in">
      <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2.5">Related Topics</div>
      <div className="flex flex-wrap gap-2">
        {related.map((topic, i) => (
          <button
            key={i}
            onClick={() => onSelect(topic)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-subtle border border-border/60 text-xs font-bold text-fg-2 hover:border-accent/40 hover:text-accent transition-colors"
          >
            <Sparkles className="w-3 h-3 text-accent" />
            <span>{topic}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StudyCardSkeleton() {
  return (
    <Card padding="none" className="rounded-2xl bg-surface/50 border border-border/80 p-6 space-y-6 animate-pulse-soft">
      <div className="flex gap-4 border-b border-border/60 pb-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-7 w-2/3" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <SkeletonText lines={4} />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <SkeletonText lines={4} />
        </div>
      </div>
    </Card>
  );
}
