import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { 
  BookOpen, Search, Layers, GitBranch, Cpu, Database, 
  ArrowRight, CheckCircle2, ChevronRight, Menu, X,
  FileText, Activity, BookMarked, Globe2, Compass, Key,
  AlertCircle, GraduationCap, ChevronDown, Check,
  MessageSquare, History, Target, Zap, Sparkles, BookA
} from 'lucide-react';


// High-end smooth reveal component
const FadeIn = ({ children, delay = 0, direction = 'up', fullWidth = false, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  const yOffset = direction === 'up' ? 30 : direction === 'down' ? -30 : 0;
  const xOffset = direction === 'left' ? 30 : direction === 'right' ? -30 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, x: xOffset, filter: 'blur(4px)' }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' } : { opacity: 0, y: yOffset, x: xOffset, filter: 'blur(4px)' }}
      transition={{ duration: 0.9, delay: delay, ease: [0.16, 1, 0.3, 1] }}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Premium Custom Cursor
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
      animate={{
        x: mousePosition.x - 10,
        y: mousePosition.y - 10,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.6)',
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.2 }}
    />
  );
};


const SikhyaLogo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/0 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        <path d="M16 2L2 9L16 16L30 9L16 2Z" stroke="#F3F4F6" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M2 23L16 30L30 23" stroke="#F3F4F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 16L16 23L30 16" stroke="#F3F4F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <span className="text-[#F3F4F6] font-medium tracking-wide text-lg group-hover:text-white transition-colors">Sikhya</span>
  </div>
);

