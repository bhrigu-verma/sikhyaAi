// SHARED COMPONENTS — Sidebar, TopBar, Icon, utilities
// Exports: Icon, Sidebar, TopBar, Card, ProgressRing, Badge

const { useState, useEffect, useRef } = React;

/* ─── ICONS ─── */
function Icon({ name, size = 18, stroke = 1.75 }) {
  const paths = {
    home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
    book: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 004 17V3h12a4 4 0 014 4v10.5a2.5 2.5 0 01-2.5 2.5H4z",
    pencil: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    clipboard: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2 M9 12h6 M9 16h4",
    chart: "M18 20V10 M12 20V4 M6 20v-6",
    folder: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    menu: "M3 12h18 M3 6h18 M3 18h18",
    x: "M18 6L6 18 M6 6l12 12",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
    send: "M22 2L11 13 M22 2L15 22l-4-9-9-4 20-7z",
    mic: "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2 M12 19v4 M8 23h8",
    upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    image: "M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2z M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M21 15l-5-5L5 21",
    fire: "M12 2c0 0-4 3-4 7a4 4 0 008 0c0-2-.5-3.5-1.5-4.5C14 7 12 2 12 2z",
    check: "M20 6L9 17l-5-5",
    arrowright: "M5 12h14 M12 5l7 7-7 7",
    plus: "M12 5v14 M5 12h14",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    target: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4z",
    chevright: "M9 18l6-6-6-6",
    chevdown: "M6 9l6 6 6-6",
    bookopen: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
    download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    external: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3",
    trophy: "M6 9H4.5a2.5 2.5 0 010-5H6 M18 9h1.5a2.5 2.5 0 000-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0012 0V2z",
    sparkle: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5z M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {(paths[name] || "").split(" M ").map((d, i) => (
        <path key={i} d={i === 0 ? d : "M " + d} />
      ))}
    </svg>
  );
}

/* ─── SIDEBAR NAV CONFIG ─── */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'tutor',     label: 'AI Tutor',  icon: 'chat' },
  { id: 'learn',     label: 'Learn',     icon: 'book' },
  { id: 'practice',  label: 'Practice',  icon: 'pencil' },
  { id: 'tests',     label: 'Tests',     icon: 'clipboard' },
  { id: 'progress',  label: 'Progress',  icon: 'chart' },
  { id: 'resources', label: 'Resources', icon: 'folder' },
];

