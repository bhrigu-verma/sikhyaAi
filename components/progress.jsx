// PROGRESS / ANALYTICS PAGE
const { useState, useEffect } = React;

const WEEKLY = [
  { day:'Mon', q:12, t:45, acc:82 },
  { day:'Tue', q:8,  t:30, acc:75 },
  { day:'Wed', q:20, t:70, acc:88 },
  { day:'Thu', q:5,  t:20, acc:60 },
  { day:'Fri', q:15, t:55, acc:80 },
  { day:'Sat', q:22, t:90, acc:91 },
  { day:'Sun', q:9,  t:35, acc:70 },
];

const SUBJECTS_STATS = [
  { name:'Science',  pct:78, questions:142, time:'4h 20m', color:'#2563EB', icon:'⚗️' },
  { name:'Math',     pct:64, questions:98,  time:'3h 10m', color:'#16A34A', icon:'📐' },
  { name:'English',  pct:85, questions:76,  time:'2h 05m', color:'#7C3AED', icon:'📖' },
  { name:'SST',      pct:52, questions:54,  time:'1h 45m', color:'#B45309', icon:'🌍' },
];

const WEAK_TOPICS = [
  { topic:'Quadratic Equations',     subject:'Math',    score:38, trend:'down' },
  { topic:'Chemical Bonding',        subject:'Science', score:44, trend:'up' },
  { topic:'French Revolution',       subject:'SST',     score:51, trend:'same' },
  { topic:'Pronoun Usage',           subject:'English', score:55, trend:'up' },
];

const RECS = [
  { text:'Revise Quadratic Equations — you\'ve attempted it 3 times with <50% accuracy.', icon:'target',  color:'#DC2626' },
  { text:'Complete Chapter 4 in Science — you stopped midway 2 days ago.',                icon:'book',    color:'#2563EB' },
  { text:'Take a Math mock test — your theory is strong, test your speed.',               icon:'clipboard',color:'#7C3AED' },
];

function BarChart({ data, maxVal, color, label }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display:'flex',alignItems:'flex-end',gap:8,height:100 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
          <div style={{ fontSize:10, color:'#94A3B8', fontWeight:600 }}>{d[label]}</div>
          <div style={{ width:'100%', background: i===5?color:'#F1F5F9', borderRadius:'4px 4px 0 0', height: animated ? `${(d.q/maxVal)*80}px` : '0px', transition:'height .8s cubic-bezier(.22,1,.36,1)', transitionDelay:`${i*60}ms`, minHeight:4 }}></div>
          <div style={{ fontSize:10, color:'#64748B' }}>{d.day}</div>
        </div>
      ))}
    </div>
  );
}

function MiniCalendar() {
  const days = Array.from({length:31},(_,i)=>i+1);
  const active = [1,2,3,6,7,8,9,13,14,15,16,17,20,21,22,23];
  const today = 23;
  return (
    <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4 }}>
      {['M','T','W','T','F','S','S'].map((d,i)=>(
        <div key={i} style={{ fontSize:10,fontWeight:700,color:'#94A3B8',textAlign:'center',paddingBottom:4 }}>{d}</div>
      ))}
      {days.map(d => {
        const isActive = active.includes(d);
        const isToday  = d === today;
        return (
          <div key={d} style={{ aspectRatio:'1',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:isToday?800:500,background:isToday?'linear-gradient(135deg,#2563EB,#16A34A)':isActive?'#DCFCE7':'transparent',color:isToday?'#fff':isActive?'#16A34A':'#64748B',border: isToday?'none':isActive?'1px solid rgba(22,163,74,.2)':'none' }}>
            {d}
          </div>
        );
      })}
    </div>
  );
}

