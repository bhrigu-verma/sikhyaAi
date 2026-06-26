// TESTS / MOCK EXAM PAGE
const { useState, useEffect, useRef } = React;

const TEST_QUESTIONS = [
  { id:1, text:'Which of the following best describes Newton\'s First Law?', opts:['Objects in motion slow down naturally','A body remains at rest or in uniform motion unless acted upon by a net force','Force equals mass times acceleration','For every action there is an equal and opposite reaction'], ans:1 },
  { id:2, text:'The SI unit of force is:', opts:['Joule','Watt','Newton','Pascal'], ans:2 },
  { id:3, text:'Which process converts glucose to energy in cells?', opts:['Photosynthesis','Cellular Respiration','Digestion','Transpiration'], ans:1 },
  { id:4, text:'The formula for the area of a circle is:', opts:['2πr','πr²','πd','2πr²'], ans:1 },
  { id:5, text:'What is the pH value of pure water?', opts:['0','7','14','10'], ans:1 },
  { id:6, text:'Light travels fastest through:', opts:['Water','Glass','Air','Vacuum'], ans:3 },
  { id:7, text:'Which gas is produced during photosynthesis?', opts:['Carbon Dioxide','Hydrogen','Oxygen','Nitrogen'], ans:2 },
  { id:8, text:'The roots of x² - 4 = 0 are:', opts:['x = 4','x = ±4','x = ±2','x = 2 only'], ans:2 },
  { id:9, text:'Ohm\'s Law states that V is proportional to:', opts:['R only','I only','IR','I/R'], ans:2 },
  { id:10, text:'Which planet is closest to the Sun?', opts:['Venus','Earth','Mercury','Mars'], ans:2 },
];

