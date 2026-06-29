'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import {
  BookOpen, Search, Layers, GitBranch, Cpu, Database,
  ArrowRight, CheckCircle2, ChevronRight, Menu, X,
  FileText, Activity, BookMarked, Globe2, Compass,
  AlertCircle, ChevronDown, Check,
  MessageSquare, History, Target, Sparkles, BookA,
  Gift, Heart, Volume2, Brain, Zap, Camera,
} from 'lucide-react';

// Import images
import img2 from './img2.png';
import sikhyaIm1 from './sikhya-im1.jpg';
import sikhyaIm2 from './sikhya-im2.png';
import sikhyaAi from './sikhya-ai.png';

const FadeIn = ({
  children, delay = 0, direction = 'up', fullWidth = false, className = '',
}: {
  children: React.ReactNode; delay?: number; direction?: 'up'|'down'|'left'|'right'; fullWidth?: boolean; className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
  const yOffset = direction === 'up' ? 28 : direction === 'down' ? -28 : 0;
  const xOffset = direction === 'left' ? 28 : direction === 'right' ? -28 : 0;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, x: xOffset, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target as HTMLElement | null;
      setHover(!!(t && (t.tagName === 'BUTTON' || t.tagName === 'A' || t.closest('button') || t.closest('a'))));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] hidden md:block"
      animate={{ x: pos.x - 10, y: pos.y - 10, scale: hover ? 2.2 : 1, backgroundColor: hover ? 'rgba(251,191,36,0.9)' : 'rgba(251,191,36,0.6)', width: 20, height: 20 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.15 }}
    />
  );
};

const SikhyaLogo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]"
      style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b,#fbbf24)' }}>
      <span className="text-white font-bold text-[20px] leading-none select-none" style={{ fontFamily: 'serif' }}>ਸ</span>
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-[#FEF3C7] font-bold text-[15px] tracking-tight">Sikhya</span>
      <span className="text-[9px] text-[#F59E0B] font-medium tracking-[0.2em] uppercase">ਸਿੱਖਿਆ</span>
    </div>
  </div>
);

const demoExamples = [
  {
    subject: 'Class 10 Science', chapter: 'ਜੀਵਨ ਪ੍ਰਕਿਰਿਆਵਾਂ (Life Processes)',
    question: 'ਸਾਡੀ ਨਬਜ਼ ਦੀ ਗਤੀ ਕਸਰਤ ਤੋਂ ਬਾਅਦ ਕਿਉਂ ਵੱਧ ਜਾਂਦੀ ਹੈ?',
    answer: 'ਕਸਰਤ ਕਰਨ ਸਮੇਂ ਸਰੀਰ ਦੀਆਂ ਮਾਸਪੇਸ਼ੀਆਂ ਨੂੰ ਵੱਧ ਊਰਜਾ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਇਸ ਊਰਜਾ ਨੂੰ ਪੈਦਾ ਕਰਨ ਲਈ ਕੋਸ਼ਿਕਾਵਾਂ ਨੂੰ ਵੱਧ ਆਕਸੀਜਨ ਚਾਹੀਦੀ ਹੈ, ਇਸ ਲਈ ਦਿਲ ਤੇਜ਼ੀ ਨਾਲ ਖੂਨ ਪੰਪ ਕਰਦਾ ਹੈ।',
    tags: ['NCERT Page 98', 'PYQ 2022', 'Conceptual'], followUp: 'ਕਸਰਤ ਦੌਰਾਨ ਦਿਲ ਦੀ ਧੜਕਣ ਕਿਵੇਂ ਪ੍ਰਭਾਵਿਤ ਹੁੰਦੀ ਹੈ?',
  },
  {
    subject: 'Class 10 Mathematics', chapter: 'ਤਿਕੋਣਮਿਤੀ (Trigonometry)',
    question: 'Sin²θ + Cos²θ = 1 ਕਿਵੇਂ ਆਉਂਦਾ ਹੈ?',
    answer: 'ਇਹ Pythagoras Theorem ਤੋਂ ਆਉਂਦਾ ਹੈ। ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ: Sin θ = P/H, Cos θ = B/H। ਵਰਗ ਕਰਨ ਤੇ: (P²+B²)/H² = H²/H² = 1।',
    tags: ['Theorem Proof', 'Step-by-step', 'High Yield'], followUp: '1 + Tan²θ = Sec²θ ਨੂੰ ਕਿਵੇਂ ਸਿੱਧ ਕਰੀਏ?',
  },
  {
    subject: 'Class 10 Social Science', chapter: 'ਭਾਰਤ ਦਾ ਜਲਵਾਯੂ',
    question: 'ਭਾਰਤ ਵਿੱਚ ਮਾਨਸੂਨ ਵਰਖਾ ਕਿਉਂ ਹੁੰਦੀ ਹੈ?',
    answer: 'ਗਰਮੀਆਂ ਵਿੱਚ ਜ਼ਮੀਨ ਗਰਮ ਹੋ ਕੇ ਘੱਟ ਦਬਾਅ ਬਣਾਉਂਦੀ ਹੈ। ਸਮੁੰਦਰ ਤੋਂ ਨਮੀ ਭਰੀਆਂ ਹਵਾਵਾਂ ਇਸ ਵੱਲ ਵਗਦੀਆਂ ਹਨ ਅਤੇ ਵਰਖਾ ਹੁੰਦੀ ਹੈ।',
    tags: ['Geography Ch 4', 'Map Based', 'PYQ 2023'], followUp: 'ਦੱਖਣੀ-ਪੱਛਮੀ ਮਾਨਸੂਨ ਦੀਆਂ ਦੋ ਸ਼ਾਖਾਵਾਂ ਕਿਹੜੀਆਂ ਹਨ?',
  },
];