function ProgressPage({ navigate }) {
  const [animPcts, setAnimPcts] = useState(SUBJECTS_STATS.map(()=>0));
  const [tab, setTab] = useState('week');

  useEffect(() => {
    const t = setTimeout(() => setAnimPcts(SUBJECTS_STATS.map(s=>s.pct)), 400);
    return () => clearTimeout(t);
  }, []);

  const totalQ = WEEKLY.reduce((a,d)=>a+d.q,0);
  const totalT = WEEKLY.reduce((a,d)=>a+d.t,0);
  const avgAcc = Math.round(WEEKLY.reduce((a,d)=>a+d.acc,0)/WEEKLY.length);
  const maxQ   = Math.max(...WEEKLY.map(d=>d.q));

  const S = {
    page: { padding:'28px 32px',minHeight:'calc(100vh - 60px)',background:'#F8FAFC',fontFamily:"'Sora',sans-serif" },
    g3:   { display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:20 },
    g2:   { display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:16,marginBottom:20 },
    g22:  { display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20 },
    card: { background:'#fff',border:'1px solid #E2E8F0',borderRadius:14,padding:20 },
    cardH:{ fontSize:12,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:16 },
    statN:{ fontSize:32,fontWeight:800,color:'#0F172A',letterSpacing:'-.04em',lineHeight:1,marginBottom:4 },
    statL:{ fontSize:12,color:'#64748B' },
    tabRow:{ display:'flex',gap:6,marginBottom:16 },
    tabBtn:(act) => ({ padding:'5px 14px',borderRadius:999,fontSize:12,fontWeight:act?700:500,border:'1.5px solid',borderColor:act?'#2563EB':'#E2E8F0',background:act?'#EFF6FF':'#fff',color:act?'#2563EB':'#64748B',cursor:'pointer',fontFamily:"'Sora',sans-serif",transition:'all .2s' }),
    subRow:{ display:'flex',alignItems:'center',gap:12,marginBottom:14 },
    subIco:{ fontSize:20,width:32,textAlign:'center' },
    weakRow:{ padding:'12px 0',borderBottom:'1px solid #F1F5F9',display:'flex',alignItems:'center',gap:12 },
    weakTopic:{ fontSize:13,fontWeight:600,color:'#0F172A',marginBottom:3 },
    weakSub:{ fontSize:11,color:'#64748B' },
    score:  (v)=>({ fontSize:14,fontWeight:800,color:v<50?'#DC2626':v<65?'#B45309':'#16A34A',flexShrink:0 }),
    trend:  (t)=>({ fontSize:11,fontWeight:600,color:t==='up'?'#16A34A':t==='down'?'#DC2626':'#64748B' }),
    recRow: { display:'flex',alignItems:'flex-start',gap:10,padding:'12px 0',borderBottom:'1px solid #F1F5F9' },
    recIco: (c)=>({ width:32,height:32,background:c+'15',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:c,flexShrink:0 }),
    recTxt: { fontSize:13,color:'#475569',lineHeight:1.5 },
    progBar:{ flex:1,height:5,background:'#F1F5F9',borderRadius:3,overflow:'hidden' },
    progFill:(w,c)=>({ height:'100%',width:`${w}%`,background:c,borderRadius:3,transition:'width 1.2s ease' }),
  };

  return (
    <div style={S.page}>
      {/* Summary stats */}
      <div style={S.g3}>
        <div style={{...S.card,background:'linear-gradient(135deg,#2563EB,#16A34A)',border:'none'}}>
          <div style={{ fontSize:12,fontWeight:700,color:'rgba(255,255,255,.65)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:12 }}>This Week</div>
          <div style={{ fontSize:36,fontWeight:800,color:'#fff',letterSpacing:'-.04em',lineHeight:1,marginBottom:4 }}>{totalQ}</div>
          <div style={{ fontSize:13,color:'rgba(255,255,255,.75)' }}>Questions solved</div>
          <StreakFlame count={7} style={{ marginTop:12 }} />
        </div>
        <div style={S.card}>
          <div style={S.cardH}>Study Time</div>
          <div style={S.statN}>{Math.floor(totalT/60)}<span style={{ fontSize:18 }}>h {totalT%60}m</span></div>
          <div style={S.statL}>This week</div>
          <div style={{ marginTop:12,fontSize:12,color:'#16A34A',fontWeight:600 }}>↑ +18% vs last week</div>
        </div>
        <div style={S.card}>
          <div style={S.cardH}>Average Accuracy</div>
          <div style={{ display:'flex',alignItems:'center',gap:14 }}>
            <ProgressRing pct={avgAcc} size={64} stroke={6} color={avgAcc>=75?'#16A34A':'#B45309'}>
              <div style={{ fontSize:13,fontWeight:800,color:'#0F172A' }}>{avgAcc}%</div>
            </ProgressRing>
            <div>
              <div style={S.statN} style={{ fontSize:28,fontWeight:800 }}>{avgAcc}%</div>
              <div style={S.statL}>Weekly avg</div>
              <Badge color={avgAcc>=75?'green':'orange'} style={{ marginTop:6 }}>{avgAcc>=75?'On Track':'Needs Work'}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div style={S.g2}>
        <div style={S.card}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
            <div style={S.cardH}>Daily Questions Solved</div>
            <div style={S.tabRow}>
              {['week','month'].map(t => <button key={t} style={S.tabBtn(tab===t)} onClick={()=>setTab(t)}>{t==='week'?'Week':'Month'}</button>)}
            </div>
          </div>
          <BarChart data={WEEKLY} maxVal={maxQ} color="#2563EB" label="q" />
          <div style={{ display:'flex',gap:16,marginTop:14 }}>
            {WEEKLY.map((d,i)=>(
              <div key={i} style={{ flex:1,textAlign:'center' }}>
                <div style={{ fontSize:10,fontWeight:700,color:i===5?'#2563EB':'#94A3B8' }}>{d.q}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardH}>Learning Streak</div>
          <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:16 }}>
            <div style={{ fontSize:36 }}>🔥</div>
            <div>
              <div style={{ fontSize:28,fontWeight:800,color:'#B45309',letterSpacing:'-.03em' }}>7 days</div>
              <div style={{ fontSize:12,color:'#64748B' }}>Current streak</div>
            </div>
          </div>
          <MiniCalendar />
          <div style={{ marginTop:10,fontSize:12,color:'#64748B',textAlign:'center' }}>May 2026 · 21 active days</div>
        </div>
      </div>

      {/* Subject breakdown + weak topics */}
      <div style={S.g22}>
        <div style={S.card}>
          <div style={S.cardH}>Subject Breakdown</div>
          {SUBJECTS_STATS.map((sub,i)=>(
            <div key={i} style={S.subRow}>
              <span style={S.subIco}>{sub.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                  <span style={{ fontSize:13,fontWeight:600,color:'#0F172A' }}>{sub.name}</span>
                  <span style={{ fontSize:12,fontWeight:700,color:sub.color }}>{animPcts[i]}%</span>
                </div>
                <div style={S.progBar}><div style={S.progFill(animPcts[i],sub.color)}></div></div>
                <div style={{ display:'flex',justifyContent:'space-between',marginTop:4 }}>
                  <span style={{ fontSize:10,color:'#94A3B8' }}>{sub.questions} questions</span>
                  <span style={{ fontSize:10,color:'#94A3B8' }}>{sub.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4 }}>
            <div style={S.cardH}>Weak Topics</div>
            <Badge color="red">4 areas</Badge>
          </div>
          {WEAK_TOPICS.map((w,i)=>(
            <div key={i} style={S.weakRow}>
              <div style={{ flex:1 }}>
                <div style={S.weakTopic}>{w.topic}</div>
                <div style={S.weakSub}>{w.subject}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={S.score(w.score)}>{w.score}%</div>
                <div style={S.trend(w.trend)}>{w.trend==='up'?'↑ improving':w.trend==='down'?'↓ declining':'→ steady'}</div>
              </div>
            </div>
          ))}
          <button onClick={()=>navigate('practice')} style={{ width:'100%',marginTop:12,padding:'9px',background:'#FFF1F2',border:'1px solid rgba(220,38,38,.2)',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,color:'#DC2626',cursor:'pointer' }}>
            Practice Weak Topics →
          </button>
        </div>
      </div>

      {/* Recommendations */}
      <div style={S.card}>
        <div style={S.cardH}>AI Recommendations for You</div>
        {RECS.map((r,i)=>(
          <div key={i} style={S.recRow}>
            <div style={S.recIco(r.color)}><Icon name={r.icon} size={15} /></div>
            <div style={S.recTxt}>{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ProgressPage });
