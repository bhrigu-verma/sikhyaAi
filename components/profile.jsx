// PROFILE / SETTINGS PAGE
const { useState } = React;

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width:42,height:24,background:value?'#2563EB':'#E2E8F0',borderRadius:12,position:'relative',cursor:'pointer',transition:'background .25s',flexShrink:0 }}>
      <div style={{ width:18,height:18,background:'#fff',borderRadius:'50%',position:'absolute',top:3,left: value?21:3,transition:'left .25s',boxShadow:'0 1px 4px rgba(0,0,0,.15)' }}></div>
    </div>
  );
}

function Select({ value, options, onChange }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ padding:'7px 12px',border:'1.5px solid #E2E8F0',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:13,color:'#0F172A',background:'#F8FAFC',outline:'none',cursor:'pointer' }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background:'#fff',border:'1px solid #E2E8F0',borderRadius:14,marginBottom:16,overflow:'hidden' }}>
      <div style={{ padding:'16px 24px',borderBottom:'1px solid #E2E8F0',fontSize:14,fontWeight:700,color:'#0F172A' }}>{title}</div>
      <div style={{ padding:'8px 0' }}>{children}</div>
    </div>
  );
}

function SettingRow({ label, sub, children }) {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 24px',borderBottom:'1px solid #F8FAFC' }}>
      <div>
        <div style={{ fontSize:14,fontWeight:500,color:'#0F172A' }}>{label}</div>
        {sub && <div style={{ fontSize:12,color:'#94A3B8',marginTop:2 }}>{sub}</div>}
      </div>
      <div style={{ flexShrink:0,marginLeft:16 }}>{children}</div>
    </div>
  );
}