const faqs = [
  { q: 'How is Sikhya different from ChatGPT?', a: 'Generic AI is not bound by any syllabus. When a Class 10 student asks about Electricity, it gives college-level physics. Sikhya is Board-Aware — it retrieves the exact PSEB/NCERT chapter first, then answers only using vocabulary and concepts from that specific text.' },
  { q: 'Is it really free — forever?', a: 'Yes. The core learning loop — asking questions, getting syllabus-aligned answers, practicing MCQs, and taking mock tests — is completely free with no time limit. Our mission is to democratize quality education in Punjab regardless of financial background.' },
  { q: 'Does the AI hallucinate or give wrong answers?', a: 'Sikhya uses Retrieval-Augmented Generation (RAG). It must find and cite a verified source document before answering. If it cannot find the concept in the textbook, it tells you so. It cannot answer from imagination alone.' },
  { q: 'How does Punjabi language support work?', a: 'Sikhya natively understands Punjabi (Gurmukhi), Hindi (Devanagari), and English. It detects your language automatically. The AI generates answers in the same language you asked — natural, grammatically correct Punjabi, not a machine translation.' },
  { q: 'Which classes and boards are supported?', a: 'Currently Class 6–12 with full PSEB coverage. Science, Mathematics, Social Science, English, and Punjabi. Each subject includes chapter-wise alignment and 5–10 years of previous year question data.' },
];

const curriculumData = [
  { subject: 'Science (ਵਿਗਿਆਨ)', chapters: 16, pyq: '10 Years', status: 'Live', color: '#10B981' },
  { subject: 'Mathematics (ਗਣਿਤ)', chapters: 15, pyq: '10 Years', status: 'Live', color: '#6366F1' },
  { subject: 'Social Science', chapters: 21, pyq: '10 Years', status: 'Live', color: '#F59E0B' },
  { subject: 'English', chapters: 24, pyq: '5 Years', status: 'Beta', color: '#EC4899' },
  { subject: 'Punjabi (ਪੰਜਾਬੀ)', chapters: 18, pyq: '5 Years', status: 'Beta', color: '#F97316' },
];

