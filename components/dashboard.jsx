// DASHBOARD PAGE
const { useState, useEffect } = React;

const SUBJECTS = [
  { name:'Science',  pct:78, color:'#2563EB', icon:'⚗️' },
  { name:'Math',     pct:64, color:'#16A34A', icon:'📐' },
  { name:'English',  pct:85, color:'#7C3AED', icon:'📖' },
  { name:'SST',      pct:52, color:'#B45309', icon:'🌍' },
];

const WEAK_TOPICS = [
  { subject:'Math',    topic:'Quadratic Equations',  score:42, color:'#B45309' },
  { subject:'Science', topic:'Chemical Bonding',      score:48, color:'#DC2626' },
  { subject:'SST',     topic:'French Revolution',     score:51, color:'#7C3AED' },
];

const QUICK_ACTIONS = [
  { id:'tutor',    label:'Ask AI',       icon:'sparkle', bg:'linear-gradient(135deg,#2563EB,#16A34A)', text:'#fff' },
  { id:'practice', label:'Practice',     icon:'pencil',  bg:'#EFF6FF', text:'#2563EB' },
  { id:'tests',    label:'Take Test',    icon:'clipboard',bg:'#F0FDF4', text:'#16A34A' },
  { id:'resources',label:'Resources',   icon:'folder',  bg:'#F5F3FF', text:'#7C3AED' },
];

const ACTIVITIES = [
  { action:'Completed Practice',  detail:'Quadratic Equations · 8/10 correct', time:'2h ago',  icon:'check', col:'#16A34A' },
  { action:'Asked AI Tutor',      detail:'Newton\'s 3rd Law — got full explanation', time:'4h ago',  icon:'chat',  col:'#2563EB' },
  { action:'Finished Chapter',    detail:'Chapter 5 · Light & Reflection', time:'Yesterday', icon:'book',  col:'#7C3AED' },
  { action:'Mock Test Attempted', detail:'Science · Class 10 · Score: 74%', time:'2 days ago',icon:'clipboard',col:'#B45309' },
];

