// RESOURCES PAGE
const { useState } = React;

const TABS = ['Notes','Books','Past Papers','Videos','Worksheets'];

const RESOURCES = {
  Notes: [
    { title:'Chemical Reactions — Summary Notes',    subject:'Science',  class:'10', size:'1.2 MB', type:'PDF',  color:'#2563EB', icon:'📄', date:'May 2026' },
    { title:'Quadratic Equations — Formula Sheet',   subject:'Math',     class:'10', size:'0.8 MB', type:'PDF',  color:'#16A34A', icon:'📄', date:'Apr 2026' },
    { title:'Newton\'s Laws — Concept Map',          subject:'Science',  class:'9',  size:'0.5 MB', type:'PDF',  color:'#2563EB', icon:'🗺️', date:'Apr 2026' },
    { title:'French Revolution — Timeline Notes',    subject:'SST',      class:'10', size:'1.1 MB', type:'PDF',  color:'#B45309', icon:'📄', date:'Mar 2026' },
    { title:'Trigonometry — Quick Reference',        subject:'Math',     class:'10', size:'0.6 MB', type:'PDF',  color:'#16A34A', icon:'📄', date:'Mar 2026' },
    { title:'Life Processes — Diagram Notes',        subject:'Science',  class:'10', size:'2.3 MB', type:'PDF',  color:'#2563EB', icon:'📊', date:'Feb 2026' },
  ],
  Books: [
    { title:'NCERT Science Class 10',              subject:'Science', class:'10', size:'18 MB', type:'PDF', color:'#2563EB', icon:'📚', date:'NCERT 2025' },
    { title:'NCERT Mathematics Class 10',          subject:'Math',    class:'10', size:'22 MB', type:'PDF', color:'#16A34A', icon:'📚', date:'NCERT 2025' },
    { title:'PSEB Science Textbook Class 9',       subject:'Science', class:'9',  size:'15 MB', type:'PDF', color:'#2563EB', icon:'📚', date:'PSEB 2024' },
    { title:'PSEB Mathematics Class 10',           subject:'Math',    class:'10', size:'19 MB', type:'PDF', color:'#16A34A', icon:'📚', date:'PSEB 2024' },
    { title:'NCERT English Footprints Class 10',   subject:'English', class:'10', size:'12 MB', type:'PDF', color:'#7C3AED', icon:'📚', date:'NCERT 2025' },
    { title:'PSEB SST Class 10 — Full Textbook',   subject:'SST',     class:'10', size:'24 MB', type:'PDF', color:'#B45309', icon:'📚', date:'PSEB 2024' },
  ],
  'Past Papers': [
    { title:'PSEB Science Board Exam 2024',        subject:'Science', class:'10', size:'2.1 MB', type:'PDF', color:'#DC2626', icon:'📋', date:'March 2024' },
    { title:'PSEB Mathematics Board Exam 2024',    subject:'Math',    class:'10', size:'1.8 MB', type:'PDF', color:'#DC2626', icon:'📋', date:'March 2024' },
    { title:'PSEB Science Board Exam 2023',        subject:'Science', class:'10', size:'2.0 MB', type:'PDF', color:'#B45309', icon:'📋', date:'March 2023' },
    { title:'PSEB Mathematics Board Exam 2023',    subject:'Math',    class:'10', size:'1.9 MB', type:'PDF', color:'#B45309', icon:'📋', date:'March 2023' },
    { title:'PSEB SST Board Exam 2024',            subject:'SST',     class:'10', size:'1.7 MB', type:'PDF', color:'#DC2626', icon:'📋', date:'March 2024' },
    { title:'PSEB English Board Exam 2024',        subject:'English', class:'10', size:'1.6 MB', type:'PDF', color:'#DC2626', icon:'📋', date:'March 2024' },
  ],
  Videos: [
    { title:'Newton\'s Laws — Full Lecture',       subject:'Science', class:'9',  size:'45 min', type:'Video', color:'#2563EB', icon:'▶️', date:'Sikhya AI' },
    { title:'Quadratic Equations Explained',       subject:'Math',    class:'10', size:'32 min', type:'Video', color:'#16A34A', icon:'▶️', date:'Sikhya AI' },
    { title:'Photosynthesis Animated',             subject:'Science', class:'10', size:'18 min', type:'Video', color:'#2563EB', icon:'▶️', date:'Sikhya AI' },
    { title:'French Revolution — Documentary',     subject:'SST',     class:'10', size:'28 min', type:'Video', color:'#B45309', icon:'▶️', date:'Sikhya AI' },
    { title:'Trigonometry from Scratch',           subject:'Math',    class:'10', size:'55 min', type:'Video', color:'#16A34A', icon:'▶️', date:'Sikhya AI' },
    { title:'The Human Eye & Vision',              subject:'Science', class:'10', size:'22 min', type:'Video', color:'#2563EB', icon:'▶️', date:'Sikhya AI' },
  ],
  Worksheets: [
    { title:'Science Chapter 1–5 Practice Sheet', subject:'Science', class:'10', size:'3.2 MB', type:'PDF', color:'#7C3AED', icon:'✏️', date:'May 2026' },
    { title:'Math Algebra Worksheet',             subject:'Math',    class:'10', size:'1.4 MB', type:'PDF', color:'#7C3AED', icon:'✏️', date:'Apr 2026' },
    { title:'English Grammar Exercises',          subject:'English', class:'10', size:'0.9 MB', type:'PDF', color:'#7C3AED', icon:'✏️', date:'Apr 2026' },
    { title:'SST Map Skills Practice',            subject:'SST',     class:'10', size:'2.1 MB', type:'PDF', color:'#7C3AED', icon:'✏️', date:'Mar 2026' },
    { title:'Physics Numericals Sheet',           subject:'Science', class:'9',  size:'1.6 MB', type:'PDF', color:'#7C3AED', icon:'✏️', date:'Mar 2026' },
    { title:'Trigonometry Practice Problems',     subject:'Math',    class:'10', size:'1.1 MB', type:'PDF', color:'#7C3AED', icon:'✏️', date:'Feb 2026' },
  ],
};