const demoExamples = [
  {
    subject: "Class 10 Science",
    chapter: "ਜੀਵਨ ਪ੍ਰਕਿਰਿਆਵਾਂ (Life Processes)",
    question: "ਸਾਡੀ ਨਬਜ਼ ਦੀ ਗਤੀ ਕਸਰਤ ਤੋਂ ਬਾਅਦ ਕਿਉਂ ਵੱਧ ਜਾਂਦੀ ਹੈ?",
    answer: "ਕਸਰਤ ਕਰਨ ਸਮੇਂ ਸਰੀਰ ਦੀਆਂ ਮਾਸਪੇਸ਼ੀਆਂ ਨੂੰ ਵੱਧ ਊਰਜਾ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਇਸ ਊਰਜਾ ਨੂੰ ਪੈਦਾ ਕਰਨ ਲਈ, ਕੋਸ਼ਿਕਾਵਾਂ ਨੂੰ ਆਮ ਨਾਲੋਂ ਵੱਧ ਆਕਸੀਜਨ ਅਤੇ ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੀ ਲੋੜ ਪੈਂਦੀ ਹੈ। ਇਸ ਮੰਗ ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ, ਸਾਡਾ ਦਿਲ ਖੂਨ ਨੂੰ ਤੇਜ਼ੀ ਨਾਲ ਪੰਪ ਕਰਦਾ ਹੈ ਤਾਂ ਜੋ ਆਕਸੀਜਨ ਜਲਦੀ ਸਰੀਰ ਦੇ ਹਿੱਸਿਆਂ ਤੱਕ ਪਹੁੰਚ ਸਕੇ, ਜਿਸ ਕਾਰਨ ਨਬਜ਼ ਦੀ ਗਤੀ ਵੱਧ ਜਾਂਦੀ ਹੈ।",
    tags: ["NCERT Page 98", "Previous Year 2022", "Conceptual"],
    followUp: "ਕਸਰਤ ਦੌਰਾਨ ਦਿਲ ਦੀ ਧੜਕਣ ਕਿਵੇਂ ਪ੍ਰਭਾਵਿਤ ਹੁੰਦੀ ਹੈ?"
  },
  {
    subject: "Class 10 Social Science",
    chapter: "ਭਾਰਤ ਦਾ ਜਲਵਾਯੂ (Climate of India)",
    question: "ਭਾਰਤ ਵਿੱਚ ਮਾਨਸੂਨ ਵਰਖਾ ਕਿਉਂ ਹੁੰਦੀ ਹੈ?",
    answer: "ਭਾਰਤ ਵਿੱਚ ਮਾਨਸੂਨ ਵਰਖਾ ਮੁੱਖ ਤੌਰ 'ਤੇ ਤਾਪਮਾਨ ਅਤੇ ਹਵਾ ਦੇ ਦਬਾਅ ਵਿੱਚ ਅੰਤਰ ਕਾਰਨ ਹੁੰਦੀ ਹੈ। ਗਰਮੀਆਂ ਵਿੱਚ, ਭਾਰਤੀ ਉਪਮਹਾਂਦੀਪ ਦਾ ਜ਼ਮੀਨੀ ਹਿੱਸਾ ਬਹੁਤ ਗਰਮ ਹੋ ਜਾਂਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਘੱਟ ਦਬਾਅ ਵਾਲਾ ਖੇਤਰ ਬਣਦਾ ਹੈ। ਇਸ ਦੇ ਉਲਟ, ਹਿੰਦ ਮਹਾਂਸਾਗਰ ਉੱਤੇ ਉੱਚ ਦਬਾਅ ਹੁੰਦਾ ਹੈ। ਹਵਾਵਾਂ ਹਮੇਸ਼ਾ ਉੱਚ ਦਬਾਅ ਤੋਂ ਘੱਟ ਦਬਾਅ ਵੱਲ ਵਗਦੀਆਂ ਹਨ, ਆਪਣੇ ਨਾਲ ਸਮੁੰਦਰ ਤੋਂ ਨਮੀ ਲਿਆਉਂਦੀਆਂ ਹਨ ਜੋ ਵਰਖਾ ਦਾ ਕਾਰਨ ਬਣਦੀ ਹੈ।",
    tags: ["Geography Ch 4", "Map Reference", "High Yield"],
    followUp: "ਦੱਖਣੀ-ਪੱਛਮੀ ਮਾਨਸੂਨ ਦੀਆਂ ਦੋ ਸ਼ਾਖਾਵਾਂ ਕਿਹੜੀਆਂ ਹਨ?"
  },
  {
    subject: "Class 10 Mathematics",
    chapter: "ਤਿਕੋਣਮਿਤੀ (Trigonometry)",
    question: "Sin²θ + Cos²θ = 1 ਕਿਵੇਂ ਆਉਂਦਾ ਹੈ?",
    answer: "ਇਹ ਪਾਇਥਾਗੋਰਸ ਥਿਊਰਮ (Pythagoras Theorem) 'ਤੇ ਅਧਾਰਤ ਹੈ। ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ (Right-angled triangle) ਵਿੱਚ:\nSin θ = ਲੰਬ / ਕਰਣ (Perpendicular / Hypotenuse)\nCos θ = ਆਧਾਰ / ਕਰਣ (Base / Hypotenuse)\n\nਜੇਕਰ ਅਸੀਂ ਵਰਗ ਕਰੀਏ: (P/H)² + (B/H)²\n= (P² + B²) / H²\nਪਾਇਥਾਗੋਰਸ ਥਿਊਰਮ ਅਨੁਸਾਰ P² + B² = H² ਹੁੰਦਾ ਹੈ।\nਇਸ ਲਈ, H² / H² = 1।",
    tags: ["Theorem Proof", "Step-by-step", "Formulas"],
    followUp: "1 + Tan²θ = Sec²θ ਨੂੰ ਕਿਵੇਂ ਸਿੱਧ ਕਰੀਏ?"
  }
];

const faqs = [
  {
    q: "How is Sikhya different from ChatGPT?",
    a: "Generic AI models are not bound by a syllabus. If a 10th-grade student asks about 'Electricity', a generic AI might give college-level physics explanations. Sikhya is 'Board-Aware'. It first retrieves the exact NCERT/PSEB textbook chapter, reads the constraints of the grade level, and answers strictly within those boundaries."
  },
  {
    q: "Is it really free for students?",
    a: "Yes. The core learning loop—asking questions, getting syllabus-aligned answers, and practicing previous year questions—is completely free. Our mission is to democratize access to high-quality personalized education regardless of financial background."
  },
  {
    q: "Does the AI ever 'hallucinate' or give wrong facts?",
    a: "We severely limit hallucination through a technique called Retrieval-Augmented Generation (RAG). Sikhya cannot answer from its 'imagination'. It must cite a verified source document (like a textbook or official board marking scheme) before generating a response. If it can't find the source, it will tell the student it doesn't know."
  },
  {
    q: "How does the trilingual support work?",
    a: "Sikhya natively understands and generates in Punjabi, Hindi, and English. This is not a cheap overlay translation. The system grasps the semantic meaning of a query in Punjabi, retrieves the relevant concept, and explains it back in natural, grammatically correct Punjabi."
  }
];

