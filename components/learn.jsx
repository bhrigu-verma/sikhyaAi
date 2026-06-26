// LEARN / CHAPTERS PAGE
const { useState } = React;

const SUBJECTS = [
  { id:'science',  label:'Science',       icon:'⚗️',  color:'#2563EB' },
  { id:'math',     label:'Mathematics',   icon:'📐',  color:'#16A34A' },
  { id:'english',  label:'English',       icon:'📖',  color:'#7C3AED' },
  { id:'sst',      label:'Social Studies',icon:'🌍',  color:'#B45309' },
  { id:'hindi',    label:'Hindi',         icon:'🔤',  color:'#DC2626' },
  { id:'punjabi',  label:'Punjabi',       icon:'🅿️',  color:'#0891B2' },
];

const CHAPTERS = {
  science: [
    { n:1,  title:'Chemical Reactions & Equations',  pct:100, status:'done',    topics:5  },
    { n:2,  title:'Acids, Bases and Salts',           pct:100, status:'done',    topics:6  },
    { n:3,  title:'Metals and Non-Metals',            pct:80,  status:'active',  topics:7  },
    { n:4,  title:'Carbon and Its Compounds',         pct:62,  status:'active',  topics:8  },
    { n:5,  title:'Periodic Classification of Elements',pct:0, status:'locked',  topics:5  },
    { n:6,  title:'Life Processes',                   pct:62,  status:'active',  topics:7  },
    { n:7,  title:'Control and Coordination',         pct:0,   status:'locked',  topics:6  },
    { n:8,  title:'How do Organisms Reproduce?',      pct:0,   status:'locked',  topics:5  },
    { n:9,  title:'Heredity and Evolution',           pct:0,   status:'locked',  topics:6  },
    { n:10, title:'Light — Reflection & Refraction',  pct:100, status:'done',    topics:8  },
    { n:11, title:'The Human Eye',                    pct:40,  status:'active',  topics:5  },
    { n:12, title:'Electricity',                      pct:0,   status:'locked',  topics:9  },
    { n:13, title:'Magnetic Effects of Electric Current',pct:0,status:'locked',  topics:6  },
    { n:14, title:'Sources of Energy',                pct:0,   status:'locked',  topics:5  },
    { n:15, title:'Our Environment',                  pct:0,   status:'locked',  topics:4  },
  ],
  math: [
    { n:1,  title:'Real Numbers',                     pct:100, status:'done',   topics:4 },
    { n:2,  title:'Polynomials',                      pct:100, status:'done',   topics:5 },
    { n:3,  title:'Pair of Linear Equations',         pct:75,  status:'active', topics:6 },
    { n:4,  title:'Quadratic Equations',              pct:40,  status:'active', topics:5 },
    { n:5,  title:'Arithmetic Progressions',          pct:0,   status:'locked', topics:5 },
    { n:6,  title:'Triangles',                        pct:0,   status:'locked', topics:7 },
    { n:7,  title:'Coordinate Geometry',              pct:0,   status:'locked', topics:4 },
    { n:8,  title:'Introduction to Trigonometry',     pct:0,   status:'locked', topics:5 },
    { n:9,  title:'Applications of Trigonometry',     pct:0,   status:'locked', topics:3 },
    { n:10, title:'Circles',                          pct:0,   status:'locked', topics:4 },
    { n:11, title:'Constructions',                    pct:0,   status:'locked', topics:3 },
    { n:12, title:'Areas Related to Circles',         pct:0,   status:'locked', topics:3 },
    { n:13, title:'Surface Areas and Volumes',        pct:0,   status:'locked', topics:5 },
    { n:14, title:'Statistics',                       pct:0,   status:'locked', topics:4 },
    { n:15, title:'Probability',                      pct:0,   status:'locked', topics:3 },
  ],
};

const defaultChapters = (sub) => CHAPTERS[sub] || Array.from({length:8},(_,i)=>({n:i+1,title:`Chapter ${i+1}`,pct:i<2?100:i<4?50:0,status:i<2?'done':i<4?'active':'locked',topics:5}));

function StatusIcon({ status }) {
  if (status === 'done')   return <span style={{ color:'#16A34A',fontSize:15 }}>✓</span>;
  if (status === 'active') return <div style={{ width:8,height:8,background:'#2563EB',borderRadius:'50%' }} />;
  return <Icon name="chevright" size={13} stroke={1.5} />;
}

