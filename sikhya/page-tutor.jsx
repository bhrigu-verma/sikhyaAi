const { useState, useEffect, useRef, useMemo } = React;
// AI Tutor — minimal chat interface with mode selector + sources panel
function PageTutor({ navigate }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('simple');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'user', text: "Explain Newton's Third Law in simple terms." },
    { id: 2, role: 'ai', text: "Newton's Third Law says: **for every action, there's an equal and opposite reaction**.\n\nWhen you push something, it pushes you back with the same force.\n\n**Quick examples:**\n• 🚀 A rocket pushes gases down — gases push the rocket up\n• 🏊 You push water back — water pushes you forward\n• 🚶 Your foot pushes the ground back — ground pushes you forward\n\nBoth forces are equal in size, opposite in direction, and act on **different objects**.",
      sources: [
        { title: 'Ch. 9 — Force & Laws of Motion', sub: 'Science · Class 9 · Page 121' },
        { title: 'PSEB Board 2023 — Q.7', sub: 'Previous Year Paper' },
      ]
    },
  ]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const MODES = [
    { id: 'simple', label: 'Simple',    sub: 'Easy explanations' },
    { id: 'exam',   label: 'Exam',      sub: 'Board-ready answers' },
    { id: 'deep',   label: 'In-depth',  sub: 'Theory + examples' },
  ];

  const send = () => {
    if (!input.trim() || loading) return;
    const user = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, user]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai',
        text: "Great question. Based on your PSEB Class 10 syllabus:\n\n**Core concept:** The key idea connects fundamental principles to applied problems you'll see on the board exam.\n\n**Step-by-step:**\n1. Identify the given quantities\n2. Pick the right formula\n3. Substitute and solve\n4. Check units\n\nWould you like me to walk through a sample problem?",
        sources: [{ title: 'PSEB Class 10 syllabus', sub: 'Mapped curriculum' }]
      }]);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="page-enter" style={{
      display: 'grid', gridTemplateColumns: '240px 1fr',
      height: 'calc(100vh - 60px)', overflow: 'hidden',
    }}>
      <style>{`@media (max-width: 900px) { .tutor-grid { grid-template-columns: 1fr !important; } .tutor-side { display: none !important; } }`}</style>

      {/* Conversations sidebar */}
      <aside className="tutor-side" style={{
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ padding: 16 }}>
          <Button variant="outline" size="sm" icon="plus" full>New chat</Button>
        </div>
        <div style={{
          fontSize: 10.5, fontWeight: 600, color: 'var(--muted)',
          textTransform: 'uppercase', letterSpacing: '.08em',
          padding: '0 16px 6px',
        }}>Recent</div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
          {[
            { t: "Newton's Laws of Motion", s: 'Science', when: '2h ago', active: true },
            { t: 'Quadratic Equations',      s: 'Math',    when: 'Yesterday' },
            { t: 'French Revolution',        s: 'SST',     when: '2 days ago' },
            { t: 'Photosynthesis',            s: 'Science', when: '3 days ago' },
            { t: 'Trigonometry basics',       s: 'Math',    when: '5 days ago' },
          ].map((c, i) => (
            <button key={i} className="focus-ring" style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '9px 10px', marginBottom: 2,
              background: c.active ? 'var(--subtle)' : 'transparent',
              border: '1px solid ' + (c.active ? 'var(--border)' : 'transparent'),
              borderRadius: 8, cursor: 'pointer',
              transition: 'all .15s', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if(!c.active) e.currentTarget.style.background = 'var(--subtle)'; }}
            onMouseLeave={e => { if(!c.active) e.currentTarget.style.background = 'transparent'; }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.t}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--muted)' }}>
                <span>{c.s}</span><span>{c.when}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main chat */}
      <div className="tutor-grid" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Mode tabs */}
        <div style={{
          padding: '12px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)',
        }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} className="focus-ring" style={{
              padding: '5px 12px', borderRadius: 7,
              background: mode === m.id ? 'var(--accent-soft)' : 'transparent',
              border: '1px solid ' + (mode === m.id ? 'var(--accent-ring)' : 'transparent'),
              color: mode === m.id ? 'var(--accent)' : 'var(--text-2)',
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all .18s',
            }}>{m.label}</button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
            <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-2)' }} />
            Sikhya AI · Connected
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{
          flex: 1, overflowY: 'auto', padding: '32px 24px',
        }}>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
            {messages.map(m => <ChatMessage key={m.id} msg={m} />)}
            {loading && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <AvatarAI />
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  padding: '14px 18px', borderRadius: '4px 16px 16px 16px',
                  boxShadow: 'var(--shadow-1)',
                }}>
                  <TypingDots />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <ChatInput value={input} onChange={setInput} onSend={send} disabled={loading} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
              <span><Kbd>↵</Kbd> send</span>
              <span><Kbd>⇧</Kbd>+<Kbd>↵</Kbd> new line</span>
              <span>Mode: <strong style={{ color: 'var(--accent)' }}>{MODES.find(m => m.id === mode).label}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ msg }) {
  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          background: 'var(--accent)', color: '#fff',
          padding: '12px 16px', borderRadius: '16px 16px 4px 16px',
          fontSize: 14, lineHeight: 1.55, maxWidth: '75%',
          boxShadow: '0 2px 8px var(--accent-ring)',
        }}>{msg.text}</div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <AvatarAI />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '14px 18px', borderRadius: '4px 16px 16px 16px',
          fontSize: 14, color: 'var(--text)', lineHeight: 1.65,
          boxShadow: 'var(--shadow-1)',
        }}>
          {formatRich(msg.text)}
        </div>
        {msg.sources && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {msg.sources.map((s, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '7px 12px',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 8, fontSize: 11.5,
                color: 'var(--text-2)', cursor: 'pointer',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
                <Icon name="book" size={12} />
                <strong style={{ fontWeight: 600 }}>{s.title}</strong>
                <span style={{ color: 'var(--muted)' }}>· {s.sub}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AvatarAI() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 10,
      background: 'var(--gradient)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, boxShadow: 'var(--glow)',
    }}>
      <Icon name="sparkles" size={15} />
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)',
          animation: `bounce-d 1.4s ease-in-out ${i*0.18}s infinite`,
        }} />
      ))}
      <style>{`@keyframes bounce-d { 0%, 60%, 100% { transform: translateY(0); opacity: .4; } 30% { transform: translateY(-4px); opacity: 1; } }`}</style>
    </div>
  );
}

