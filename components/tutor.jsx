// AI TUTOR PAGE — Three-panel chat interface
const { useState, useEffect, useRef } = React;

const MODES = [
  { id:'simple',  label:'Explain Simply', desc:'Easy, step-by-step explanations' },
  { id:'exam',    label:'Exam Mode',      desc:'Focused on board exam answers' },
  { id:'detail',  label:'Detailed',       desc:'In-depth with examples & theory' },
];

const SAVED_CHATS = [
  { id:1, title:"Newton's Laws of Motion", subject:'Science', time:'2h ago', active:true },
  { id:2, title:'Quadratic Equations',     subject:'Math',    time:'Yesterday' },
  { id:3, title:'French Revolution',       subject:'SST',     time:'2 days ago' },
  { id:4, title:'Photosynthesis Process',  subject:'Science', time:'3 days ago' },
  { id:5, title:'Trigonometry Basics',     subject:'Math',    time:'5 days ago' },
];

const SOURCE_CARDS = [
  { title:'Chapter 9 — Force & Laws of Motion', subject:'Science · Class 9', icon:'📘' },
  { title:'PSEB Board Exam 2023 — Q.7',         subject:'Previous Paper', icon:'📋' },
];

const INIT_MESSAGES = [
  { id:1, role:'user', text:"Explain Newton's Third Law of Motion with a real-life example." },
  {
    id:2, role:'ai',
    text:"Newton's Third Law states: **for every action, there is an equal and opposite reaction.**\n\nThis means whenever one object exerts a force on another, the second object exerts an equal force back in the opposite direction.\n\n**Real-life examples:**\n• 🚀 Rocket launch — Hot gases push downward (action), rocket shoots upward (reaction)\n• 🏊 Swimming — You push water backward, water pushes you forward\n• 🚶 Walking — You push the ground backward, ground pushes you forward\n\nThe key thing to remember: both forces are **equal in magnitude** but **opposite in direction**, and they act on **different objects**.",
    chips: ['Physics Ch.9', 'Class 9 PSEB', 'Newton\'s Laws'],
  },
];

function formatText(text) {
  const parts = text.split('\n');
  return parts.map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div key={i} style={{ marginBottom: line === '' ? 8 : 2 }} dangerouslySetInnerHTML={{ __html: bold }} />;
  });
}

