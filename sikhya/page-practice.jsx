const { useState, useEffect, useRef, useMemo } = React;
// Practice — quiz-style topic cards, minimal
function PagePractice({ navigate }) {
  const filters = ['All', 'Weak topics', 'Recent', 'Quick (5 min)'];
  const [filter, setFilter] = useState('All');

  const sets = [
    { subject: 'Math',    title: 'Quadratic Equations',     qs: 12, mins: 15, difficulty: 'medium', accuracy: 42, weak: true },
    { subject: 'Science', title: 'Chemical Bonding',         qs: 10, mins: 12, difficulty: 'hard',   accuracy: 48, weak: true },
    { subject: 'SST',     title: 'French Revolution',        qs: 15, mins: 18, difficulty: 'easy',   accuracy: 51, weak: true },
    { subject: 'Math',    title: 'Trigonometry — Heights',   qs: 8,  mins: 10, difficulty: 'medium', accuracy: 72 },
    { subject: 'Science', title: 'Light & Reflection',       qs: 10, mins: 12, difficulty: 'easy',   accuracy: 85 },
    { subject: 'English', title: 'Grammar — Tenses',         qs: 20, mins: 20, difficulty: 'easy',   accuracy: 78 },
  ];

  let filtered = sets;
  if (filter === 'Weak topics') filtered = sets.filter(s => s.weak);
  if (filter === 'Quick (5 min)') filtered = sets.filter(s => s.mins <= 12);

  return (
    <div className="page-enter" style={{ padding: '28px 32px 80px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Stats strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28,
      }} className="practice-stats">
        <style>{`@media (max-width: 700px) { .practice-stats { grid-template-columns: 1fr !important; } }`}</style>

        <PracticeStat label="Solved this week"  value="47"  hint="Goal: 60"          progress={78} />
        <PracticeStat label="Avg accuracy"      value="78%" hint="↑ 7% vs last week"   progress={78} color="var(--accent-2)" />
        <PracticeStat label="Weak topics"       value="3"   hint="Practice these next" progress={null} />
      </div>

      <SectionHeader
        title="Practice sets"
        subtitle="Built from your syllabus and past mistakes"
      />

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className="focus-ring" style={{
            padding: '6px 14px',
            background: filter === f ? 'var(--accent-soft)' : 'transparent',
            color: filter === f ? 'var(--accent)' : 'var(--text-2)',
            border: '1px solid ' + (filter === f ? 'var(--accent-ring)' : 'var(--border)'),
            borderRadius: 999, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
          }}>{f}</button>
        ))}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14,
      }}>
        {filtered.map((s, i) => <PracticeCard key={i} set={s} onStart={() => navigate('tutor')} />)}
      </div>
    </div>
  );
}

function PracticeStat({ label, value, hint, progress, color }) {
  return (
    <Card padding={18}>
      <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>
        {label}
      </div>
      <div className="font-head" style={{
        fontSize: 28, fontWeight: 700, color: 'var(--text)',
        letterSpacing: '-.025em', lineHeight: 1, marginBottom: 8,
      }}>{value}</div>
      {progress != null && <ProgressBar value={progress} height={4} color={color} />}
      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>{hint}</div>
    </Card>
  );
}

function PracticeCard({ set, onStart }) {
  const [hov, setHov] = useState(false);
  const diffColor = { easy: 'var(--accent-2)', medium: 'var(--warning)', hard: 'var(--danger)' }[set.difficulty];
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onStart}
      style={{
        background: 'var(--surface)',
        border: '1px solid ' + (hov ? 'var(--border-strong)' : 'var(--border)'),
        borderRadius: 14,
        padding: 18,
        cursor: 'pointer',
        transition: 'all .25s cubic-bezier(.4,0,.2,1)',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? 'var(--shadow-2)' : 'var(--shadow-1)',
        position: 'relative', overflow: 'hidden',
      }}>
      {/* subtle gradient bar on top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: set.weak ? 'var(--gradient)' : 'transparent',
        opacity: hov ? 1 : .5,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          {set.subject}
        </span>
        {set.weak && <Badge variant="warn" size="sm">Weak</Badge>}
      </div>

      <h3 className="font-head" style={{
        fontSize: 15, fontWeight: 700, color: 'var(--text)',
        marginBottom: 14, lineHeight: 1.3,
      }}>{set.title}</h3>

      <div style={{
        display: 'flex', gap: 14,
        paddingTop: 12, borderTop: '1px solid var(--border)',
        fontSize: 11.5, color: 'var(--text-2)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name="edit" size={12} style={{ color: 'var(--muted)' }} /> {set.qs} Qs
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name="clock" size={12} style={{ color: 'var(--muted)' }} /> {set.mins}m
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: diffColor }} />
          <span style={{ textTransform: 'capitalize' }}>{set.difficulty}</span>
        </span>
      </div>

      {set.accuracy != null && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--muted)', marginBottom: 4 }}>
            <span>Your accuracy</span>
            <span style={{ color: 'var(--text)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{set.accuracy}%</span>
          </div>
          <ProgressBar value={set.accuracy} height={3} color={set.accuracy > 70 ? 'var(--accent-2)' : 'var(--warning)'} />
        </div>
      )}
    </div>
  );
}

window.PagePractice = PagePractice;