function Profile({ navigate }) {
  const [prefs, setPrefs] = useState({
    class:'10', board:'PSEB', medium:'English',
    language:'English', theme:'Light',
    notifDaily:true, notifStreak:true, notifTest:false, notifTips:true,
    sound:false, autoSave:true,
  });
  const set = (k,v) => setPrefs(p=>({...p,[k]:v}));
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const S = {
    page:   { padding:'28px 32px',minHeight:'calc(100vh - 60px)',background:'#F8FAFC',fontFamily:"'Sora',sans-serif" },
    layout: { display:'grid',gridTemplateColumns:'280px 1fr',gap:20,alignItems:'start' },
    profileCard: { background:'#fff',border:'1px solid #E2E8F0',borderRadius:16,padding:24,marginBottom:16,textAlign:'center' },
    av:     { width:80,height:80,background:'linear-gradient(135deg,#2563EB,#16A34A)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:32,fontWeight:800,margin:'0 auto 16px' },
    name:   { fontSize:18,fontWeight:800,color:'#0F172A',marginBottom:4 },
    meta:   { fontSize:13,color:'#64748B',marginBottom:16 },
    statRow:{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 },
    statBox:{ background:'#F8FAFC',borderRadius:10,padding:'12px 10px',textAlign:'center' },
    statN:  { fontSize:20,fontWeight:800,color:'#0F172A',letterSpacing:'-.03em' },
    statL:  { fontSize:11,color:'#64748B',marginTop:2 },
    editBtn:{ width:'100%',padding:'9px',marginTop:16,background:'#F8FAFC',border:'1.5px solid #E2E8F0',borderRadius:10,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,color:'#2563EB',cursor:'pointer',transition:'all .2s' },
    right:  { },
    saveBar:{ position:'sticky',bottom:20,background:'#fff',border:'1px solid #E2E8F0',borderRadius:12,padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 4px 16px rgba(15,23,42,.1)',marginTop:16 },
    saveBtn:{ padding:'10px 24px',background:'linear-gradient(135deg,#2563EB,#16A34A)',color:'#fff',border:'none',borderRadius:9,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,cursor:'pointer',transition:'all .2s' },
    discardBtn:{ padding:'10px 20px',background:'none',border:'1.5px solid #E2E8F0',borderRadius:9,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:600,color:'#64748B',cursor:'pointer' },
    dangerBtn:{ display:'flex',alignItems:'center',gap:8,padding:'11px 24px',border:'1.5px solid #FCA5A5',background:'#FFF1F2',borderRadius:10,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:600,color:'#DC2626',cursor:'pointer',transition:'all .2s',width:'100%',justifyContent:'center' },
    chipRow:{ display:'flex',gap:6,flexWrap:'wrap' },
    chip:   (act,col) => ({ padding:'5px 14px',borderRadius:999,fontSize:12,fontWeight:act?700:500,border:'1.5px solid',borderColor:act?(col||'#2563EB'):'#E2E8F0',background:act?(col+'18'||'#EFF6FF'):'#F8FAFC',color:act?(col||'#2563EB'):'#64748B',cursor:'pointer',fontFamily:"'Sora',sans-serif",transition:'all .2s' }),
  };

  return (
    <div style={S.page}>
      <div style={S.layout}>
        {/* Left: profile card */}
        <div>
          <div style={S.profileCard}>
            <div style={S.av}>A</div>
            <div style={S.name}>Arjun Kumar</div>
            <div style={S.meta}>arjun.kumar@email.com</div>
            <div style={{ marginBottom:12 }}>
              <StreakFlame count={7} />
            </div>
            <div style={S.statRow}>
              <div style={S.statBox}>
                <div style={S.statN}>91</div>
                <div style={S.statL}>Questions Today</div>
              </div>
              <div style={S.statBox}>
                <div style={S.statN}>78%</div>
                <div style={S.statL}>Accuracy</div>
              </div>
              <div style={S.statBox}>
                <div style={S.statN}>1,240</div>
                <div style={S.statL}>Total Questions</div>
              </div>
              <div style={S.statBox}>
                <div style={S.statN}>21</div>
                <div style={S.statL}>Days Active</div>
              </div>
            </div>
            <button style={S.editBtn}
              onMouseEnter={e=>{ e.currentTarget.style.background='#EFF6FF'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='#F8FAFC'; }}>
              Edit Profile Photo
            </button>
          </div>

          <div style={{ background:'#fff',border:'1px solid #E2E8F0',borderRadius:14,overflow:'hidden' }}>
            <div style={{ padding:'16px 20px',borderBottom:'1px solid #E2E8F0',fontSize:14,fontWeight:700,color:'#0F172A' }}>Quick Links</div>
            {[
              {label:'View Progress',icon:'chart',id:'progress'},
              {label:'Practice Now',icon:'pencil',id:'practice'},
              {label:'Ask AI Tutor',icon:'chat',id:'tutor'},
            ].map(l=>(
              <div key={l.id} onClick={()=>navigate(l.id)}
                style={{ display:'flex',alignItems:'center',gap:10,padding:'12px 20px',cursor:'pointer',borderBottom:'1px solid #F8FAFC',transition:'background .2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                onMouseLeave={e=>e.currentTarget.style.background=''}>
                <Icon name={l.icon} size={16} /><span style={{ fontSize:14,color:'#0F172A',fontWeight:500 }}>{l.label}</span>
                <Icon name="chevright" size={14} style={{ marginLeft:'auto',color:'#94A3B8' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: settings */}
        <div style={S.right}>
          <SectionCard title="Learning Preferences">
            <SettingRow label="Class" sub="Your current class level">
              <div style={S.chipRow}>
                {['8','9','10','11','12'].map(c=>(
                  <button key={c} style={S.chip(prefs.class===c,'#2563EB')} onClick={()=>set('class',c)}>{c}</button>
                ))}
              </div>
            </SettingRow>
            <SettingRow label="Board" sub="Your examination board">
              <div style={S.chipRow}>
                {['PSEB','CBSE','ICSE','Other'].map(b=>(
                  <button key={b} style={S.chip(prefs.board===b,'#2563EB')} onClick={()=>set('board',b)}>{b}</button>
                ))}
              </div>
            </SettingRow>
            <SettingRow label="Medium" sub="Language of instruction">
              <div style={S.chipRow}>
                {['English','Hindi','Punjabi'].map(m=>(
                  <button key={m} style={S.chip(prefs.medium===m,'#16A34A')} onClick={()=>set('medium',m)}>{m}</button>
                ))}
              </div>
            </SettingRow>
          </SectionCard>

          <SectionCard title="App Preferences">
            <SettingRow label="Language" sub="Interface language">
              <Select value={prefs.language} options={['English','Hindi','Punjabi']} onChange={v=>set('language',v)} />
            </SettingRow>
            <SettingRow label="Theme" sub="Light or dark interface">
              <div style={S.chipRow}>
                {['Light','Dark','Auto'].map(t=>(
                  <button key={t} style={S.chip(prefs.theme===t,'#7C3AED')} onClick={()=>set('theme',t)}>{t}</button>
                ))}
              </div>
            </SettingRow>
            <SettingRow label="Auto-save chats" sub="Save AI conversations automatically">
              <Toggle value={prefs.autoSave} onChange={v=>set('autoSave',v)} />
            </SettingRow>
            <SettingRow label="Sound effects" sub="Notification and feedback sounds">
              <Toggle value={prefs.sound} onChange={v=>set('sound',v)} />
            </SettingRow>
          </SectionCard>

          <SectionCard title="Notifications">
            <SettingRow label="Daily reminder" sub="Remind me to study every day">
              <Toggle value={prefs.notifDaily} onChange={v=>set('notifDaily',v)} />
            </SettingRow>
            <SettingRow label="Streak alerts" sub="Alert when streak is about to break">
              <Toggle value={prefs.notifStreak} onChange={v=>set('notifStreak',v)} />
            </SettingRow>
            <SettingRow label="Test reminders" sub="Upcoming test and exam alerts">
              <Toggle value={prefs.notifTest} onChange={v=>set('notifTest',v)} />
            </SettingRow>
            <SettingRow label="Learning tips" sub="Weekly tips to improve your study">
              <Toggle value={prefs.notifTips} onChange={v=>set('notifTips',v)} />
            </SettingRow>
          </SectionCard>

          <SectionCard title="Account">
            <SettingRow label="Email" sub="arjun.kumar@email.com">
              <button style={{ padding:'7px 14px',border:'1.5px solid #E2E8F0',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,color:'#2563EB',background:'none',cursor:'pointer' }}>Change</button>
            </SettingRow>
            <SettingRow label="Password" sub="Last changed 3 months ago">
              <button style={{ padding:'7px 14px',border:'1.5px solid #E2E8F0',borderRadius:8,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,color:'#2563EB',background:'none',cursor:'pointer' }}>Update</button>
            </SettingRow>
            <div style={{ padding:'16px 24px' }}>
              <button style={S.dangerBtn}
                onMouseEnter={e=>{ e.currentTarget.style.background='#FEE2E2'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='#FFF1F2'; }}
                onClick={()=>window.location.href='index.html'}>
                <Icon name="logout" size={16} />Sign Out
              </button>
            </div>
          </SectionCard>

          <div style={S.saveBar}>
            <div style={{ fontSize:13,color:saved?'#16A34A':'#64748B',fontWeight:saved?700:400 }}>
              {saved ? '✓ Settings saved successfully!' : 'Changes will be saved when you click Save.'}
            </div>
            <div style={{ display:'flex',gap:8 }}>
              <button style={S.discardBtn}>Discard</button>
              <button style={S.saveBtn} onClick={saveSettings}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                onMouseLeave={e=>e.currentTarget.style.transform=''}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Profile });
