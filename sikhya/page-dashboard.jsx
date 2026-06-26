const { useState, useEffect, useRef, useMemo } = React;
// Dashboard — minimal, focused. Hero + 3 essential modules.
function PageDashboard({ navigate, user }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const [animateProgress, setAnimateProgress] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimateProgress(true), 80);
    return () => clearTimeout(t);
  }, []);

  // The ONE primary task — continue last lesson
  const continueWith = {
    subject: 'Science', chapter: 'Ch. 6 — Life Processes', progress: 62,
    nextTopic: 'Human Respiratory System',
  };

  const subjects = [
    { name: 'Science', pct: 78, accent: '#2563EB' },
    { name: 'Math',    pct: 64, accent: '#16A34A' },
    { name: 'English', pct: 85, accent: '#7C3AED' },
    { name: 'SST',     pct: 52, accent: '#B45309' },
  ];

  const todaysFocus = [
    { type: 'Review',    label: 'Newton\'s 3rd Law',          dur: '8 min',  tone: 'accent'  },
    { type: 'Practice',  label: 'Quadratic Equations',        dur: '15 min', tone: 'warn'    },
    { type: 'Read',      label: 'Photosynthesis (Ch. 5)',     dur: '12 min', tone: 'neutral' },
  ];

  return (
    <div className="page-enter" style={{
      padding: '28px 32px 80px',
      maxWidth: 1200, margin: '0 auto',
      fontFamily: 'var(--font-body)',
    }}>
      {/* ─── HERO BLOCK ─── */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{today}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-strong)' }} />
          <Badge variant="warn" size="sm">🔥 7-day streak</Badge>
        </div>
        <h1 className="font-head" style={{
          fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 700,
          color: 'var(--text)', letterSpacing: '-.03em', lineHeight: 1.15,
          maxWidth: 720,
        }}>
          {greeting}, {user?.name?.split(' ')[0] || 'Arjun'}.<br />
          <span style={{ color: 'var(--muted)' }}>
            Ready to pick up where you left off?
          </span>
        </h1>
      </section>

      {/* ─── PRIMARY: CONTINUE CARD (full width, the hero action) ─── */}
      <section style={{ marginBottom: 24 }}>
        <Card padding={0} hover glow style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'stretch' }}>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Badge variant="accent" size="sm">Continue Learning</Badge>
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{continueWith.subject}</span>
              </div>
              <h2 className="font-head" style={{
                fontSize: 22, fontWeight: 700, color: 'var(--text)',
                letterSpacing: '-.02em', marginBottom: 6,
              }}>{continueWith.chapter}</h2>
              <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginBottom: 18 }}>
                Up next: <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{continueWith.nextTopic}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <ProgressBar value={animateProgress ? continueWith.progress : 0} height={5} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                  {continueWith.progress}%
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button variant="primary" size="md" iconRight="arrow" onClick={() => navigate('learn')}>
                  Resume lesson
                </Button>
                <Button variant="ghost" size="md" icon="sparkles" onClick={() => navigate('tutor')}>
                  Ask the AI
                </Button>
              </div>
            </div>

            {/* Right visual — abstract decoration */}
            <div style={{
              width: 200, position: 'relative', overflow: 'hidden',
              background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            className="hero-decor">
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,.25) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,255,255,.15) 0%, transparent 50%)',
              }} />
              <div style={{
                position: 'relative', color: '#fff', textAlign: 'center', padding: 24,
              }}>
                <div style={{ fontSize: 56, fontWeight: 800, fontFamily: 'var(--font-head)', letterSpacing: '-.04em', lineHeight: 1 }}>
                  3<span style={{ opacity: .6, fontSize: 30 }}>/5</span>
                </div>
                <div style={{ fontSize: 11.5, opacity: .8, fontWeight: 500, marginTop: 6 }}>topics done</div>
              </div>
              <div style={{
                position: 'absolute', bottom: -40, right: -40,
                width: 120, height: 120, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,.15)',
              }} />
              <div style={{
                position: 'absolute', top: -30, left: -30,
                width: 90, height: 90, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,.1)',
              }} />
            </div>
            <style>{`@media (max-width: 700px) { .hero-decor { display: none !important; } }`}</style>
          </div>
        </Card>
      </section>

      {/* ─── TWO-COLUMN: Today's Focus + Subjects ─── */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 24,
      }} className="grid-two">
        <style>{`@media (max-width: 900px) { .grid-two { grid-template-columns: 1fr !important; } }`}</style>

        {/* TODAY'S FOCUS */}
        <Card padding={20}>
          <SectionHeader
            title="Today's focus"
            subtitle="Three quick wins curated for you"
            action={<Button variant="ghost" size="sm" iconRight="arrow" onClick={() => navigate('practice')}>See all</Button>}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {todaysFocus.map((item, i) => (
              <FocusRow key={i} item={item} last={i === todaysFocus.length - 1} onClick={() => navigate('practice')} />
            ))}
          </div>
        </Card>

        {/* SUBJECTS */}
        <Card padding={20}>
          <SectionHeader title="Subjects" subtitle="This week's progress" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {subjects.map((sub, i) => (
              <div key={sub.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{sub.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                    {animateProgress ? sub.pct : 0}%
                  </span>
                </div>
                <ProgressBar value={animateProgress ? sub.pct : 0} color={sub.accent} height={5} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
      }} className="grid-stats">
        <style>{`@media (max-width: 700px) { .grid-stats { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>

        <StatTile label="Questions solved" value="47" delta="+12" trend="up" />
        <StatTile label="Study time" value="3h 24m" delta="vs 2h Mon" trend="up" />
        <StatTile label="Accuracy" value="78%" delta="+7%" trend="up" />
        <StatTile label="Streak" value="7 days" delta="🔥" trend="neutral" />
      </section>
    </div>
  );
}

function FocusRow({ item, last, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 4px',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'all .18s',
        transform: hov ? 'translateX(3px)' : 'none',
      }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: item.tone === 'accent' ? 'var(--accent-soft)'
                  : item.tone === 'warn'   ? 'rgba(217,119,6,.1)'
                  : 'var(--subtle)',
        color: item.tone === 'accent' ? 'var(--accent)'
             : item.tone === 'warn'   ? 'var(--warning)'
             : 'var(--text-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon name={item.type === 'Review' ? 'refresh' : item.type === 'Practice' ? 'edit' : 'book'} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>
          {item.type}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{item.label}</div>
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{item.dur}</span>
      <Icon name="chev_right" size={16} style={{ color: hov ? 'var(--text)' : 'var(--muted)', transition: 'color .18s' }} />
    </div>
  );
}

function StatTile({ label, value, delta, trend }) {
  return (
    <Card padding={16} hover>
      <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>
        {label}
      </div>
      <div className="font-head" style={{
        fontSize: 24, fontWeight: 700, color: 'var(--text)',
        letterSpacing: '-.02em', lineHeight: 1, marginBottom: 6,
      }}>{value}</div>
      <div style={{
        fontSize: 11.5, fontWeight: 500,
        color: trend === 'up' ? 'var(--accent-2)' : trend === 'down' ? 'var(--danger)' : 'var(--muted)',
      }}>{delta}</div>
    </Card>
  );
}

window.PageDashboard = PageDashboard;