const curriculumData = [
  { subject: "Science (ਵਿਗਿਆਨ)", chapters: 16, pyq: "10 Years", status: "Live" },
  { subject: "Mathematics (ਗਣਿਤ)", chapters: 15, pyq: "10 Years", status: "Live" },
  { subject: "Social Science (ਸਮਾਜਿਕ ਸਿੱਖਿਆ)", chapters: 21, pyq: "10 Years", status: "Live" },
  { subject: "English", chapters: 24, pyq: "5 Years", status: "Beta" },
  { subject: "Punjabi (ਪੰਜਾਬੀ)", chapters: 18, pyq: "5 Years", status: "Beta" }
];


const FaqItem = ({ q, a, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/5 group">
      <button 
        className="w-full py-8 flex items-center justify-between text-left focus:outline-none"
        onClick={onClick}
      >
        <span className={`text-lg transition-colors duration-300 font-light ${isOpen ? 'text-white' : 'text-[#94A3B8] group-hover:text-white'}`}>
          {q}
        </span>
        <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-white/10 rotate-180' : 'group-hover:border-white/30'}`}>
          <ChevronDown className={`text-[#94A3B8] transition-colors ${isOpen ? 'text-white' : 'group-hover:text-white'}`} size={16} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-[#64748B] leading-relaxed font-light text-base md:text-lg max-w-3xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // Parallax effect for hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demoExamples.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#030407] text-[#E2E8F0] font-sans selection:bg-[#F59E0B]/30 selection:text-white relative overflow-x-hidden cursor-none">
      
      <CustomCursor />

      {/* ULTRA-PREMIUM BACKGROUND EFFECTS */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.015] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Subtle Radial Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e293b]/20 via-[#030407]/0 to-[#030407]/0" />

      {/* Blueprint Grid Lines - Ultra faint */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10"
           style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '100px 100px' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030407] to-[#030407]" />
      </div>

      
      <nav className={`fixed top-0 w-full z-40 transition-all duration-700 ${isScrolled ? 'bg-[#030407]/70 backdrop-blur-2xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <SikhyaLogo />
          
          <div className="hidden md:flex items-center gap-10 text-[13px] font-medium tracking-wide text-[#94A3B8]">
            <a href="#features" className="hover:text-white transition-colors duration-300">Platform</a>
            <a href="#curriculum" className="hover:text-white transition-colors duration-300">Curriculum</a>
            <a href="#architecture" className="hover:text-white transition-colors duration-300">Architecture</a>
            <a href="#faq" className="hover:text-white transition-colors duration-300">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button className="text-[13px] font-medium text-[#94A3B8] hover:text-white transition-colors">Log In</button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group px-6 py-2.5 bg-white text-[#030407] text-[13px] font-semibold rounded-full overflow-hidden transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              <span className="relative z-10">Start Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </div>

          <button className="md:hidden text-white z-50 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-[#030407]/95 backdrop-blur-3xl pt-28 px-6 md:hidden border-b border-white/10"
          >
            <div className="flex flex-col gap-8 text-2xl font-light text-[#94A3B8]">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Platform</a>
              <a href="#curriculum" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Curriculum</a>
              <a href="#architecture" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Architecture</a>
              <a href="#faq" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">FAQ</a>
              <hr className="border-white/5 my-2" />
              <button className="text-left hover:text-white transition-colors">Log In</button>
              <button className="bg-white text-black py-4 rounded-xl font-medium text-center text-lg mt-4">Start Learning Free</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        
        
        <section className="min-h-[100svh] flex items-center pt-32 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full relative z-10">
            
            {/* Left Content (Spans 5 cols) */}
            <motion.div style={{ y: heroY, opacity }} className="flex flex-col gap-8 lg:col-span-5 relative z-20">
              
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-40"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]"></span>
                  </span>
                  <span className="text-[#94A3B8] text-[11px] tracking-widest font-medium uppercase font-mono">ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ • Namaste</span>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-light tracking-tighter text-white leading-[1.05]">
                  Learning <br/>
                  <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-[#64748B]">without limits.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-lg md:text-xl text-[#94A3B8] leading-relaxed font-light max-w-lg">
                  A premium AI teacher that helps students learn, practice, and grow — bridging the gap regardless of resources.
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex items-center gap-3 text-sm text-[#64748B] pb-2 border-l-2 border-white/10 pl-4">
                  <Globe2 size={16} className="text-[#F59E0B]" />
                  <span>Syllabus-aligned support for Punjabi, Hindi, and English.</span>
                </div>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white text-[#030407] font-semibold rounded-full flex items-center justify-center gap-2 group shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] transition-all"
                  >
                    Start Learning Free
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className="px-8 py-4 border border-white/10 text-white font-medium rounded-full flex items-center justify-center gap-2 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  >
                    View Architecture
                  </motion.button>
                </div>
              </FadeIn>
            </motion.div>


            {/* Right Interactive Desk (Spans 7 cols) */}
            <div className="lg:col-span-7 relative h-[500px] md:h-[650px] w-full perspective-1000 mt-10 lg:mt-0">
              <FadeIn delay={0.6} direction="left" className="w-full h-full relative">
                
                {/* Main Glass Document Interface */}
                <div className="absolute inset-0 md:inset-y-0 md:left-12 md:right-[-2rem] bg-[#0A0C10]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col transform md:rotate-y-[-5deg] md:rotate-x-[2deg] transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0">
                  
                  {/* MacOS Style Top Bar */}
                  <div className="h-12 border-b border-white/5 flex items-center px-4 gap-4 bg-white/[0.01]">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/10 border border-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10 border border-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10 border border-white/10" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 bg-black/40 rounded-full text-[10px] uppercase tracking-widest text-[#64748B] border border-white/5 flex items-center gap-2 shadow-inner">
                        <Sparkles size={10} className="text-[#F59E0B]" />
                        Sikhya Guided Session
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 md:p-10 flex-1 flex flex-col gap-6 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeDemo}
                        initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-6 h-full"
                      >
                        {/* Chapter Context Pill */}
                        <div className="flex items-center gap-2 text-[11px] text-[#F59E0B] font-medium tracking-widest uppercase mb-2">
                          <Compass size={14} />
                          {demoExamples[activeDemo].chapter}
                        </div>

                        {/* Student Query */}
                        <div className="text-2xl md:text-3xl font-light text-white leading-[1.2] tracking-tight">
                          {demoExamples[activeDemo].question}
                        </div>

                        <div className="w-12 h-[1px] bg-white/10 my-2" />

                        {/* AI Response (Simulated Structure) */}
                        <div className="relative text-[#94A3B8] text-[15px] md:text-base leading-relaxed whitespace-pre-wrap font-light">
                          {demoExamples[activeDemo].answer}
                        </div>

                        {/* Meta Tags - Clean chips */}
                        <div className="mt-auto pt-6 flex flex-wrap gap-2">
                          {demoExamples[activeDemo].tags.map((tag, i) => (
                            <div key={i} className="px-3 py-1.5 border border-white/10 rounded-full text-[11px] text-[#64748B] flex items-center gap-1.5 bg-white/[0.02] shadow-sm">
                              <CheckCircle2 size={10} className="text-[#10B981]" />
                              {tag}
                            </div>
                          ))}
                        </div>

                        {/* Follow up suggestion */}
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                          className="mt-4 p-4 border border-white/5 bg-white/[0.02] rounded-xl flex items-center justify-between group cursor-none hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-center gap-3 text-sm text-[#94A3B8]">
                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                              <Search size={12} className="text-white" />
                            </div>
                            <span className="font-light">{demoExamples[activeDemo].followUp}</span>
                          </div>
                          <ChevronRight size={14} className="text-[#64748B] group-hover:text-white transition-colors" />
                        </motion.div>

                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Floating Elements / UI Depth */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-4 top-24 w-56 p-4 bg-[#0A0C10]/90 border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl hidden lg:block"
                >
                  <div className="flex items-center gap-2 text-[10px] text-[#94A3B8] uppercase tracking-widest mb-3 font-mono">
                    <Database size={12} className="text-[#3B82F6]"/>
                    Vector DB Fetch
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3B82F6] w-[94%] rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                      <span>Source: NCERT_Ch6.pdf</span>
                      <span className="text-[#10B981]">94% Match</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute left-0 bottom-20 p-4 bg-[#0A0C10]/90 border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl hidden md:flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 flex items-center justify-center">
                    <Activity size={16} className="text-[#10B981]" />
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">Knowledge Graph</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">Updated node connections</div>
                  </div>
                </motion.div>

              </FadeIn>
            </div>
          </div>
        </section>

        
        <section className="border-y border-white/5 bg-white/[0.01] backdrop-blur-md relative z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-between md:justify-around items-center gap-6 text-[11px] font-medium tracking-[0.2em] text-[#64748B] uppercase font-mono relative z-10">
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Key size={14} /> Board-Aware Learning</span>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/10" />
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Globe2 size={14} /> Trilingual Native</span>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/10" />
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Layers size={14} /> Contextual Engine</span>
            <span className="hidden lg:inline-block w-1 h-1 rounded-full bg-white/10" />
            <span className="hidden lg:flex items-center gap-2 hover:text-white transition-colors cursor-default"><BookMarked size={14} /> PYQ Integrated</span>
          </div>
        </section>

        
        <section className="py-32 md:py-48 px-6 md:px-12 max-w-5xl mx-auto text-center border-b border-white/5 relative">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col items-center gap-12 relative z-10">
            <FadeIn>
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center shadow-inner">
                <AlertCircle size={20} className="text-[#64748B]" />
              </div>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight max-w-4xl mx-auto">
                Generic AI was built for developers. <br/>
                <span className="text-[#64748B]">It isn't built for schools.</span>
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-[#94A3B8] font-light leading-relaxed max-w-3xl mx-auto">
                When a 10th-grade student asks a general AI about electricity, they receive college-level physics explanations that confuse more than they help. Furthermore, generic models don't know what is actually going to be on the board exam.
              </p>
            </FadeIn>

            <FadeIn delay={0.3} fullWidth>
              <div className="p-8 md:p-10 bg-white/[0.02] border border-white/10 rounded-2xl w-full text-left mt-8 flex flex-col md:flex-row items-center gap-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm">
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-2 text-[#F59E0B] font-medium text-[11px] tracking-widest uppercase font-mono">
                    <CheckCircle2 size={14} />
                    The Sikhya Solution
                  </div>
                  <h3 className="text-3xl font-light text-white tracking-tight">Strictly Bound to the Syllabus</h3>
                  <p className="text-[#94A3B8] text-base leading-relaxed font-light">
                    Sikhya operates under strict RAG guardrails. Before answering a question, it identifies the student's grade and board, retrieves the exact textbook chapter, and forces the AI to explain the concept *only* using vocabulary found in that specific material.
                  </p>
                </div>
                <div className="w-full md:w-[40%] bg-[#030407] border border-white/10 rounded-xl p-6 font-mono text-[11px] text-[#64748B] leading-relaxed shadow-inner">
                  <span className="text-[#10B981]">{"// System Prompt Directive"}</span><br/><br/>
                  <span className="text-[#94A3B8]">"You are a Class 10 Science teacher. The student is asking about Refraction. Answer ONLY using concepts found in NCERT Chapter 10. Do not introduce Snell's Law unless explicitly mentioned in the text. Output in natural Punjabi."</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>


        <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">Engineered for <br/>deep comprehension.</h2>
              <p className="text-[#94A3B8] text-lg max-w-xl font-light leading-relaxed">Providing the exact structured context that generic chat models completely lack.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Bento Block 1: Large Span */}
            <FadeIn delay={0.1} className="md:col-span-2">
              <div className="h-full p-10 bg-white/[0.02] border border-white/10 rounded-3xl relative overflow-hidden group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.04] transition-colors duration-500">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#3B82F6]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                  <Layers className="text-white" size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light text-white mb-4 tracking-tight">Chapter-Aware Explanations</h3>
                <p className="text-[#94A3B8] text-base leading-relaxed font-light max-w-md">Answers are dynamically scoped to the student's current chapter and syllabus guidelines, preventing confusing out-of-bounds information and ensuring relevance.</p>
              </div>
            </FadeIn>

            {/* Bento Block 2 */}
            <FadeIn delay={0.2} className="md:col-span-1">
              <div className="h-full p-10 bg-white/[0.02] border border-white/10 rounded-3xl relative overflow-hidden group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.04] transition-colors duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                  <BookMarked className="text-white" size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light text-white mb-4 tracking-tight">PYQ Mapping</h3>
                <p className="text-[#94A3B8] text-base leading-relaxed font-light">Automatically connects concepts to past board exam questions to build exam readiness.</p>
              </div>
            </FadeIn>

            {/* Bento Block 3 */}
            <FadeIn delay={0.3} className="md:col-span-1">
              <div className="h-full p-10 bg-white/[0.02] border border-white/10 rounded-3xl relative overflow-hidden group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.04] transition-colors duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                  <GitBranch className="text-white" size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light text-white mb-4 tracking-tight">Guided Paths</h3>
                <p className="text-[#94A3B8] text-base leading-relaxed font-light">Identifies weak concepts through interactions and suggests targeted follow-ups.</p>
              </div>
            </FadeIn>

            {/* Bento Block 4: Large Span */}
            <FadeIn delay={0.4} className="md:col-span-2">
              <div className="h-full p-10 bg-white/[0.02] border border-white/10 rounded-3xl relative overflow-hidden group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.04] transition-colors duration-500">
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#10B981]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                  <FileText className="text-white" size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light text-white mb-4 tracking-tight">Source-Linked Output</h3>
                <p className="text-[#94A3B8] text-base leading-relaxed font-light max-w-md">Every major claim or explanation is cited back to the specific textbook page or official study material for absolute verification, eliminating hallucinations.</p>
              </div>
            </FadeIn>

          </div>
        </section>


        <section className="py-32 border-t border-white/5 bg-[#050508] relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.02] to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <FadeIn>
              <div className="mb-20 text-center">
                <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">Three pillars of mastery.</h2>
                <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto font-light leading-relaxed">Sikhya doesn't just answer questions. It provides a structured environment for the three phases of exam preparation.</p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <FadeIn delay={0.1}>
                <div className="bg-transparent border border-white/10 rounded-3xl p-10 flex flex-col gap-8 hover:bg-white/[0.02] transition-colors duration-500 h-full">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shadow-inner">
                    <MessageSquare size={20} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-white mb-4 tracking-tight">1. Concept Clarity</h3>
                    <p className="text-[#94A3B8] text-base leading-relaxed font-light">Ask any question in plain Punjabi or Hindi. Sikhya breaks down complex topics into simple, step-by-step analogies appropriate for the student's grade level.</p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="bg-transparent border border-white/10 rounded-3xl p-10 flex flex-col gap-8 hover:bg-white/[0.02] transition-colors duration-500 h-full">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shadow-inner">
                    <History size={20} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-white mb-4 tracking-tight">2. PYQ Practice</h3>
                    <p className="text-[#94A3B8] text-base leading-relaxed font-light">Test knowledge against actual previous year board questions. Sikhya grades the student's answer based on the official marking scheme.</p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="bg-transparent border border-white/10 rounded-3xl p-10 flex flex-col gap-8 hover:bg-white/[0.02] transition-colors duration-500 h-full">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shadow-inner">
                    <Target size={20} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-white mb-4 tracking-tight">3. Weakness Targeting</h3>
                    <p className="text-[#94A3B8] text-base leading-relaxed font-light">As students interact, Sikhya builds a knowledge graph. Before exams, it automatically generates a revision path targeting their weakest chapters.</p>
                  </div>
                </div>
              </FadeIn>

            </div>
          </div>
        </section>


        <section id="curriculum" className="py-32 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">Board Coverage</h2>
                  <p className="text-[#94A3B8] text-lg max-w-xl font-light">Currently optimized with full context for Class 10 Punjab School Education Board (PSEB) and CBSE.</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-medium tracking-widest uppercase font-mono bg-white/[0.02] border border-white/10 px-5 py-2.5 rounded-full shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Database Live
                </div>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {curriculumData.map((item, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="border border-white/10 bg-white/[0.01] p-8 rounded-2xl flex flex-col gap-6 hover:bg-white/[0.03] transition-colors duration-300">
                    <div className="flex justify-between items-start">
                      <BookA size={20} className="text-white/40" strokeWidth={1.5} />
                      <span className={`text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full border ${item.status === 'Live' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-white/5 text-white/50 border-white/10'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <div className="font-light text-lg text-white mb-3 tracking-wide">{item.subject}</div>
                      <div className="text-[12px] text-[#64748B] flex flex-col gap-2">
                        <span className="flex items-center gap-2"><Check size={12} className="text-white/30"/> {item.chapters} Chapters</span>
                        <span className="flex items-center gap-2"><Check size={12} className="text-white/30"/> {item.pyq} PYQ Data</span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>


        <section id="architecture" className="py-32 border-y border-white/5 bg-[#030407] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-white/[0.02] to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <FadeIn>
              <div className="mb-24 text-center">
                <div className="inline-block px-4 py-1.5 border border-white/10 rounded-full bg-white/[0.02] text-[10px] text-[#94A3B8] tracking-[0.2em] uppercase font-mono mb-6 shadow-inner">System Architecture</div>
                <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">How Sikhya Works</h2>
                <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto font-light leading-relaxed">A transparent look at the retrieval pipeline, contextual ranking, and guided generation engine.</p>
              </div>
            </FadeIn>

            {/* Technical Diagram Container - Blueprint Aesthetic */}
            <FadeIn delay={0.2} fullWidth>
              <div className="relative w-full overflow-x-auto pb-8 hide-scrollbar">
                <div className="min-w-[900px] max-w-5xl mx-auto bg-transparent border border-white/10 rounded-3xl p-12 md:p-16 relative shadow-[inset_0_0_100px_rgba(255,255,255,0.02)]">
                  
                  {/* Grid Background for Blueprint feel */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                  <div className="flex flex-col gap-20 relative z-10">
                    
                    {/* Animated Data Flow SVG */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                      <path d="M 160 50 L 380 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                      <path d="M 440 50 L 680 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                      
                      <path d="M 160 210 L 380 210" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                      <path d="M 440 210 L 680 210" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                      
                      <path d="M 410 50 L 410 210" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      
                      {/* Animated packets */}
                      <circle cx="270" cy="50" r="2" fill="#F59E0B">
                        <animate attributeName="cx" values="160;380" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="560" cy="210" r="2" fill="#3B82F6">
                        <animate attributeName="cx" values="680;440" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
                      </circle>
                    </svg>

                    {/* Top Row: User -> Inference */}
                    <div className="flex justify-between items-center relative gap-4">
                      
                      {/* Node 1 */}
                      <div className="w-[180px] flex flex-col items-center text-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white">
                          <Activity size={18} strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="text-[13px] text-white font-medium tracking-wide">Client App</div>
                          <div className="text-[10px] text-[#64748B] font-mono mt-1">Next.js Edge</div>
                        </div>
                      </div>

                      {/* Node 2 */}
                      <div className="w-[180px] flex flex-col items-center text-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md relative">
                        <div className="absolute inset-0 bg-[#F59E0B]/5 rounded-2xl blur-xl" />
                        <div className="w-12 h-12 border border-[#F59E0B]/30 rounded-full flex items-center justify-center text-[#F59E0B] bg-[#F59E0B]/5 relative z-10">
                          <Cpu size={18} strokeWidth={1.5} />
                        </div>
                        <div className="relative z-10">
                          <div className="text-[13px] text-white font-medium tracking-wide">Router API</div>
                          <div className="text-[10px] text-[#64748B] font-mono mt-1">FastAPI / Python</div>
                        </div>
                      </div>

                      {/* Node 3 */}
                      <div className="w-[180px] flex flex-col items-center text-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white">
                          <Layers size={18} strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="text-[13px] text-white font-medium tracking-wide">Generation</div>
                          <div className="text-[10px] text-[#64748B] font-mono mt-1">Constrained LLM</div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Row: Data Ingestion & Retrieval */}
                    <div className="flex justify-between items-center relative gap-4">
                      
                      {/* Node 4 */}
                      <div className="w-[180px] flex flex-col items-center text-center gap-4 bg-transparent p-6 opacity-60">
                        <div className="w-10 h-10 border border-dashed border-white/20 rounded-full flex items-center justify-center text-[#94A3B8]">
                          <FileText size={16} strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="text-[12px] text-white font-light tracking-wide">Ingestion</div>
                          <div className="text-[9px] text-[#64748B] font-mono mt-1">Chunk & Embed</div>
                        </div>
                      </div>

                      {/* Node 5 */}
                      <div className="w-[180px] flex flex-col items-center text-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md relative">
                        <div className="absolute inset-0 bg-[#3B82F6]/5 rounded-2xl blur-xl" />
                        <div className="w-12 h-12 border border-[#3B82F6]/30 rounded-full flex items-center justify-center text-[#3B82F6] bg-[#3B82F6]/5 relative z-10">
                          <Database size={18} strokeWidth={1.5} />
                        </div>
                        <div className="relative z-10">
                          <div className="text-[13px] text-white font-medium tracking-wide">Vector DB</div>
                          <div className="text-[10px] text-[#64748B] font-mono mt-1">Similarity Search</div>
                        </div>
                      </div>

                      {/* Node 6 */}
                      <div className="w-[180px] flex flex-col items-center text-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white">
                          <Search size={18} strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className="text-[13px] text-white font-medium tracking-wide">Reranker</div>
                          <div className="text-[10px] text-[#64748B] font-mono mt-1">Cross-Encoder</div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>


        <section id="faq" className="py-32 px-6 md:px-12 max-w-4xl mx-auto border-t border-white/5">
          <FadeIn>
            <div className="mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-[#94A3B8] text-lg font-light">Technical and practical details about the platform.</p>
            </div>
          </FadeIn>
          
          <div className="flex flex-col border-t border-white/5">
            {faqs.map((faq, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <FaqItem 
                  q={faq.q} 
                  a={faq.a} 
                  isOpen={openFaq === index} 
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)} 
                />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* MISSION STATEMENT (Editorial / Sincere) */}
        <section id="mission" className="py-40 px-6 md:px-12 max-w-5xl mx-auto text-center relative border-t border-white/5">
          <FadeIn>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.02] to-transparent pointer-events-none rounded-full" />
            
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-light text-white leading-[1.2] mb-12 tracking-tight">
              Education should not depend on money or opportunity. <br/><span className="text-[#64748B]">Every student deserves a teacher who never gets tired.</span>
            </h2>
            <div className="w-12 h-[1px] bg-white/20 mx-auto" />
          </FadeIn>
        </section>


        {/* FINAL CTA */}
        <section className="py-32 border-t border-white/5 bg-[#030407] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-10 tracking-tight">Ready to start learning?</h2>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-5 bg-white text-[#030407] text-lg font-semibold rounded-full inline-flex items-center gap-3 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
              >
                Start Learning Free
                <ArrowRight size={20} />
              </motion.button>
            </FadeIn>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-16 px-6 md:px-12 bg-[#020202] relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-3 items-center md:items-start">
            <SikhyaLogo />
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#64748B] mt-2">© {new Date().getFullYear()} Sikhya Core System.</p>
          </div>
          
          <div className="flex gap-8 text-[12px] text-[#64748B] font-light tracking-wide">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Engineering</a>
          </div>
        </div>
      </footer>

      {/* Hide scrollbar styles for architecture container */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html {
          scroll-behavior: smooth;
        }
      `}} />
    </div>
  );
}