function Learn({ navigate }) {
  const [selClass, setSelClass] = useState('10');
  const [selSub,   setSelSub]   = useState('science');
  const [search,   setSearch]   = useState('');
  const chapters = defaultChapters(selSub).filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  const done   = chapters.filter(c => c.status === 'done').length;
  const active = chapters.filter(c => c.status === 'active').length;
  const total  = chapters.length;
  const subMeta = SUBJECTS.find(s => s.id === selSub) || SUBJECTS[0];

  const S = {
    page:    { padding:'28px 32px',minHeight:'calc(100vh - 60px)',background:'#F8FAFC',fontFamily:"'Sora',sans-serif" },
    row:     { display:'flex',gap:12,alignItems:'center',marginBottom:24,flexWrap:'wrap' },
    clsBtn:  (act) => ({ padding:'7px 16px',border:'1.5px solid',borderColor:act?'#2563EB':'#E2E8F0',background:act?'#EFF6FF':'#fff',color:act?'#2563EB':'#64748B',borderRadius:999,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:act?700:500,cursor:'pointer',transition:'all .2s' }),
    subGrid: { display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10,marginBottom:24 },
    subCard: (act,col) => ({ padding:'12px 10px',border:'1.5px solid',borderColor:act?col+'50':'#E2E8F0',background:act?col+'10':'#fff',borderRadius:12,cursor:'pointer',textAlign:'center',transition:'all .2s' }),
    subIcon: { fontSize:22,marginBottom:6 },
    subLbl:  (act,col) => ({ fontSize:12,fontWeight:act?700:500,color:act?col:'#64748B' }),
    statsRow:{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24 },
    statCard:{ background:'#fff',border:'1px solid #E2E8F0',borderRadius:12,padding:'14px 18px' },
    statN:   { fontSize:22,fontWeight:800,color:'#0F172A',letterSpacing:'-.03em' },
    statL:   { fontSize:12,color:'#64748B',marginTop:2 },
    searchBox:{ display:'flex',alignItems:'center',gap:10,background:'#fff',border:'1.5px solid #E2E8F0',borderRadius:10,padding:'9px 14px',marginBottom:20,transition:'border-color .2s' },
    searchInp:{ flex:1,background:'none',border:'none',fontFamily:"'Sora',sans-serif",fontSize:14,color:'#0F172A',outline:'none' },
    chapGrid:{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14 },
    chapCard:(status,col) => ({ background:'#fff',border:`1.5px solid ${status==='active'?col+'40':'#E2E8F0'}`,borderRadius:14,padding:'18px 20px',transition:'all .25s',cursor:'pointer',position:'relative',overflow:'hidden' }),
    chapN:   (col) => ({ fontSize:11,fontWeight:700,color:col,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:6 }),
    chapT:   { fontSize:15,fontWeight:700,color:'#0F172A',marginBottom:8,lineHeight:1.4 },
    chapMeta:{ display:'flex',gap:12,alignItems:'center',marginBottom:10 },
    chapTag: { fontSize:11,fontWeight:500,color:'#64748B' },
    progress:{ height:4,background:'#F1F5F9',borderRadius:2,overflow:'hidden',marginBottom:8 },
    progFill:(pct,col) => ({ height:'100%',width:`${pct}%`,background:col,borderRadius:2,transition:'width 1s ease' }),
    progRow: { display:'flex',justifyContent:'space-between',alignItems:'center' },
    progPct: (col) => ({ fontSize:12,fontWeight:700,color:col }),
    progLbl: { fontSize:11,color:'#94A3B8' },
    doneTag: { position:'absolute',top:14,right:14 },
  };

  return (
    <div style={S.page}>
      {/* Class selector */}
      <div style={S.row}>
        <span style={{ fontSize:13,fontWeight:600,color:'#64748B',marginRight:4 }}>Class</span>
        {['6','7','8','9','10','11','12'].map(c => (
          <button key={c} style={S.clsBtn(selClass===c)} onClick={() => setSelClass(c)}>
            {c}
          </button>
        ))}
        <Badge color="blue" style={{ marginLeft:'auto' }}>PSEB Board</Badge>
      </div>

      {/* Subject selector */}
      <div style={S.subGrid}>
        {SUBJECTS.map(sub => (
          <div key={sub.id} style={S.subCard(selSub===sub.id,sub.color)} onClick={() => setSelSub(sub.id)}
            onMouseEnter={e=>{ if(selSub!==sub.id) e.currentTarget.style.borderColor='#CBD5E1'; }}
            onMouseLeave={e=>{ if(selSub!==sub.id) e.currentTarget.style.borderColor='#E2E8F0'; }}>
            <div style={S.subIcon}>{sub.icon}</div>
            <div style={S.subLbl(selSub===sub.id,sub.color)}>{sub.label}</div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div style={S.statsRow}>
        <div style={S.statCard}>
          <div style={S.statN}>{total}</div>
          <div style={S.statL}>Total Chapters</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statN, color:'#16A34A' }}>{done}</div>
          <div style={S.statL}>Completed</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statN, color:'#2563EB' }}>{active}</div>
          <div style={S.statL}>In Progress</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statN}>{Math.round((done/total)*100)}%</div>
          <div style={S.statL}>Course Done</div>
        </div>
      </div>

      {/* Search */}
      <div style={S.searchBox}>
        <Icon name="search" size={16} /><span style={{ color:'#E2E8F0' }}>|</span>
        <input style={S.searchInp} placeholder={`Search ${subMeta.label} chapters...`}
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Chapters grid */}
      <div style={S.chapGrid}>
        {chapters.map(ch => (
          <div key={ch.n}
            style={S.chapCard(ch.status, subMeta.color)}
            onClick={() => navigate('tutor')}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(15,23,42,.08)'; if(ch.status!=='active') e.currentTarget.style.borderColor='#CBD5E1'; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; if(ch.status!=='active') e.currentTarget.style.borderColor='#E2E8F0'; }}>

            {ch.status === 'done' && (
              <div style={S.doneTag}><Badge color="green">Done</Badge></div>
            )}
            {ch.status === 'active' && (
              <div style={S.doneTag}><Badge color="blue">Active</Badge></div>
            )}

            <div style={S.chapN(subMeta.color)}>Chapter {ch.n}</div>
            <div style={S.chapT}>{ch.title}</div>
            <div style={S.chapMeta}>
              <span style={S.chapTag}>{ch.topics} topics</span>
              <span style={{ width:1,height:12,background:'#E2E8F0' }}></span>
              <span style={S.chapTag}>Class {selClass}</span>
            </div>
            <div style={S.progress}>
              <div style={S.progFill(ch.pct, subMeta.color)}></div>
            </div>
            <div style={S.progRow}>
              <span style={S.progPct(ch.status==='done'?'#16A34A':ch.status==='active'?subMeta.color:'#94A3B8')}>
                {ch.pct}%
              </span>
              <span style={S.progLbl}>{ch.status === 'locked' ? 'Not started' : ch.status === 'done' ? 'Complete' : 'In progress'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Learn });