function Dashboard({ navigate }) {
  const [animPcts, setAnimPcts] = useState(SUBJECTS.map(() => 0));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const t = setTimeout(() => setAnimPcts(SUBJECTS.map(s => s.pct)), 300);
    return () => clearTimeout(t);
  }, []);

  const S = {
    page:   { padding:'28px 32px', minHeight:'calc(100vh - 60px)', background:'#F8FAFC', fontFamily:"'Sora',sans-serif" },
    greeting: { marginBottom:28 },
    gH:     { fontSize:24,fontWeight:800,color:'#0F172A',letterSpacing:'-.025em',marginBottom:4 },
    gSub:   { fontSize:14,color:'#64748B' },
    row:    { display:'grid', gap:18, marginBottom:18 },
    r3:     { gridTemplateColumns:'repeat(3,1fr)' },
    r2:     { gridTemplateColumns:'2fr 1fr' },
    r4:     { gridTemplateColumns:'repeat(4,1fr)' },
    r21:    { gridTemplateColumns:'1.4fr 1fr' },
    cardH:  { fontSize:12,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:16 },
    statN:  { fontSize:32,fontWeight:800,color:'#0F172A',letterSpacing:'-.03em',lineHeight:1 },
    statL:  { fontSize:12,color:'#64748B',marginTop:4 },
    chipRow:{ display:'flex',gap:6,flexWrap:'wrap',marginTop:8 },
    chip:   (c) => ({ padding:'3px 10px',borderRadius:999,fontSize:11,fontWeight:500,background:c+'18',color:c,border:`1px solid ${c}30` }),
    qaBtn:  (bg,text) => ({ display:'flex',alignItems:'center',gap:8,padding:'12px 16px',background:bg,color:text,border:'none',borderRadius:12,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:600,cursor:'pointer',transition:'all .2s',width:'100%',justifyContent:'flex-start' }),
    actRow: { display:'flex',alignItems:'flex-start',gap:12,padding:'12px 0',borderBottom:'1px solid #F1F5F9' },
    actIco: (c) => ({ width:36,height:36,background:c+'15',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:c,flexShrink:0 }),
    actTx:  { fontSize:13,fontWeight:600,color:'#0F172A',marginBottom:2 },
    actSub: { fontSize:12,color:'#64748B' },
    actTime:{ fontSize:11,color:'#94A3B8',marginLeft:'auto',whiteSpace:'nowrap' },
    weakRow:{ display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid #F1F5F9' },
    weakBar:{ flex:1,height:4,background:'#F1F5F9',borderRadius:2,overflow:'hidden' },
    weakFill:(pct,col) => ({ height:'100%',width:`${pct}%`,background:col,borderRadius:2,transition:'width 1s ease' }),
    tag:    (c) => ({ fontSize:10,fontWeight:600,padding:'2px 7px',borderRadius:999,background:c+'15',color:c }),
  };

  return (
    <div style={S.page}>
      <div style={S.greeting}>
        <div style={S.gH}>{greeting}, Arjun 👋</div>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <div style={S.gSub}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
          <StreakFlame count={7} />
        </div>
      </div>

      {/* Row 1: Stats */}
      <div style={{...S.row,...S.r3}}>
        <Card style={{ background:'linear-gradient(135deg,#2563EB,#16A34A)',border:'none' }} hover={false}>
          <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16 }}>
            <div style={{ fontSize:28 }}>🎯</div>
            <Badge color="blue" style={{ background:'rgba(255,255,255,.2)',color:'#fff',border:'none' }}>This Week</Badge>
          </div>
          <div style={{ fontSize:34,fontWeight:800,color:'#fff',letterSpacing:'-.04em',lineHeight:1,marginBottom:4 }}>47</div>
          <div style={{ fontSize:13,color:'rgba(255,255,255,.75)' }}>Questions Solved</div>
          <div style={{ marginTop:12,height:4,background:'rgba(255,255,255,.2)',borderRadius:2,overflow:'hidden' }}>
            <div style={{ height:'100%',width:'78%',background:'rgba(255,255,255,.7)',borderRadius:2 }}></div>
          </div>
          <div style={{ fontSize:11,color:'rgba(255,255,255,.6)',marginTop:6 }}>Goal: 60 questions</div>
        </Card>

        <Card>
          <div style={S.cardH}>Study Time</div>
          <div style={S.statN}>3h <span style={{ fontSize:18 }}>24m</span></div>
          <div style={S.statL}>Today's learning</div>
          <div style={{ display:'flex',gap:4,marginTop:14,alignItems:'flex-end',height:32 }}>
            {[60,45,80,55,70,90,75].map((h,i) => (
              <div key={i} style={{ flex:1,height:`${h}%`,background: i===6?'#2563EB':'#DBEAFE',borderRadius:3,transition:'height .5s' }}></div>
            ))}
          </div>
          <div style={{ fontSize:11,color:'#94A3B8',marginTop:6 }}>Mon–Sun</div>
        </Card>

        <Card>
          <div style={S.cardH}>Accuracy Rate</div>
          <div style={{ display:'flex',alignItems:'center',gap:16 }}>
            <ProgressRing pct={animPcts[0]} size={72} stroke={6} color="#16A34A">
              <div style={{ fontSize:14,fontWeight:800,color:'#0F172A' }}>{animPcts[0]}%</div>
            </ProgressRing>
            <div>
              <div style={{ fontSize:20,fontWeight:800,color:'#0F172A',letterSpacing:'-.03em' }}>Good</div>
              <div style={{ fontSize:12,color:'#64748B',marginTop:2 }}>vs 71% last week</div>
              <Badge color="green" style={{ marginTop:8 }}>↑ +7% better</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Continue + Weak Topics */}
      <div style={{...S.row,...S.r21}}>
        <Card onClick={() => navigate('learn')} style={{ cursor:'pointer' }}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18 }}>
            <div style={S.cardH}>Continue Learning</div>
            <Badge color="blue">In Progress</Badge>
          </div>
          <div style={{ display:'flex',gap:16,alignItems:'center' }}>
            <div style={{ width:52,height:52,background:'#EFF6FF',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0 }}>⚗️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16,fontWeight:700,color:'#0F172A',marginBottom:4 }}>Chapter 6 — Life Processes</div>
              <div style={{ fontSize:13,color:'#64748B',marginBottom:10 }}>Science · Class 10 · PSEB</div>
              <div style={{ height:5,background:'#F1F5F9',borderRadius:3,overflow:'hidden' }}>
                <div style={{ height:'100%',width:'62%',background:'linear-gradient(90deg,#2563EB,#16A34A)',borderRadius:3,transition:'width 1s ease' }}></div>
              </div>
              <div style={{ fontSize:11,color:'#64748B',marginTop:5,display:'flex',justifyContent:'space-between' }}>
                <span>62% complete</span><span>3 of 5 topics done</span>
              </div>
            </div>
          </div>
          <div style={{ display:'flex',gap:8,marginTop:16 }}>
            <button onClick={e=>{e.stopPropagation();navigate('learn')}} style={{ flex:1,padding:'10px',background:'#2563EB',color:'#fff',border:'none',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,cursor:'pointer' }}>
              Continue →
            </button>
            <button onClick={e=>{e.stopPropagation();navigate('tutor')}} style={{ padding:'10px 16px',background:'#F8FAFC',color:'#64748B',border:'1px solid #E2E8F0',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:500,cursor:'pointer' }}>
              Ask AI
            </button>
          </div>
        </Card>

        <Card>
          <div style={S.cardH}>Weak Topics</div>
          <div style={{ display:'flex',flexDirection:'column' }}>
            {WEAK_TOPICS.map((w,i) => (
              <div key={i} style={S.weakRow}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:'#0F172A',marginBottom:2 }}>{w.topic}</div>
                  <div style={S.tag(w.color)}>{w.subject}</div>
                  <div style={{ ...S.weakBar,marginTop:6 }}>
                    <div style={S.weakFill(w.score,w.color+'80')}></div>
                  </div>
                </div>
                <div style={{ fontSize:13,fontWeight:700,color:w.color,flexShrink:0 }}>{w.score}%</div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('practice')} style={{ width:'100%',marginTop:14,padding:'9px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,color:'#2563EB',cursor:'pointer' }}>
            Practice Weak Areas →
          </button>
        </Card>
      </div>

      {/* Row 3: Quick Actions + Subject Progress + Activity */}
      <div style={{...S.row,...S.r3}}>
        <Card>
          <div style={S.cardH}>Quick Actions</div>
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            {QUICK_ACTIONS.map(q => (
              <button key={q.id} style={S.qaBtn(q.bg,q.text)} onClick={() => navigate(q.id)}
                onMouseEnter={e=>e.currentTarget.style.transform='translateX(3px)'}
                onMouseLeave={e=>e.currentTarget.style.transform=''}>
                <Icon name={q.icon} size={16} />
                {q.label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div style={S.cardH}>Subject Progress</div>
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            {SUBJECTS.map((sub,i) => (
              <div key={i} style={{ display:'flex',alignItems:'center',gap:10 }}>
                <span style={{ fontSize:18,width:24,textAlign:'center' }}>{sub.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                    <span style={{ fontSize:12,fontWeight:600,color:'#0F172A' }}>{sub.name}</span>
                    <span style={{ fontSize:12,fontWeight:700,color:sub.color }}>{animPcts[i]}%</span>
                  </div>
                  <div style={{ height:5,background:'#F1F5F9',borderRadius:3,overflow:'hidden' }}>
                    <div style={{ height:'100%',width:`${animPcts[i]}%`,background:sub.color,borderRadius:3,transition:'width 1.2s ease' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4 }}>
            <div style={S.cardH}>Recent Activity</div>
          </div>
          <div>
            {ACTIVITIES.map((a,i) => (
              <div key={i} style={S.actRow}>
                <div style={S.actIco(a.col)}><Icon name={a.icon} size={15} /></div>
                <div style={{ flex:1 }}>
                  <div style={S.actTx}>{a.action}</div>
                  <div style={S.actSub}>{a.detail}</div>
                </div>
                <div style={S.actTime}>{a.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