/* ─── SIDEBAR ─── */
function Sidebar({ page, navigate, open, onClose }) {
  const s = {
    overlay: { position:'fixed',inset:0,background:'rgba(15,23,42,.3)',zIndex:49,display: open ? 'block' : 'none' },
    aside: { position:'fixed',top:0,left:0,bottom:0,width:240,background:'#fff',borderRight:'1px solid #E2E8F0',display:'flex',flexDirection:'column',zIndex:50,transform: open ? 'translateX(0)' : undefined,transition:'transform .3s' },
    logo: { padding:'20px 20px 16px',display:'flex',alignItems:'center',gap:9,borderBottom:'1px solid #E2E8F0' },
    lm: { width:30,height:30,background:'linear-gradient(135deg,#2563EB,#16A34A)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:14,flexShrink:0 },
    ln: { fontWeight:700,fontSize:16,letterSpacing:'-.3px',color:'#0F172A' },
    nav: { flex:1,padding:'12px 10px',overflowY:'auto',display:'flex',flexDirection:'column',gap:2 },
    item: (active) => ({ display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',background: active ? '#DBEAFE' : 'none',color: active ? '#2563EB' : '#64748B',fontFamily:"'Sora',sans-serif",fontSize:13.5,fontWeight: active ? 600 : 500,cursor:'pointer',width:'100%',textAlign:'left',transition:'all .18s' }),
    divider: { height:1,background:'#E2E8F0',margin:'8px 10px' },
    bottom: { padding:'8px 10px',display:'flex',flexDirection:'column',gap:2 },
    user: { padding:'14px 16px',borderTop:'1px solid #E2E8F0',display:'flex',alignItems:'center',gap:10 },
    av: { width:32,height:32,background:'linear-gradient(135deg,#2563EB,#16A34A)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:700,flexShrink:0 },
    un: { fontSize:13,fontWeight:600,color:'#0F172A' },
    uc: { fontSize:11,color:'#64748B',marginTop:1 },
  };

  const navItem = (id, label, icon) => (
    <button key={id} style={s.item(page === id)} onClick={() => { navigate(id); onClose && onClose(); }}
      onMouseEnter={e => { if(page!==id) e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.color=page===id?'#2563EB':'#0F172A'; }}
      onMouseLeave={e => { e.currentTarget.style.background=page===id?'#DBEAFE':''; e.currentTarget.style.color=page===id?'#2563EB':'#64748B'; }}>
      <Icon name={icon} size={17} />{label}
    </button>
  );

  return (
    <>
      <div style={s.overlay} onClick={onClose}></div>
      <aside style={s.aside}>
        <div style={s.logo}>
          <div style={s.lm}>S</div>
          <span style={s.ln}>Sikhya</span>
        </div>
        <nav style={s.nav}>
          {NAV_ITEMS.map(({id,label,icon}) => navItem(id,label,icon))}
        </nav>
        <div style={s.divider}></div>
        <div style={s.bottom}>
          {navItem('profile','Profile','user')}
          <button style={{...s.item(false),color:'#94A3B8'}} onClick={() => window.location.href='index.html'}
            onMouseEnter={e=>{ e.currentTarget.style.background='#FFF1F2'; e.currentTarget.style.color='#DC2626'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=''; e.currentTarget.style.color='#94A3B8'; }}>
            <Icon name="logout" size={17} />Sign Out
          </button>
        </div>
        <div style={s.user}>
          <div style={s.av}>A</div>
          <div><div style={s.un}>Arjun Kumar</div><div style={s.uc}>Class 10 · PSEB</div></div>
        </div>
      </aside>
    </>
  );
}

/* ─── TOP BAR ─── */
const PAGE_META = {
  dashboard: { title:'Dashboard', sub:'Good morning, Arjun!' },
  tutor:     { title:'AI Tutor',  sub:'Ask anything, learn instantly' },
  learn:     { title:'Learn',     sub:'Class 10 · PSEB curriculum' },
  practice:  { title:'Practice',  sub:'Sharpen your skills' },
  tests:     { title:'Tests',     sub:'Mock exams and assessments' },
  progress:  { title:'Progress',  sub:'Your learning analytics' },
  resources: { title:'Resources', sub:'Notes, books, and papers' },
  profile:   { title:'Profile',   sub:'Account and preferences' },
};

function TopBar({ page, onMenu, navigate }) {
  const meta = PAGE_META[page] || { title: page, sub: '' };
  const s = {
    bar: { height:60,background:'#fff',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',padding:'0 28px',gap:16,flexShrink:0 },
    menuBtn: { width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:'#64748B',borderRadius:8,flexShrink:0 },
    title: { fontSize:17,fontWeight:700,color:'#0F172A',letterSpacing:'-.025em' },
    right: { display:'flex',alignItems:'center',gap:10,marginLeft:'auto' },
    askBtn: { display:'flex',alignItems:'center',gap:6,padding:'7px 14px',background:'linear-gradient(135deg,#2563EB,#16A34A)',color:'#fff',border:'none',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,cursor:'pointer',transition:'all .2s',boxShadow:'0 2px 8px rgba(37,99,235,.2)' },
    iconBtn: { width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'1.5px solid #E2E8F0',cursor:'pointer',color:'#64748B',borderRadius:8,transition:'all .2s' },
    av: { width:32,height:32,background:'linear-gradient(135deg,#2563EB,#16A34A)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',flexShrink:0 },
  };
  return (
    <header style={s.bar}>
      <button style={s.menuBtn} onClick={onMenu}><Icon name="menu" size={20} /></button>
      <div>
        <div style={s.title}>{meta.title}</div>
      </div>
      <div style={s.right}>
        {page !== 'tutor' && (
          <button style={s.askBtn} onClick={() => navigate('tutor')}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
            onMouseLeave={e=>e.currentTarget.style.transform=''}>
            <Icon name="sparkle" size={14} />Ask AI
          </button>
        )}
        <button style={s.iconBtn}
          onMouseEnter={e=>{ e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.borderColor='#CBD5E1'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background=''; e.currentTarget.style.borderColor='#E2E8F0'; }}>
          <Icon name="bell" size={16} />
        </button>
        <div style={s.av} onClick={() => navigate('profile')}>A</div>
      </div>
    </header>
  );
}

/* ─── SHARED UI: Card ─── */
function Card({ children, style = {}, hover = true, onClick }) {
  const [hov, setHov] = useState(false);
  const base = { background:'#fff',border:'1px solid #E2E8F0',borderRadius:16,padding:24,transition:'all .25s',cursor: onClick ? 'pointer' : 'default' };
  const hovStyle = hover && hov ? { transform:'translateY(-2px)',boxShadow:'0 8px 24px rgba(15,23,42,.08)',borderColor:'#CBD5E1' } : {};
  return (
    <div style={{...base,...hovStyle,...style}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}>
      {children}
    </div>
  );
}

/* ─── SHARED UI: ProgressRing ─── */
function ProgressRing({ pct = 0, size = 64, stroke = 5, color = '#2563EB', bg = '#E2E8F0', children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position:'relative',width:size,height:size,display:'inline-flex',alignItems:'center',justifyContent:'center' }}>
      <svg width={size} height={size} style={{ position:'absolute',top:0,left:0,transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ position:'relative',textAlign:'center' }}>{children}</div>
    </div>
  );
}

/* ─── SHARED UI: Badge ─── */
function Badge({ children, color = 'blue', style = {} }) {
  const colors = {
    blue:  { bg:'#DBEAFE', text:'#2563EB', border:'rgba(37,99,235,.2)' },
    green: { bg:'#DCFCE7', text:'#16A34A', border:'rgba(22,163,74,.2)' },
    orange:{ bg:'#FFF7ED', text:'#B45309', border:'rgba(180,83,9,.2)' },
    red:   { bg:'#FFF1F2', text:'#DC2626', border:'rgba(220,38,38,.2)' },
    gray:  { bg:'#F1F5F9', text:'#64748B', border:'#E2E8F0' },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{ display:'inline-flex',alignItems:'center',padding:'3px 10px',borderRadius:999,fontSize:11,fontWeight:600,background:c.bg,color:c.text,border:`1px solid ${c.border}`,...style }}>
      {children}
    </span>
  );
}

/* ─── SHARED UI: Streak Flame ─── */
function StreakFlame({ count = 7 }) {
  return (
    <div style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'4px 12px',background:'linear-gradient(135deg,#FFF7ED,#FEF9C3)',border:'1px solid rgba(180,83,9,.15)',borderRadius:999 }}>
      <span style={{ fontSize:16 }}>🔥</span>
      <span style={{ fontSize:13,fontWeight:700,color:'#B45309' }}>{count} days</span>
    </div>
  );
}

Object.assign(window, { Icon, Sidebar, TopBar, Card, ProgressRing, Badge, StreakFlame });