function TypingDots() {
  return (
    <div style={{ display:'flex',gap:4,alignItems:'center',padding:'4px 0' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:7,height:7,background:'#94A3B8',borderRadius:'50%',
          animation:`tydot 1.4s ease-in-out ${i*0.2}s infinite` }} />
      ))}
      <style>{`@keyframes tydot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
    </div>
  );
}

function Tutor({ navigate }) {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('simple');
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  const [showRight, setShowRight] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const AI_RESPONSES = {
    default: "That's a great question! Let me explain this clearly.\n\nBased on the PSEB Class 10 curriculum, this topic is covered in depth. Here's what you need to know:\n\n**Key concept:** The fundamental principle here relates to how energy and matter interact at a molecular level.\n\n**Important points:**\n• Study the definitions carefully for board exams\n• Practice the numerical problems from past papers\n• Connect concepts to real-world applications\n\nWould you like me to explain any specific part in more detail?",
  };

  const scrollToBottom = () => {
    if (bottomRef.current) bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1, role: 'ai',
        text: AI_RESPONSES.default,
        chips: ['Related Chapter', 'PSEB Syllabus'],
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 1600);
  };

  const S = {
    page:    { display:'flex',height:'calc(100vh - 60px)',background:'#F8FAFC',fontFamily:"'Sora',sans-serif",overflow:'hidden' },
    left:    { width:240,background:'#fff',borderRight:'1px solid #E2E8F0',display:'flex',flexDirection:'column',flexShrink:0 },
    center:  { flex:1,display:'flex',flexDirection:'column',overflow:'hidden' },
    right:   { width:280,background:'#fff',borderLeft:'1px solid #E2E8F0',display:'flex',flexDirection:'column',overflow:'auto',flexShrink:0 },
    lHead:   { padding:'16px',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'space-between' },
    lTitle:  { fontSize:13,fontWeight:700,color:'#0F172A' },
    newBtn:  { display:'flex',alignItems:'center',gap:5,padding:'5px 10px',background:'linear-gradient(135deg,#2563EB,#16A34A)',color:'#fff',border:'none',borderRadius:6,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:"'Sora',sans-serif" },
    chatList:{ flex:1,overflow:'auto',padding:8 },
    chatItem:(act) => ({ padding:'10px 12px',borderRadius:8,cursor:'pointer',marginBottom:3,background: act?'#EFF6FF':'none',border: act?'1px solid #BFDBFE':'1px solid transparent',transition:'all .18s' }),
    chatTitle:{ fontSize:12.5,fontWeight:600,color:'#0F172A',marginBottom:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' },
    chatMeta: { display:'flex',justifyContent:'space-between',alignItems:'center' },
    chatSub:  { fontSize:11,color:'#64748B' },
    chatTime: { fontSize:10,color:'#94A3B8' },
    msgArea: { flex:1,overflow:'auto',padding:'24px 28px',display:'flex',flexDirection:'column',gap:18 },
    modeTabs:{ display:'flex',gap:6,padding:'12px 16px',borderBottom:'1px solid #E2E8F0',background:'#fff' },
    modeTab: (act) => ({ padding:'6px 14px',borderRadius:6,fontSize:12,fontWeight:600,border:'1.5px solid',borderColor: act?'#2563EB':'#E2E8F0',background: act?'#EFF6FF':'none',color: act?'#2563EB':'#94A3B8',cursor:'pointer',fontFamily:"'Sora',sans-serif",transition:'all .2s' }),
    userMsg: { display:'flex',justifyContent:'flex-end' },
    userBub: { background:'#2563EB',color:'#fff',padding:'12px 16px',borderRadius:'16px 16px 4px 16px',fontSize:14,maxWidth:460,lineHeight:1.6 },
    aiRow:   { display:'flex',gap:10,alignItems:'flex-start' },
    aiIco:   { width:30,height:30,background:'linear-gradient(135deg,#2563EB,#16A34A)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:800,flexShrink:0 },
    aiBub:   { background:'#fff',border:'1px solid #E2E8F0',padding:'13px 16px',borderRadius:'4px 16px 16px 16px',fontSize:14,color:'#0F172A',maxWidth:560,lineHeight:1.7,boxShadow:'0 1px 4px rgba(15,23,42,.04)' },
    chips:   { display:'flex',gap:6,marginTop:10,flexWrap:'wrap' },
    chip:    { padding:'3px 10px',borderRadius:999,fontSize:11,fontWeight:500,background:'#EFF6FF',color:'#2563EB',border:'1px solid #BFDBFE' },
    inputWrap:{ padding:'14px 20px',background:'#fff',borderTop:'1px solid #E2E8F0' },
    inputBox:{ display:'flex',alignItems:'flex-end',gap:10,background:'#F8FAFC',border:'1.5px solid #E2E8F0',borderRadius:14,padding:'10px 14px',transition:'border-color .2s,box-shadow .2s' },
    textarea:{ flex:1,background:'none',border:'none',fontFamily:"'Sora',sans-serif",fontSize:14,color:'#0F172A',resize:'none',outline:'none',lineHeight:1.6,maxHeight:120,minHeight:22 },
    iconBtn: { width:32,height:32,background:'none',border:'none',cursor:'pointer',color:'#94A3B8',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6,flexShrink:0,transition:'color .2s' },
    sendBtn: { width:38,height:38,background:'linear-gradient(135deg,#2563EB,#16A34A)',border:'none',borderRadius:10,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',flexShrink:0,transition:'all .2s',boxShadow:'0 2px 8px rgba(37,99,235,.2)' },
    rHead:   { padding:'16px',borderBottom:'1px solid #E2E8F0' },
    rTitle:  { fontSize:12,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:'.07em' },
    rCard:   { margin:'12px 12px 0',padding:12,background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:10,cursor:'pointer',transition:'all .2s' },
    rCardT:  { fontSize:13,fontWeight:600,color:'#0F172A',marginBottom:3 },
    rCardS:  { fontSize:11,color:'#64748B' },
    rSection:{ padding:'16px 12px 0' },
    rSecH:   { fontSize:12,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:10 },
    keyTag:  { display:'inline-block',padding:'4px 10px',background:'#F5F3FF',color:'#7C3AED',border:'1px solid rgba(124,58,237,.15)',borderRadius:999,fontSize:12,fontWeight:500,margin:'0 4px 6px 0' },
  };

  return (
    <div style={S.page}>
      {/* LEFT — Chat history */}
      <div style={S.left}>
        <div style={S.lHead}>
          <span style={S.lTitle}>Conversations</span>
          <button style={S.newBtn}><Icon name="plus" size={11} />New</button>
        </div>
        <div style={S.chatList}>
          {SAVED_CHATS.map(chat => (
            <div key={chat.id} style={S.chatItem(activeChat===chat.id)} onClick={() => setActiveChat(chat.id)}
              onMouseEnter={e=>{ if(activeChat!==chat.id) e.currentTarget.style.background='#F8FAFC'; }}
              onMouseLeave={e=>{ if(activeChat!==chat.id) e.currentTarget.style.background='none'; }}>
              <div style={S.chatTitle}>{chat.title}</div>
              <div style={S.chatMeta}>
                <span style={S.chatSub}>{chat.subject}</span>
                <span style={S.chatTime}>{chat.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:12,borderTop:'1px solid #E2E8F0' }}>
          <div style={{ fontSize:11,fontWeight:600,color:'#64748B',marginBottom:8 }}>QUICK TOPICS</div>
          {['Science','Math','English','SST'].map(s => (
            <div key={s} style={{ padding:'7px 10px',borderRadius:6,fontSize:12,fontWeight:500,color:'#64748B',cursor:'pointer',marginBottom:2 }}
              onMouseEnter={e=>{ e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.color='#0F172A'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=''; e.currentTarget.style.color='#64748B'; }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* CENTER — Main chat */}
      <div style={S.center}>
        <div style={S.modeTabs}>
          {MODES.map(m => (
            <button key={m.id} style={S.modeTab(mode===m.id)} onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
          <div style={{ marginLeft:'auto',display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#94A3B8' }}>
            <div style={{ width:6,height:6,background:'#16A34A',borderRadius:'50%' }}></div>
            Sikhya AI · Online
          </div>
        </div>

        <div style={S.msgArea} ref={bottomRef}>
          {messages.map(msg => (
            <div key={msg.id}>
              {msg.role === 'user' ? (
                <div style={S.userMsg}><div style={S.userBub}>{msg.text}</div></div>
              ) : (
                <div style={S.aiRow}>
                  <div style={S.aiIco}>S</div>
                  <div>
                    <div style={S.aiBub}>{formatText(msg.text)}</div>
                    {msg.chips && (
                      <div style={S.chips}>
                        {msg.chips.map(c => <span key={c} style={S.chip}>{c}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={S.aiRow}>
              <div style={S.aiIco}>S</div>
              <div style={S.aiBub}><TypingDots /></div>
            </div>
          )}
        </div>

        <div style={S.inputWrap}>
          <div style={S.inputBox} onFocus={e=>{ e.currentTarget.style.borderColor='#2563EB'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(37,99,235,.1)'; }} onBlur={e=>{ e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.boxShadow=''; }}>
            <button style={S.iconBtn} title="Voice input" onMouseEnter={e=>e.currentTarget.style.color='#2563EB'} onMouseLeave={e=>e.currentTarget.style.color='#94A3B8'}>
              <Icon name="mic" size={17} />
            </button>
            <button style={S.iconBtn} title="Upload file" onMouseEnter={e=>e.currentTarget.style.color='#2563EB'} onMouseLeave={e=>e.currentTarget.style.color='#94A3B8'}>
              <Icon name="upload" size={17} />
            </button>
            <button style={S.iconBtn} title="Upload image" onMouseEnter={e=>e.currentTarget.style.color='#2563EB'} onMouseLeave={e=>e.currentTarget.style.color='#94A3B8'}>
              <Icon name="image" size={17} />
            </button>
            <textarea
              ref={inputRef}
              style={S.textarea}
              placeholder="Ask anything about your syllabus..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              rows={1}
            />
            <button style={{...S.sendBtn, opacity: input.trim() ? 1 : 0.5}}
              onClick={sendMessage}
              onMouseEnter={e=>{ if(input.trim()) e.currentTarget.style.transform='scale(1.06)'; }}
              onMouseLeave={e=>e.currentTarget.style.transform=''}>
              <Icon name="send" size={15} />
            </button>
          </div>
          <div style={{ textAlign:'center',fontSize:11,color:'#94A3B8',marginTop:8 }}>
            Press <strong>Enter</strong> to send · <strong>Shift+Enter</strong> for new line · Mode: <strong style={{ color:'#2563EB' }}>{MODES.find(m=>m.id===mode)?.label}</strong>
          </div>
        </div>
      </div>

      {/* RIGHT — Context panel */}
      {showRight && (
        <div style={S.right}>
          <div style={S.rHead}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
              <div style={S.rTitle}>Sources & Context</div>
              <button style={{ background:'none',border:'none',cursor:'pointer',color:'#94A3B8',fontSize:18,lineHeight:1 }} onClick={() => setShowRight(false)}>×</button>
            </div>
          </div>

          <div style={{ padding:'10px 12px 0' }}>
            <div style={S.rSecH}>From Your Syllabus</div>
            {SOURCE_CARDS.map((src,i) => (
              <div key={i} style={S.rCard}
                onMouseEnter={e=>{ e.currentTarget.style.background='#EFF6FF'; e.currentTarget.style.borderColor='#BFDBFE'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.borderColor='#E2E8F0'; }}>
                <div style={{ fontSize:20,marginBottom:6 }}>{src.icon}</div>
                <div style={S.rCardT}>{src.title}</div>
                <div style={S.rCardS}>{src.subject}</div>
              </div>
            ))}
          </div>

          <div style={S.rSection}>
            <div style={S.rSecH}>Key Concepts</div>
            <div>
              {['Action-Reaction Pair','Newton\'s Third Law','Forces in Pairs','Equal & Opposite'].map(k => (
                <span key={k} style={S.keyTag}>{k}</span>
              ))}
            </div>
          </div>

          <div style={S.rSection}>
            <div style={S.rSecH}>Related Questions</div>
            <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
              {[
                'How does Newton\'s 3rd Law apply to rockets?',
                'Difference between Newton\'s 1st and 3rd Law?',
                'Give 5 examples of Newton\'s 3rd Law',
              ].map((q,i) => (
                <div key={i} style={{ padding:'9px 10px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:8,fontSize:12,color:'#475569',cursor:'pointer',transition:'all .2s' }}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='#EFF6FF'; e.currentTarget.style.color='#2563EB'; e.currentTarget.style.borderColor='#BFDBFE'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.color='#475569'; e.currentTarget.style.borderColor='#E2E8F0'; }}>
                  {q}
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...S.rSection,marginBottom:16 }}>
            <div style={S.rSecH}>Practice This Topic</div>
            <button onClick={() => navigate('practice')} style={{ width:'100%',padding:'10px',background:'linear-gradient(135deg,#2563EB,#16A34A)',color:'#fff',border:'none',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6 }}>
              <Icon name="pencil" size={14} />Start Practice →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Tutor });
