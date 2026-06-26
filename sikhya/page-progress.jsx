const { useState, useEffect, useRef, useMemo } = React;
// Progress — charts + breakdown
function PageProgress({ navigate }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 100); return () => clearTimeout(t); }, []);

  const weekData = [
    { d: 'Mon', mins: 35 }, { d: 'Tue', mins: 50 }, { d: 'Wed', mins: 80 },
    { d: 'Thu', mins: 45 }, { d: 'Fri', mins: 65 }, { d: 'Sat', mins: 95 },
    { d: 'Sun', mins: 70 },
  ];
  const maxM = Math.max(...weekData.map(d => d.mins));

  const subjects = [
    { name: 'Science', done: 5, total: 9, pct: 56, color: '#2563EB' },
    { name: 'Math',    done: 3, total: 8, pct: 38, color: '#16A34A' },
    { name: 'English', done: 6, total: 7, pct: 86, color: '#7C3AED' },
    { name: 'SST',     done: 2, total: 7, pct: 29, color: '#B45309' },
  ];

  return (
    <div className="page-enter" style={{ padding: '28px 32px 80px', maxWidth: 1100, margin: '0 auto' }}>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }} className="kpi-strip">
        <style>{`@media (max-width: 800px) { .kpi-strip { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
        <KPI label="Weekly study"   value="7h 20m"  delta="+1h 40m"  good />
        <KPI label="Accuracy"        value="78%"     delta="+7%"      good />
        <KPI label="Chapters done"  value="16/31"   delta="+2 chs"   good />
        <KPI label="Best streak"    value="7 days"  delta="Personal best" good />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 24 }} className="grid-2">
        <style>{`@media (max-width: 900px) { .grid-2 { grid-template-columns: 1fr !important; } }`}</style>

        {/* Time bar chart */}
        <Card padding={22}>
          <SectionHeader
            title="Study time"
            subtitle="This week — daily minutes"
            action={<Badge variant="success">↑ 28% vs last week</Badge>}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, marginTop: 12 }}>
            {weekData.map((day, i) => {
              const h = (day.mins / maxM) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: '100%',
                      height: animate ? `${h}%` : '0%',
                      background: i === weekData.length - 1 ? 'var(--gradient)' : 'var(--subtle)',
                      borderRadius: 6,
                      transition: `height .8s cubic-bezier(.4,0,.2,1) ${i*0.06}s`,
                      position: 'relative',
                    }}>
                      <div style={{
                        position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                        fontSize: 10, fontWeight: 600, color: i === weekData.length - 1 ? 'var(--accent)' : 'var(--muted)',
                        fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
                      }}>{day.mins}m</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{day.d}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Accuracy ring */}
        <Card padding={22}>
          <SectionHeader title="Accuracy" subtitle="Overall accuracy rate" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0 16px' }}>
            <RingProgress pct={animate ? 78 : 0} size={160} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--text-2)' }}>
            <Row label="Correct"      value="184 / 236" tone="success" />
            <Row label="Improvement"  value="+7% vs last wk" tone="accent" />
            <Row label="Best subject" value="English (92%)" tone="neutral" />
          </div>
        </Card>
      </div>

      {/* Per-subject */}
      <Card padding={22}>
        <SectionHeader title="By subject" subtitle="Chapters completed" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {subjects.map(sub => (
            <div key={sub.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'baseline' }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{sub.name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                  {sub.done} / {sub.total} chapters
                </span>
              </div>
              <ProgressBar value={animate ? sub.pct : 0} color={sub.color} height={6} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KPI({ label, value, delta, good }) {
  return (
    <Card padding={16} hover>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>{label}</div>
      <div className="font-head" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: 4, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: good ? 'var(--accent-2)' : 'var(--muted)', fontWeight: 500 }}>{delta}</div>
    </Card>
  );
}

function Row({ label, value, tone }) {
  const c = tone === 'success' ? 'var(--accent-2)' : tone === 'accent' ? 'var(--accent)' : 'var(--text)';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ color: c, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function RingProgress({ pct, size = 140 }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--subtle)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="font-head" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)', letterSpacing: '-.03em', lineHeight: 1 }}>
          {Math.round(pct)}<span style={{ fontSize: 16, color: 'var(--muted)' }}>%</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>accuracy</div>
      </div>
    </div>
  );
}

window.PageProgress = PageProgress;