const FaqItem = ({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) => (
  <div className="border-b border-[rgba(245,158,11,0.1)] group">
    <button className="w-full py-7 flex items-center justify-between text-left focus:outline-none" onClick={onClick}>
      <span className={`text-[17px] transition-colors duration-300 leading-snug ${isOpen ? 'text-[#FEF3C7]' : 'text-[#C4A882] group-hover:text-[#FEF3C7]'}`}>{q}</span>
      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ml-6 transition-all duration-300 ${isOpen ? 'bg-[rgba(245,158,11,0.15)] border-[rgba(245,158,11,0.3)] rotate-180' : 'border-[rgba(245,158,11,0.15)]'}`}>
        <ChevronDown className={`transition-colors text-[#8B7355] ${isOpen ? 'text-[#F59E0B]' : ''}`} size={15} />
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
          <p className="pb-7 text-[#8B7355] leading-relaxed text-[15px] max-w-3xl">{a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Architecture pipeline nodes
const archNodes = [
  [
    { label: 'Student Query', sub: 'Next.js Client', icon: MessageSquare, color: '#F59E0B' },
    { label: 'Language Detect', sub: 'Punjabi / Hindi / English', icon: Globe2, color: '#6366F1' },
    { label: 'Board + Grade', sub: 'PSEB / CBSE Context', icon: BookA, color: '#10B981' },
  ],
  [
    { label: 'Embed Query', sub: 'nomic-embed-text', icon: Brain, color: '#8B5CF6' },
    { label: 'Vector Search', sub: 'pgvector · PSEB Chunks', icon: Database, color: '#3B82F6' },
    { label: 'Top-K Retrieve', sub: 'Cosine Similarity', icon: Search, color: '#06B6D4' },
  ],
  [
    { label: 'Cross-Encode', sub: 'Reranker Model', icon: Layers, color: '#F59E0B' },
    { label: 'Constrained LLM', sub: 'sarvam-m · RAG Prompt', icon: Cpu, color: '#EC4899' },
    { label: 'TTS Output', sub: 'Web Speech API · Auto-lang', icon: Volume2, color: '#10B981' },
  ],
];

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveDemo(p => (p + 1) % demoExamples.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen text-[#FEF3C7] font-sans selection:bg-[#F59E0B]/30 selection:text-black relative overflow-x-hidden cursor-none"
      style={{ backgroundColor: '#0C0804' }}>

      <CustomCursor />

      {/* BACKGROUND — warm amber + indigo glows */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 100% 65% at 15% -5%, rgba(245,158,11,0.18) 0%, transparent 65%)' }} />
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 75% 55% at 90% 95%, rgba(99,102,241,0.13) 0%, transparent 60%)' }} />
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 55% 50%, rgba(245,158,11,0.04) 0%, transparent 70%)' }} />

      {/* Grain texture */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.028] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Subtle grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* NAV */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-700 ${isScrolled ? 'py-4 backdrop-blur-2xl border-b' : 'py-7 bg-transparent'}`}
        style={isScrolled ? { backgroundColor: 'rgba(12,8,4,0.8)', borderColor: 'rgba(245,158,11,0.1)' } : {}}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <SikhyaLogo />

          <div className="hidden md:flex items-center gap-10 text-[13px] font-medium tracking-wide" style={{ color: '#8B7355' }}>
            <a href="#features" className="hover:text-[#FEF3C7] transition-colors">Platform</a>
            <a href="#architecture" className="hover:text-[#FEF3C7] transition-colors">Architecture</a>
            <a href="#curriculum" className="hover:text-[#FEF3C7] transition-colors">Curriculum</a>
            <a href="#faq" className="hover:text-[#FEF3C7] transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <a href="https://github.com/bhrigu-verma" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] transition-colors hover:text-[#F59E0B]" style={{ color: '#8B7355' }}>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              bhrigu-verma
            </a>
            <Link href="/signin" className="text-[13px] font-medium transition-colors hover:text-[#FEF3C7]" style={{ color: '#C4A882' }}>Log In</Link>
            <Link href="/signin">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 text-[13px] font-bold rounded-full text-black"
                style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', boxShadow: '0 0 24px rgba(245,158,11,0.35)' }}>
                ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ
              </motion.button>
            </Link>
          </div>

          <button className="md:hidden p-2 z-50" style={{ color: '#FEF3C7' }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 pt-28 px-6 md:hidden backdrop-blur-3xl border-b"
            style={{ backgroundColor: 'rgba(12,8,4,0.96)', borderColor: 'rgba(245,158,11,0.1)' }}>
            <div className="flex flex-col gap-8 text-2xl font-light" style={{ color: '#C4A882' }}>
              {['Platform#features','Architecture#architecture','Curriculum#curriculum','FAQ#faq'].map(s => {
                const [label, href] = s.split('#');
                return <a key={href} href={`#${href}`} onClick={() => setIsMenuOpen(false)} className="hover:text-[#FEF3C7] transition-colors">{label}</a>;
              })}
              <hr style={{ borderColor: 'rgba(245,158,11,0.1)' }} />
              <Link href="/signin" className="hover:text-[#FEF3C7]" onClick={() => setIsMenuOpen(false)}>Log In</Link>
              <Link href="/signin" onClick={() => setIsMenuOpen(false)}
                className="py-4 rounded-2xl font-bold text-center text-black text-lg"
                style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)' }}>
                ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ — Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">

        {/* ─── HERO ─────────────────────────────────────── */}
        <section className="min-h-[100svh] flex items-center pt-32 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-8 items-center w-full">

            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="lg:col-span-5 flex flex-col gap-7">

              {/* FREE badge */}
              <FadeIn delay={0.05}>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border w-fit"
                  style={{ borderColor: 'rgba(245,158,11,0.3)', backgroundColor: 'rgba(245,158,11,0.08)' }}>
                  <Gift size={13} className="text-[#F59E0B]" />
                  <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#F59E0B' }}>
                    100% Free · No subscription · No credit card
                  </span>
                </div>
              </FadeIn>

              {/* Punjabi headline */}
              <FadeIn delay={0.1}>
                <div className="flex flex-col gap-1">
                  <div className="text-[#F59E0B] leading-none select-none" style={{ fontFamily: 'serif', fontSize: 'clamp(40px,6vw,68px)', fontStyle: 'italic' }}>
                    ਤੁਹਾਡਾ AI ਅਧਿਆਪਕ
                  </div>
                  <h1 className="font-bold leading-[1.08] text-[#FEF3C7]" style={{ fontSize: 'clamp(28px,4vw,46px)' }}>
                    Your AI Teacher<br />for Punjab Schools
                  </h1>
                </div>
              </FadeIn>

              <FadeIn delay={0.18}>
                <p className="text-[17px] leading-relaxed max-w-[480px]" style={{ color: '#C4A882' }}>
                  Custom-built for <strong className="text-[#FEF3C7]">PSEB students, Class 6–12</strong>. Answers straight from your textbook — in Punjabi, Hindi, or English. Zero cost. Zero catches. Free forever.
                </p>
              </FadeIn>

              {/* Trust pills */}
              <FadeIn delay={0.24}>
                <div className="flex flex-wrap gap-2">
                  {['PSEB Aligned','Class 6–12','ਪੰਜਾਬੀ Support','5 Subjects','10 Years PYQ'].map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-full text-[11.5px] font-medium flex items-center gap-1.5"
                      style={{ border: '1px solid rgba(245,158,11,0.18)', color: '#C4A882', backgroundColor: 'rgba(245,158,11,0.04)' }}>
                      <Check size={10} className="text-[#F59E0B]" /> {t}
                    </span>
                  ))}
                </div>
              </FadeIn>

              {/* CTAs */}
              <FadeIn delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <Link href="/signin">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="px-8 py-4 font-bold text-black text-[15px] rounded-full flex items-center gap-2.5"
                      style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b,#fbbf24)', boxShadow: '0 0 40px rgba(245,158,11,0.4)' }}>
                      ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ <ArrowRight size={17} />
                    </motion.button>
                  </Link>
                  <a href="#architecture">
                    <motion.button whileHover={{ backgroundColor: 'rgba(245,158,11,0.07)' }}
                      className="px-8 py-4 font-medium text-[#C4A882] text-[15px] rounded-full transition-colors"
                      style={{ border: '1px solid rgba(245,158,11,0.18)' }}>
                      See How It Works
                    </motion.button>
                  </a>
                </div>
              </FadeIn>
            </motion.div>

            {/* Right: animated demo card */}
            <div className="lg:col-span-7 relative h-[520px] md:h-[620px] perspective-1000 mt-4 lg:mt-0">
              <FadeIn delay={0.5} direction="left" className="w-full h-full">
                <div className="absolute inset-0 md:left-8 md:right-[-1rem] rounded-2xl overflow-hidden flex flex-col"
                  style={{ backgroundColor: 'rgba(20,14,8,0.85)', border: '1px solid rgba(245,158,11,0.14)', backdropFilter: 'blur(20px)', boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(245,158,11,0.1)' }}>

                  {/* Title bar */}
                  <div className="h-11 flex items-center px-4 gap-4" style={{ borderBottom: '1px solid rgba(245,158,11,0.08)', backgroundColor: 'rgba(245,158,11,0.02)' }}>
                    <div className="flex gap-2">
                      {['#553322','#554422','#225533'].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />)}
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-2"
                        style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(245,158,11,0.12)', color: '#8B7355' }}>
                        <Sparkles size={9} className="text-[#F59E0B]" /> Sikhya AI Tutor
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-9 flex-1 flex flex-col gap-5 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div key={activeDemo}
                        initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-5 h-full">

                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#F59E0B' }}>
                          <Compass size={13} /> {demoExamples[activeDemo].chapter}
                        </div>

                        <div className="text-[22px] md:text-[26px] font-semibold leading-[1.25]" style={{ color: '#FEF3C7' }}>
                          {demoExamples[activeDemo].question}
                        </div>

                        <div className="w-10 h-px" style={{ backgroundColor: 'rgba(245,158,11,0.2)' }} />

                        <div className="text-[14.5px] leading-relaxed flex-1" style={{ color: '#C4A882' }}>
                          {demoExamples[activeDemo].answer}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-auto">
                          {demoExamples[activeDemo].tags.map((tag, i) => (
                            <div key={i} className="px-3 py-1.5 rounded-full text-[10.5px] flex items-center gap-1.5"
                              style={{ border: '1px solid rgba(245,158,11,0.15)', color: '#8B7355', backgroundColor: 'rgba(245,158,11,0.04)' }}>
                              <CheckCircle2 size={9} className="text-[#10B981]" /> {tag}
                            </div>
                          ))}
                        </div>

                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                          className="flex items-center justify-between p-4 rounded-xl group"
                          style={{ border: '1px solid rgba(245,158,11,0.1)', backgroundColor: 'rgba(245,158,11,0.03)' }}>
                          <div className="flex items-center gap-3 text-[13px]" style={{ color: '#C4A882' }}>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(245,158,11,0.1)' }}>
                              <Search size={11} style={{ color: '#F59E0B' }} />
                            </div>
                            {demoExamples[activeDemo].followUp}
                          </div>
                          <ChevronRight size={14} style={{ color: '#5C4E3A' }} />
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Floating widget */}
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-3 top-20 w-52 p-4 rounded-2xl hidden lg:block"
                  style={{ backgroundColor: 'rgba(20,14,8,0.92)', border: '1px solid rgba(245,158,11,0.15)', backdropFilter: 'blur(20px)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                  <div className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold" style={{ color: '#8B7355' }}>
                    <Database size={11} className="text-[#6366F1]" /> Vector Match
                  </div>
                  <div className="h-1.5 w-full rounded-full mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full w-[92%]" style={{ background: 'linear-gradient(90deg,#6366F1,#818CF8)' }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono" style={{ color: '#5C4E3A' }}>
                    <span>PSEB_Sci_Ch6.pdf</span>
                    <span className="text-[#10B981]">92%</span>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute left-0 bottom-20 p-4 rounded-2xl hidden md:flex items-center gap-3"
                  style={{ backgroundColor: 'rgba(20,14,8,0.92)', border: '1px solid rgba(245,158,11,0.12)', backdropFilter: 'blur(20px)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <Volume2 size={15} className="text-[#10B981]" />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-semibold" style={{ color: '#FEF3C7' }}>Speaking in Punjabi</div>
                    <div className="text-[10.5px] mt-0.5" style={{ color: '#5C4E3A' }}>Auto-detected · TTS Active</div>
                  </div>
                </motion.div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── FREE STRIP ────────────────────────────────── */}
        <section className="relative py-10 overflow-hidden" style={{ backgroundColor: 'rgba(245,158,11,0.06)', borderTop: '1px solid rgba(245,158,11,0.12)', borderBottom: '1px solid rgba(245,158,11,0.12)' }}>
          <div className="max-w-5xl mx-auto px-6 text-center">
            <FadeIn>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                <div className="flex flex-col items-center">
                  <span className="text-[40px] font-black leading-none" style={{ color: '#F59E0B', fontFamily: 'serif' }}>ਮੁਫ਼ਤ</span>
                  <span className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#8B7355' }}>Forever Free</span>
                </div>
                <div className="hidden sm:block w-px h-12" style={{ backgroundColor: 'rgba(245,158,11,0.2)' }} />
                <p className="text-[17px] leading-relaxed max-w-lg text-left" style={{ color: '#C4A882' }}>
                  No subscription. No premium tier. No credit card. Every feature — AI tutor, practice tests, mock exams, textbooks — <strong style={{ color: '#FEF3C7' }}>free forever</strong> for every Punjab student.
                </p>
                <div className="hidden sm:block w-px h-12" style={{ backgroundColor: 'rgba(245,158,11,0.2)' }} />
                <Link href="/signin">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="px-7 py-3.5 rounded-full font-bold text-black whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', boxShadow: '0 0 30px rgba(245,158,11,0.3)' }}>
                    Start for Free →
                  </motion.button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ─── TICKER ────────────────────────────────────── */}
        <section className="py-7 border-b relative z-20 overflow-hidden" style={{ borderColor: 'rgba(245,158,11,0.08)', backgroundColor: 'rgba(245,158,11,0.015)' }}>
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-5 text-[11px] font-semibold tracking-[0.18em] uppercase font-mono" style={{ color: '#5C4E3A' }}>
            {[
              { icon: BookOpen, label: 'PSEB Curriculum' },
              { icon: Globe2, label: 'Trilingual Native' },
              { icon: Zap, label: 'RAG — No Hallucinations' },
              { icon: BookMarked, label: 'PYQ Integrated' },
              { icon: Gift, label: 'Free Forever' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 hover:text-[#C4A882] transition-colors cursor-default">
                <Icon size={13} className="text-[#F59E0B]" /> {label}
              </span>
            ))}
          </div>
        </section>

        {/* ─── PROBLEM ───────────────────────────────────── */}
        <section className="py-36 px-6 md:px-12 max-w-5xl mx-auto text-center border-b relative" style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

          <div className="flex flex-col items-center gap-12 relative z-10">
            <FadeIn>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(245,158,11,0.2)', backgroundColor: 'rgba(245,158,11,0.05)' }}>
                <AlertCircle size={20} style={{ color: '#8B7355' }} />
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="text-[clamp(30px,5vw,52px)] leading-tight tracking-tight" style={{ color: '#FEF3C7' }}>
                Coaching costs <span style={{ color: '#F59E0B', fontFamily: 'serif', fontStyle: 'italic' }}>₹3,000/month</span> in Punjab.<br />
                <span style={{ color: '#5C4E3A' }}>Most families can't afford it.</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-[17px] leading-relaxed max-w-3xl" style={{ color: '#8B7355' }}>
                A student in Ludhiana who can pay for coaching has a personal tutor to re-explain concepts, grade their answers, and practice exam questions. A student in a village with the same talent — doesn't. That gap is what Sikhya is built to close.
              </p>
            </FadeIn>

            <FadeIn delay={0.3} fullWidth>
              <div className="p-8 md:p-10 rounded-2xl w-full text-left flex flex-col md:flex-row items-start gap-10"
                style={{ backgroundColor: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-widest" style={{ color: '#F59E0B' }}>
                    <CheckCircle2 size={13} /> The Sikhya Approach
                  </div>
                  <h3 className="text-[26px] font-bold tracking-tight" style={{ color: '#FEF3C7' }}>Strictly Bound to Your Syllabus</h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: '#8B7355' }}>
                    Before answering, Sikhya identifies your grade and board, retrieves the exact textbook chapter, and forces the AI to explain using only vocabulary found in that specific material. No out-of-bound concepts. No confusion.
                  </p>
                </div>
                <div className="w-full md:w-[42%] rounded-xl p-5 font-mono text-[12px] leading-relaxed"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(245,158,11,0.1)', color: '#5C4E3A' }}>
                  <span style={{ color: '#10B981' }}>{'// System Prompt'}</span><br /><br />
                  <span style={{ color: '#C4A882' }}>"You are a Class 10 Science teacher. Answer ONLY using PSEB Chapter 10 (Refraction). Explain in natural Punjabi. Do not mention Snell's Law unless on page 168."</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ─── FEATURES ──────────────────────────────────── */}
        <section id="features" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: '#F59E0B' }}>
                <span className="w-6 h-px" style={{ backgroundColor: '#F59E0B' }} /> Platform
              </div>
              <h2 className="text-[clamp(28px,4vw,44px)] font-bold leading-tight tracking-tight mb-4" style={{ color: '#FEF3C7' }}>
                Engineered for real comprehension.
              </h2>
              <p className="text-[16px] max-w-lg leading-relaxed" style={{ color: '#8B7355' }}>
                Not just Q&A. A structured study system built around how PSEB exams actually work.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Layers, title: 'Chapter-Aware Answers', desc: 'Responses scoped to your exact chapter and grade level. No confusing out-of-syllabus explanations.', color: '#6366F1', span: 2 },
              { icon: BookMarked, title: 'PYQ Integration', desc: 'Every concept linked to past PSEB board exam questions. Know what actually gets asked.', color: '#F59E0B', span: 1 },
              { icon: GitBranch, title: 'Weakness Targeting', desc: 'Sikhya tracks your wrong answers and auto-generates revision paths for your weakest chapters.', color: '#10B981', span: 1 },
              { icon: FileText, title: 'Source-Cited Output', desc: 'Every answer cites the textbook page. If Sikhya can\'t find the source, it says so — no hallucinations.', color: '#EC4899', span: 2 },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1} className={`md:col-span-${f.span}`}>
                <div className="h-full p-8 rounded-3xl relative overflow-hidden group transition-all duration-500 cursor-default"
                  style={{ backgroundColor: 'rgba(245,158,11,0.025)', border: '1px solid rgba(245,158,11,0.1)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.025)')}>
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-20 transition-opacity group-hover:opacity-35"
                    style={{ background: `radial-gradient(circle, ${f.color}, transparent)` }} />
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-7 relative z-10"
                    style={{ backgroundColor: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                    <f.icon size={22} style={{ color: f.color }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[19px] font-bold mb-3 tracking-tight relative z-10" style={{ color: '#FEF3C7' }}>{f.title}</h3>
                  <p className="text-[14.5px] leading-relaxed relative z-10" style={{ color: '#8B7355' }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ─── THREE PILLARS ─────────────────────────────── */}
        <section className="py-28 border-t border-b relative" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'rgba(245,158,11,0.08)' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn>
              <div className="mb-16 text-center">
                <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-tight mb-4" style={{ color: '#FEF3C7' }}>Three pillars of exam mastery.</h2>
                <p className="text-[16px] max-w-2xl mx-auto leading-relaxed" style={{ color: '#8B7355' }}>Sikhya structures study into the three phases that top PSEB scorers actually follow.</p>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: MessageSquare, num: '01', title: 'Concept Clarity', desc: 'Ask any doubt in Punjabi or Hindi. Sikhya breaks it down with step-by-step analogies, strictly within your grade level.', color: '#F59E0B' },
                { icon: History, num: '02', title: 'PYQ Practice', desc: 'Test against real previous year board questions. Sikhya grades your answer using the official marking scheme.', color: '#6366F1' },
                { icon: Target, num: '03', title: 'Smart Revision', desc: 'Before exams, Sikhya auto-generates a revision list targeting only your weakest chapters based on past interactions.', color: '#10B981' },
              ].map((p, i) => (
                <FadeIn key={p.num} delay={i * 0.12}>
                  <div className="rounded-3xl p-8 h-full flex flex-col gap-7 transition-all duration-500 group"
                    style={{ border: '1px solid rgba(245,158,11,0.1)', backgroundColor: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ border: `1px solid ${p.color}30`, backgroundColor: `${p.color}10` }}>
                        <p.icon size={18} style={{ color: p.color }} strokeWidth={1.5} />
                      </div>
                      <span className="text-[38px] font-black leading-none" style={{ color: 'rgba(245,158,11,0.07)', fontFamily: 'serif' }}>{p.num}</span>
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold tracking-tight mb-3" style={{ color: '#FEF3C7' }}>{p.title}</h3>
                      <p className="text-[14.5px] leading-relaxed" style={{ color: '#8B7355' }}>{p.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ARCHITECTURE ──────────────────────────────── */}
        <section id="architecture" className="py-28 relative overflow-hidden border-b" style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(99,102,241,0.07) 0%, transparent 60%)' }} />
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <FadeIn>
              <div className="mb-20 text-center">
                <div className="inline-block px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] mb-5 font-mono"
                  style={{ border: '1px solid rgba(245,158,11,0.18)', backgroundColor: 'rgba(245,158,11,0.05)', color: '#8B7355' }}>
                  System Architecture
                </div>
                <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-tight mb-4" style={{ color: '#FEF3C7' }}>How Sikhya Works</h2>
                <p className="text-[16px] max-w-2xl mx-auto leading-relaxed" style={{ color: '#8B7355' }}>
                  A full RAG pipeline — from knowledge ingestion to a textbook-cited answer spoken back in your language.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} fullWidth>
              <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border"
                style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
                <Image
                  src={sikhyaAi}
                  alt="Sikhya AI System Architecture"
                  layout="responsive"
                  placeholder="blur"
                  className="w-full h-auto"
                />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ─── WHY FREE ──────────────────────────────────── */}
        <section className="py-28 px-6 md:px-12 border-b" style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-2" style={{ color: '#F59E0B' }}>
                    <Heart size={12} /> Why Free?
                  </div>
                  <h2 className="text-[clamp(28px,4vw,42px)] font-bold leading-tight tracking-tight mb-6" style={{ color: '#FEF3C7' }}>
                    Because talent is equally distributed.<br />
                    <span style={{ color: '#5C4E3A' }}>Opportunity is not.</span>
                  </h2>
                  <p className="text-[16px] leading-relaxed" style={{ color: '#8B7355' }}>
                    Sikhya was built by a student who saw first-hand how private coaching separates Punjab students who can afford it from those who can't — despite identical talent. There will never be a premium tier. The full tool is free for every Punjab student, forever.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: BookOpen, title: 'Complete feature access', sub: 'AI Tutor, Practice, Mock Tests, Books — all free', color: '#F59E0B' },
                    { icon: Globe2, title: 'All three languages', sub: 'Punjabi, Hindi, English — no language barrier', color: '#6366F1' },
                    { icon: BookMarked, title: 'Full PSEB coverage', sub: 'Class 6–12, all subjects, 10 years PYQ', color: '#10B981' },
                    { icon: Zap, title: 'No account needed to try', sub: 'Start immediately, sign up when you want', color: '#EC4899' },
                  ].map((item, i) => (
                    <motion.div key={item.title} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{ border: '1px solid rgba(245,158,11,0.1)', backgroundColor: 'rgba(245,158,11,0.03)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                        <item.icon size={17} style={{ color: item.color }} />
                      </div>
                      <div>
                        <div className="text-[13.5px] font-semibold" style={{ color: '#FEF3C7' }}>{item.title}</div>
                        <div className="text-[12px] mt-0.5" style={{ color: '#5C4E3A' }}>{item.sub}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── REAL IMPACT ────────────────────────────────── */}
        <section className="py-28 border-b" style={{ borderColor: 'rgba(245,158,11,0.08)', backgroundColor: 'rgba(245,158,11,0.01)' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn>
              <div className="mb-16">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: '#F59E0B' }}>
                  <Camera size={13} /> Real Work. Real Impact.
                </div>
                <h2 className="text-[clamp(28px,4vw,44px)] font-bold leading-tight tracking-tight mb-4" style={{ color: '#FEF3C7' }}>
                  From Classrooms to Code.
                </h2>
                <p className="text-[16px] max-w-2xl leading-relaxed" style={{ color: '#8B7355' }}>
                  We spend time on the ground in Punjab schools to understand exactly what students and teachers need. Sikhya is built for the real classroom environment.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
              <FadeIn delay={0.1} className="md:col-span-7 h-full">
                <div className="relative w-full h-full rounded-3xl overflow-hidden group border" style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
                  <Image
                    src={img2}
                    alt="Sikhya AI in Classroom"
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[14px] font-medium text-white/90 leading-relaxed bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
                      Understanding student needs during a school visit in Punjab. Our AI is designed to complement classroom teaching.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <div className="md:col-span-5 flex flex-col gap-6 h-full">
                <FadeIn delay={0.2} className="flex-1">
                  <div className="relative w-full h-full rounded-3xl overflow-hidden group border" style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
                    <Image
                      src={sikhyaIm1}
                      alt="Sikhya School Interaction"
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  </div>
                </FadeIn>
                <FadeIn delay={0.3} className="flex-1">
                  <div className="relative w-full h-full rounded-3xl overflow-hidden group border" style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
                    <Image
                      src={sikhyaIm2}
                      alt="Students using Sikhya"
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="px-3 py-1 rounded-full bg-[#F59E0B] text-black text-[10px] font-bold w-fit mb-2">LIVE TESTING</div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CURRICULUM ────────────────────────────────── */}
        <section id="curriculum" className="py-28 border-b relative" style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="text-[clamp(26px,4vw,38px)] font-bold tracking-tight mb-3" style={{ color: '#FEF3C7' }}>Board Coverage</h2>
                  <p className="text-[15px] max-w-xl leading-relaxed" style={{ color: '#8B7355' }}>Full context for Class 6–12 PSEB and CBSE. Every chapter, every topic, years of PYQ data.</p>
                </div>
                <div className="flex items-center gap-2.5 text-[10.5px] font-bold tracking-widest uppercase font-mono px-5 py-2.5 rounded-full"
                  style={{ border: '1px solid rgba(245,158,11,0.18)', color: '#8B7355', backgroundColor: 'rgba(245,158,11,0.04)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Database Live
                </div>
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {curriculumData.map((item, idx) => (
                <FadeIn key={idx} delay={idx * 0.08}>
                  <div className="p-6 rounded-2xl flex flex-col gap-5 transition-all duration-300 h-full"
                    style={{ border: `1px solid ${item.color}20`, backgroundColor: `${item.color}06` }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${item.color}10`)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = `${item.color}06`)}>
                    <div className="flex justify-between items-start">
                      <BookA size={18} style={{ color: `${item.color}80` }} strokeWidth={1.5} />
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border`}
                        style={item.status === 'Live'
                          ? { backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981', borderColor: 'rgba(16,185,129,0.2)' }
                          : { backgroundColor: 'rgba(255,255,255,0.05)', color: '#8B7355', borderColor: 'rgba(255,255,255,0.1)' }}>
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-[15px] mb-3 leading-tight" style={{ color: '#FEF3C7' }}>{item.subject}</div>
                      <div className="text-[12px] flex flex-col gap-1.5" style={{ color: '#5C4E3A' }}>
                        <span className="flex items-center gap-2"><Check size={11} style={{ color: item.color }} /> {item.chapters} Chapters</span>
                        <span className="flex items-center gap-2"><Check size={11} style={{ color: item.color }} /> {item.pyq} PYQ</span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ───────────────────────────────────────── */}
        <section id="faq" className="py-28 px-6 md:px-12 max-w-4xl mx-auto border-b" style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
          <FadeIn>
            <div className="mb-14">
              <h2 className="text-[clamp(26px,4vw,38px)] font-bold tracking-tight mb-3" style={{ color: '#FEF3C7' }}>Frequently Asked Questions</h2>
              <p className="text-[15px] leading-relaxed" style={{ color: '#8B7355' }}>Technical and practical questions about the platform.</p>
            </div>
          </FadeIn>
          <div className="border-t" style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <FaqItem q={faq.q} a={faq.a} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ─── MISSION ───────────────────────────────────── */}
        <section className="py-36 px-6 md:px-12 max-w-5xl mx-auto text-center relative border-b" style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[300px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)' }} />
          <FadeIn className="relative z-10">
            <div className="text-[40px] mb-6 select-none" style={{ fontFamily: 'serif', color: '#F59E0B' }}>❝</div>
            <h2 className="text-[clamp(24px,4vw,42px)] leading-[1.3] tracking-tight mb-10" style={{ color: '#FEF3C7' }}>
              ਹਰ ਬੱਚੇ ਨੂੰ ਇੱਕ ਅਧਿਆਪਕ ਦਾ ਹੱਕ ਹੈ।<br />
              <span style={{ color: '#5C4E3A' }}>Every child deserves a teacher who never gets tired.</span>
            </h2>
            <div className="w-10 h-px mx-auto" style={{ backgroundColor: 'rgba(245,158,11,0.3)' }} />
          </FadeIn>
        </section>

        {/* ─── CTA ───────────────────────────────────────── */}
        <section className="py-28 relative overflow-hidden" style={{ backgroundColor: 'rgba(245,158,11,0.03)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 65%)' }} />
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <FadeIn>
              <div className="text-[32px] mb-3 select-none" style={{ fontFamily: 'serif', color: '#F59E0B' }}>ਸਿੱਖਿਆ</div>
              <h2 className="text-[clamp(28px,4.5vw,44px)] font-bold tracking-tight mb-4" style={{ color: '#FEF3C7' }}>Ready to start learning?</h2>
              <p className="text-[16px] mb-10" style={{ color: '#8B7355' }}>Free forever. No credit card. No premium. Just learning.</p>
              <Link href="/signin" className="inline-block">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="px-12 py-5 text-[17px] font-bold rounded-full text-black inline-flex items-center gap-3"
                  style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b,#fbbf24)', boxShadow: '0 0 60px rgba(245,158,11,0.4)' }}>
                  ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ — It's Free <ArrowRight size={20} />
                </motion.button>
              </Link>
              <div className="mt-5 text-[12px]" style={{ color: '#5C4E3A' }}>sikhya-app.vercel.app · Class 6–12 · PSEB · Free Forever</div>
            </FadeIn>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ────────────────────────────────────── */}
      <footer className="py-14 px-6 md:px-12 relative z-20" style={{ borderTop: '1px solid rgba(245,158,11,0.08)', backgroundColor: 'rgba(8,5,2,0.9)' }}>
        <div className="max-w-7xl mx-auto flex flex-col gap-9">
          {/* Creator */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-7 px-8 rounded-2xl"
            style={{ border: '1px solid rgba(245,158,11,0.12)', backgroundColor: 'rgba(245,158,11,0.04)' }}>
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.5)' }}>Built by</span>
              <span className="text-[22px] font-bold" style={{ color: '#FEF3C7' }}>Bhrigu Verma</span>
            </div>
            <div className="hidden sm:block w-px h-10" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }} />
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a href="https://github.com/bhrigu-verma" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] transition-all"
                style={{ border: '1px solid rgba(245,158,11,0.15)', color: '#C4A882', backgroundColor: 'rgba(245,158,11,0.04)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.3)'; (e.currentTarget as HTMLElement).style.color = '#FEF3C7'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.15)'; (e.currentTarget as HTMLElement).style.color = '#C4A882'; }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                github.com/bhrigu-verma
              </a>
              <a href="https://www.linkedin.com/in/bhrigu-verma-89090a273/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] transition-all"
                style={{ border: '1px solid rgba(10,102,194,0.25)', color: '#C4A882', backgroundColor: 'rgba(10,102,194,0.06)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FEF3C7'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#C4A882'; }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" style={{ color: '#0A66C2' }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                linkedin/bhrigu-verma
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <SikhyaLogo />
            <p className="text-[11px] font-mono uppercase tracking-widest" style={{ color: '#3D3020' }}>
              © {new Date().getFullYear()} Sikhya — Free AI Teacher for Punjab Students
            </p>
            <div className="flex gap-7 text-[12px]" style={{ color: '#3D3020' }}>
              <a href="#features" className="hover:text-[#C4A882] transition-colors">Platform</a>
              <a href="#architecture" className="hover:text-[#C4A882] transition-colors">Architecture</a>
              <a href="#faq" className="hover:text-[#C4A882] transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
        * { cursor: none !important; }
      ` }} />
    </div>
  );
}