function Tests({ navigate }) {
  const [phase, setPhase]   = useState('setup'); // setup | test | results
  const [config, setConfig] = useState({ subject:'Science', count:10, difficulty:'Mixed', class:'10' });
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState({});
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const timerRef = useRef(null);

  const qs = TEST_QUESTIONS.slice(0, config.count);

  useEffect(() => {
    if (phase === 'test') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); submitTest(); return 0; } return t-1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const startTest = () => { setPhase('test'); setTimeLeft(config.count * 60); };
  const submitTest = () => { clearInterval(timerRef.current); setPhase('results'); };

  const selectAnswer = (i) => setSelected(i);
  const goNext = () => {
    if (selected !== null) setAnswers(a => ({...a,[current]:selected}));
    setSelected(answers[current+1] ?? null);
    setCurrent(c => Math.min(c+1, qs.length-1));
  };
  const goPrev = () => {
    if (selected !== null) setAnswers(a => ({...a,[current]:selected}));
    setSelected(answers[current-1] ?? null);
    setCurrent(c => Math.max(c-1,0));
  };
  const goTo = (i) => {
    if (selected !== null) setAnswers(a => ({...a,[current]:selected}));
    setSelected(answers[i] ?? null);
    setCurrent(i);
  };
  const saveAndSubmit = () => {
    if (selected !== null) setAnswers(a => ({...a,[current]:selected}));
    submitTest();
  };

  const correct  = qs.filter((q,i) => answers[i] === q.ans).length;
  const wrong    = qs.filter((q,i) => answers[i] !== undefined && answers[i] !== q.ans).length;
  const skipped  = qs.filter((_,i) => answers[i] === undefined).length;
  const pct      = Math.round((correct / qs.length) * 100);
  const grade    = pct>=90?'A+':pct>=75?'A':pct>=60?'B':pct>=45?'C':'D';
  const gradeCol = pct>=75?'#16A34A':pct>=45?'#B45309':'#DC2626';

  const mm = String(Math.floor(timeLeft/60)).padStart(2,'0');
  const ss = String(timeLeft%60).padStart(2,'0');
  const timePct = (timeLeft/(config.count*60))*100;
  const timeCol = timeLeft < 60 ? '#DC2626' : timeLeft < 180 ? '#B45309' : '#16A34A';

  const S = {
    page:  { padding:'28px 32px',minHeight:'calc(100vh - 60px)',background:'#F8FAFC',fontFamily:"'Sora',sans-serif",display:'flex',flexDirection:'column' },
    center:{ maxWidth:680,margin:'0 auto',width:'100%' },
    card:  { background:'#fff',border:'1px solid #E2E8F0',borderRadius:16,padding:'32px' },
    h:     { fontSize:24,fontWeight:800,color:'#0F172A',letterSpacing:'-.025em',marginBottom:8 },
    sub:   { fontSize:14,color:'#64748B',marginBottom:32 },
    grid:  { display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:32 },
    selLbl:{ fontSize:12,fontWeight:700,color:'#64748B',marginBottom:8 },
    selRow:{ display:'flex',gap:6,flexWrap:'wrap' },
    selBtn:(act,col) => ({ padding:'7px 14px',borderRadius:999,fontSize:13,fontWeight:act?700:500,border:'1.5px solid',borderColor:act?(col||'#2563EB'):'#E2E8F0',background:act?(col+'18'||'#EFF6FF'):'#fff',color:act?(col||'#2563EB'):'#64748B',cursor:'pointer',fontFamily:"'Sora',sans-serif",transition:'all .2s' }),
    startBtn:{ width:'100%',padding:'14px',background:'linear-gradient(135deg,#2563EB,#16A34A)',color:'#fff',border:'none',borderRadius:12,fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 16px rgba(37,99,235,.25)',transition:'all .2s' },
    // test phase
    testWrap:{ display:'grid',gridTemplateColumns:'1fr 200px',gap:20,height:'calc(100vh - 60px)',overflow:'hidden',padding:'20px 28px' },
    qCard:{ background:'#fff',border:'1px solid #E2E8F0',borderRadius:16,padding:'28px',display:'flex',flexDirection:'column',overflow:'auto' },
    timer:{ display:'flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:10,background: timePct<25?'#FFF1F2':'#F0FDF4',border:`1px solid ${timeCol}30`,marginBottom:20,justifyContent:'center' },
    timerN:{ fontSize:22,fontWeight:800,color:timeCol,letterSpacing:'-.02em' },
    qNum:{ fontSize:12,fontWeight:700,color:'#64748B',marginBottom:10 },
    qText:{ fontSize:17,fontWeight:600,color:'#0F172A',lineHeight:1.55,marginBottom:24,flex:1 },
    opt: (i,sel) => ({ display:'flex',alignItems:'center',gap:12,padding:'13px 16px',border:`1.5px solid ${sel===i?'#2563EB':'#E2E8F0'}`,borderRadius:10,background:sel===i?'#EFF6FF':'#F8FAFC',cursor:'pointer',marginBottom:10,transition:'all .2s',fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:500,color:sel===i?'#2563EB':'#0F172A' }),
    optL:{ width:24,height:24,borderRadius:'50%',background:'rgba(0,0,0,.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0 },
    navRow:{ display:'flex',gap:10,justifyContent:'space-between',marginTop:20 },
    navBtn:(p) => ({ padding:'10px 18px',borderRadius:9,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:600,cursor:'pointer',border:'1.5px solid #E2E8F0',background:'#F8FAFC',color:'#64748B',transition:'all .2s',opacity:p?1:0.4,pointerEvents:p?'auto':'none' }),
    subBtn:{ padding:'10px 18px',borderRadius:9,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,cursor:'pointer',border:'none',background:'#DC2626',color:'#fff',transition:'all .2s' },
    sidebar:{ background:'#fff',border:'1px solid #E2E8F0',borderRadius:16,padding:16,display:'flex',flexDirection:'column',gap:12,overflow:'auto' },
    dotGrid:{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:6 },
    dot: (i,cur) => ({ width:'100%',aspectRatio:'1',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,cursor:'pointer',border:'1.5px solid',borderColor:i===cur?'#2563EB':answers[i]!==undefined?'#16A34A':'#E2E8F0',background:i===cur?'#EFF6FF':answers[i]!==undefined?'#F0FDF4':'#F8FAFC',color:i===cur?'#2563EB':answers[i]!==undefined?'#16A34A':'#94A3B8',transition:'all .2s' }),
    // results
    scoreCircle:{ width:120,height:120,margin:'0 auto 24px',position:'relative',display:'flex',alignItems:'center',justifyContent:'center' },
    resGrid:{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,margin:'20px 0 28px' },
    resCard:(col)=>({ background:col+'10',border:`1px solid ${col}30`,borderRadius:10,padding:'14px',textAlign:'center' }),
    resN:(col)=>({ fontSize:28,fontWeight:800,color:col,letterSpacing:'-.04em' }),
    resL:{ fontSize:12,color:'#64748B',marginTop:2 },
  };

  /* SETUP PHASE */
  if (phase === 'setup') return (
    <div style={S.page}>
      <div style={S.center}>
        <div style={S.card}>
          <div style={S.h}>Configure Your Test</div>
          <div style={S.sub}>Set up a mock exam tailored to your class and subject.</div>
          <div style={S.grid}>
            <div>
              <div style={S.selLbl}>CLASS</div>
              <div style={S.selRow}>
                {['8','9','10','11','12'].map(c=><button key={c} style={S.selBtn(config.class===c,'#2563EB')} onClick={()=>setConfig(p=>({...p,class:c}))}>{c}</button>)}
              </div>
            </div>
            <div>
              <div style={S.selLbl}>SUBJECT</div>
              <div style={S.selRow}>
                {['Science','Math','English','SST'].map(s=><button key={s} style={S.selBtn(config.subject===s,'#2563EB')} onClick={()=>setConfig(p=>({...p,subject:s}))}>{s}</button>)}
              </div>
            </div>
            <div>
              <div style={S.selLbl}>QUESTIONS</div>
              <div style={S.selRow}>
                {[5,10,15,20].map(n=><button key={n} style={S.selBtn(config.count===n,'#16A34A')} onClick={()=>setConfig(p=>({...p,count:n}))}>{n}</button>)}
              </div>
            </div>
            <div>
              <div style={S.selLbl}>DIFFICULTY</div>
              <div style={S.selRow}>
                {['Easy','Mixed','Hard'].map(d=><button key={d} style={S.selBtn(config.difficulty===d,d==='Easy'?'#16A34A':d==='Hard'?'#DC2626':'#B45309')} onClick={()=>setConfig(p=>({...p,difficulty:d}))}>{d}</button>)}
              </div>
            </div>
          </div>
          <div style={{ background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:12,padding:'14px 18px',marginBottom:24,display:'flex',gap:24 }}>
            <div><div style={{ fontSize:18,fontWeight:800,color:'#0F172A' }}>{config.count}</div><div style={{ fontSize:12,color:'#64748B' }}>Questions</div></div>
            <div><div style={{ fontSize:18,fontWeight:800,color:'#0F172A' }}>{config.count}m</div><div style={{ fontSize:12,color:'#64748B' }}>Time Limit</div></div>
            <div><div style={{ fontSize:18,fontWeight:800,color:'#0F172A' }}>{config.subject}</div><div style={{ fontSize:12,color:'#64748B' }}>Subject</div></div>
            <div><div style={{ fontSize:18,fontWeight:800,color:'#0F172A' }}>Class {config.class}</div><div style={{ fontSize:12,color:'#64748B' }}>Level</div></div>
          </div>
          <button style={S.startBtn} onClick={startTest}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
            onMouseLeave={e=>e.currentTarget.style.transform=''}>
            Start Test →
          </button>
        </div>
      </div>
    </div>
  );

  /* TEST PHASE */
  if (phase === 'test') {
    const q = qs[current];
    return (
      <div style={{ ...S.testWrap, fontFamily:"'Sora',sans-serif" }}>
        <div style={S.qCard}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
            <div style={S.qNum}>Question {current+1} of {qs.length}</div>
            <div style={S.timer}>
              <Icon name="clock" size={16} /><span style={S.timerN}>{mm}:{ss}</span>
            </div>
          </div>
          <div style={{ height:4,background:'#F1F5F9',borderRadius:2,overflow:'hidden',marginBottom:24 }}>
            <div style={{ height:'100%',width:`${((current)/qs.length)*100}%`,background:'linear-gradient(90deg,#2563EB,#16A34A)',borderRadius:2,transition:'width .4s' }}></div>
          </div>
          <div style={S.qText}>{q.text}</div>
          <div>
            {q.opts.map((opt,i) => (
              <div key={i} style={S.opt(i,selected)} onClick={() => selectAnswer(i)}>
                <div style={S.optL}>{['A','B','C','D'][i]}</div>
                {opt}
              </div>
            ))}
          </div>
          <div style={S.navRow}>
            <button style={S.navBtn(current>0)} onClick={goPrev}>← Prev</button>
            <button style={S.subBtn} onClick={saveAndSubmit}>Submit Test</button>
            <button style={S.navBtn(current<qs.length-1)} onClick={goNext}>Next →</button>
          </div>
        </div>
        <div style={S.sidebar}>
          <div style={{ fontSize:12,fontWeight:700,color:'#64748B' }}>QUESTION MAP</div>
          <div style={S.dotGrid}>
            {qs.map((_,i) => (
              <div key={i} style={S.dot(i,current)} onClick={() => goTo(i)}>{i+1}</div>
            ))}
          </div>
          <div style={{ fontSize:11,color:'#94A3B8',borderTop:'1px solid #F1F5F9',paddingTop:10 }}>
            <div style={{ display:'flex',alignItems:'center',gap:5,marginBottom:4 }}>
              <div style={{ width:8,height:8,background:'#16A34A',borderRadius:2 }}></div> Answered ({Object.keys(answers).length})
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:5 }}>
              <div style={{ width:8,height:8,background:'#E2E8F0',borderRadius:2 }}></div> Unanswered ({qs.length-Object.keys(answers).length})
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* RESULTS PHASE */
  return (
    <div style={S.page}>
      <div style={S.center}>
        <div style={S.card}>
          <ProgressRing pct={pct} size={120} stroke={8} color={gradeCol} bg="#F1F5F9">
            <div>
              <div style={{ fontSize:26,fontWeight:800,color:'#0F172A',lineHeight:1 }}>{pct}%</div>
              <div style={{ fontSize:14,fontWeight:700,color:gradeCol }}>{grade}</div>
            </div>
          </ProgressRing>
          <div style={{ textAlign:'center',marginBottom:8 }}>
            <div style={{ fontSize:22,fontWeight:800,color:'#0F172A' }}>{pct>=75?'Excellent Work! 🎉':pct>=50?'Good Job! 👍':'Keep Practicing 💪'}</div>
            <div style={{ fontSize:14,color:'#64748B',marginTop:4 }}>{config.subject} · Class {config.class} · {qs.length} Questions</div>
          </div>
          <div style={S.resGrid}>
            <div style={S.resCard('#16A34A')}><div style={S.resN('#16A34A')}>{correct}</div><div style={S.resL}>Correct</div></div>
            <div style={S.resCard('#DC2626')}><div style={S.resN('#DC2626')}>{wrong}</div><div style={S.resL}>Wrong</div></div>
            <div style={S.resCard('#64748B')}><div style={S.resN('#64748B')}>{skipped}</div><div style={S.resL}>Skipped</div></div>
          </div>
          <div style={{ display:'flex',gap:12 }}>
            <button style={{ flex:1,padding:'12px',background:'linear-gradient(135deg,#2563EB,#16A34A)',color:'#fff',border:'none',borderRadius:10,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,cursor:'pointer' }} onClick={()=>{setAnswers({});setSelected(null);setCurrent(0);setPhase('setup');}}>
              Try Again
            </button>
            <button style={{ flex:1,padding:'12px',background:'#F8FAFC',border:'1.5px solid #E2E8F0',borderRadius:10,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:600,color:'#64748B',cursor:'pointer' }} onClick={() => navigate('progress')}>
              View Analytics →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Tests });