function ChatInput({ value, onChange, onSend, disabled }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 8,
      padding: 10,
      background: 'var(--surface-2)',
      border: '1.5px solid ' + (focus ? 'var(--accent)' : 'var(--border)'),
      borderRadius: 14,
      boxShadow: focus ? '0 0 0 3px var(--accent-ring)' : 'none',
      transition: 'all .2s',
    }}>
      <IconBtn name="paperclip" />
      <IconBtn name="image" />
      <IconBtn name="mic" />
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        rows={1}
        placeholder="Ask anything in English, Hindi, or Punjabi…"
        style={{
          flex: 1, background: 'transparent', border: 'none',
          padding: '8px 4px', resize: 'none', minHeight: 24, maxHeight: 120,
          fontSize: 14, color: 'var(--text)', lineHeight: 1.5,
          fontFamily: 'inherit',
        }}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="focus-ring"
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: value.trim() && !disabled ? 'var(--gradient)' : 'var(--border)',
          color: '#fff', border: 'none', cursor: value.trim() && !disabled ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all .2s',
          boxShadow: value.trim() && !disabled ? '0 4px 16px var(--accent-ring)' : 'none',
        }}>
        <Icon name="send" size={15} />
      </button>
    </div>
  );
}

function IconBtn({ name }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="focus-ring"
      style={{
        width: 32, height: 32,
        background: hov ? 'var(--subtle)' : 'transparent',
        border: 'none', cursor: 'pointer',
        color: hov ? 'var(--text)' : 'var(--muted)',
        borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all .15s',
      }}>
      <Icon name={name} size={16} />
    </button>
  );
}

function formatRich(text) {
  return text.split('\n').map((line, i) => {
    const html = line.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:600;color:var(--text)">$1</strong>');
    return <div key={i} style={{ marginBottom: line === '' ? 8 : 0, minHeight: line === '' ? 4 : undefined }} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

window.PageTutor = PageTutor;