const SUB_COLORS = { Science:'#2563EB', Math:'#16A34A', English:'#7C3AED', SST:'#B45309', Hindi:'#DC2626', Punjabi:'#0891B2' };

function Resources({ navigate }) {
  const [tab, setTab]       = useState('Notes');
  const [search, setSearch] = useState('');
  const [subFilter, setSubFilter] = useState('All');

  const items = (RESOURCES[tab] || []).filter(r =>
    (subFilter === 'All' || r.subject === subFilter) &&
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const S = {
    page:    { padding:'28px 32px',minHeight:'calc(100vh - 60px)',background:'#F8FAFC',fontFamily:"'Sora',sans-serif" },
    topRow:  { display:'flex',gap:12,alignItems:'center',marginBottom:20,flexWrap:'wrap' },
    searchBox:{ display:'flex',alignItems:'center',gap:10,background:'#fff',border:'1.5px solid #E2E8F0',borderRadius:10,padding:'9px 14px',flex:1,maxWidth:360,transition:'border-color .2s' },
    searchInp:{ background:'none',border:'none',fontFamily:"'Sora',sans-serif",fontSize:14,color:'#0F172A',outline:'none',width:'100%' },
    tabRow:  { display:'flex',gap:2,background:'#fff',border:'1px solid #E2E8F0',borderRadius:12,padding:4,marginBottom:20 },
    tabBtn:  (act) => ({ flex:1,padding:'8px 4px',border:'none',borderRadius:9,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:act?700:500,color:act?'#2563EB':'#64748B',background:act?'#EFF6FF':'none',cursor:'pointer',transition:'all .2s',whiteSpace:'nowrap' }),
    subRow:  { display:'flex',gap:6,marginBottom:20,flexWrap:'wrap' },
    subBtn:  (act,col) => ({ padding:'5px 14px',borderRadius:999,fontSize:12,fontWeight:act?700:500,border:'1.5px solid',borderColor:act?(col||'#2563EB'):'#E2E8F0',background:act?(col+'18'||'#EFF6FF'):'#fff',color:act?(col||'#2563EB'):'#64748B',cursor:'pointer',fontFamily:"'Sora',sans-serif",transition:'all .2s' }),
    grid:    { display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16 },
    card:    { background:'#fff',border:'1px solid #E2E8F0',borderRadius:14,padding:20,transition:'all .25s',cursor:'default' },
    cardIcon:{ fontSize:28,marginBottom:12 },
    cardH:   { fontSize:14,fontWeight:700,color:'#0F172A',lineHeight:1.4,marginBottom:8 },
    cardMeta:{ display:'flex',gap:8,alignItems:'center',marginBottom:14,flexWrap:'wrap' },
    tag:     (col) => ({ padding:'2px 8px',borderRadius:999,fontSize:10,fontWeight:600,background:col+'15',color:col,border:`1px solid ${col}25` }),
    btns:    { display:'flex',gap:8 },
    dlBtn:   { flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'8px',background:'linear-gradient(135deg,#2563EB,#16A34A)',color:'#fff',border:'none',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:600,cursor:'pointer',transition:'all .2s' },
    prevBtn: { padding:'8px 12px',background:'#F8FAFC',border:'1.5px solid #E2E8F0',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:600,color:'#64748B',cursor:'pointer',display:'flex',alignItems:'center',gap:4,transition:'all .2s' },
    empty:   { textAlign:'center',padding:'64px 0',color:'#94A3B8' },
  };

  return (
    <div style={S.page}>
      {/* Top row: search */}
      <div style={S.topRow}>
        <div style={S.searchBox}>
          <Icon name="search" size={15} />
          <input style={S.searchInp} placeholder="Search resources..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div style={{ marginLeft:'auto',display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#64748B' }}>
          <span style={{ fontWeight:600,color:'#0F172A' }}>{items.length}</span> resources
        </div>
      </div>

      {/* Tab bar */}
      <div style={S.tabRow}>
        {TABS.map(t => (
          <button key={t} style={S.tabBtn(tab===t)} onClick={() => { setTab(t); setSearch(''); setSubFilter('All'); }}>
            {t}
          </button>
        ))}
      </div>

      {/* Subject filter */}
      <div style={S.subRow}>
        <button style={S.subBtn(subFilter==='All','#2563EB')} onClick={()=>setSubFilter('All')}>All Subjects</button>
        {['Science','Math','English','SST'].map(s => (
          <button key={s} style={S.subBtn(subFilter===s, SUB_COLORS[s])} onClick={()=>setSubFilter(s)}>{s}</button>
        ))}
      </div>

      {/* Resource grid */}
      {items.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize:40,marginBottom:12 }}>📂</div>
          <div style={{ fontSize:16,fontWeight:600,color:'#64748B' }}>No resources found</div>
          <div style={{ fontSize:13,color:'#94A3B8',marginTop:4 }}>Try a different filter or search term</div>
        </div>
      ) : (
        <div style={S.grid}>
          {items.map((r,i) => (
            <div key={i} style={S.card}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(15,23,42,.08)'; e.currentTarget.style.borderColor='#CBD5E1'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor='#E2E8F0'; }}>
              <div style={S.cardIcon}>{r.icon}</div>
              <div style={S.cardH}>{r.title}</div>
              <div style={S.cardMeta}>
                <span style={S.tag(SUB_COLORS[r.subject]||'#2563EB')}>{r.subject}</span>
                <span style={S.tag('#64748B')}>Class {r.class}</span>
                <span style={{ fontSize:11,color:'#94A3B8' }}>{r.size}</span>
              </div>
              <div style={{ fontSize:11,color:'#94A3B8',marginBottom:12 }}>{r.date}</div>
              <div style={S.btns}>
                <button style={S.dlBtn}
                  onMouseEnter={e=>e.currentTarget.style.transform='scale(1.02)'}
                  onMouseLeave={e=>e.currentTarget.style.transform=''}>
                  <Icon name="download" size={13} />
                  {r.type === 'Video' ? 'Watch' : 'Download'}
                </button>
                <button style={S.prevBtn}
                  onMouseEnter={e=>{ e.currentTarget.style.background='#F1F5F9'; e.currentTarget.style.borderColor='#CBD5E1'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.borderColor='#E2E8F0'; }}>
                  <Icon name="external" size={12} />Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Resources });
