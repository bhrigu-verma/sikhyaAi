const { useState, useEffect, useRef, useMemo } = React;
// Learn — chapter list, minimal
function PageLearn({ navigate }) {
  const [activeSubject, setActiveSubject] = useState('Science');

  const subjects = ['Science', 'Math', 'English', 'SST'];

  const chapters = {
    Science: [
      { n: 1, title: 'Chemical Reactions',         status: 'done',     topics: 8, progress: 100 },
      { n: 2, title: 'Acids, Bases & Salts',       status: 'done',     topics: 6, progress: 100 },
      { n: 3, title: 'Metals & Non-metals',        status: 'done',     topics: 7, progress: 100 },
      { n: 4, title: 'Carbon & Its Compounds',     status: 'done',     topics: 9, progress: 100 },
      { n: 5, title: 'Light — Reflection',         status: 'done',     topics: 5, progress: 100 },
      { n: 6, title: 'Life Processes',             status: 'active',   topics: 5, progress: 62 },
      { n: 7, title: 'Control & Coordination',     status: 'upcoming', topics: 6, progress: 0 },
      { n: 8, title: 'Reproduction',               status: 'upcoming', topics: 7, progress: 0 },
      { n: 9, title: 'Heredity & Evolution',       status: 'upcoming', topics: 5, progress: 0 },
    ],
    Math:    [{ n: 1, title: 'Real Numbers', status: 'done', topics: 4, progress: 100 }],
    English: [{ n: 1, title: 'A Letter to God', status: 'done', topics: 3, progress: 100 }],
    SST:     [{ n: 1, title: 'Rise of Nationalism', status: 'active', topics: 5, progress: 40 }],
  };

  const list = chapters[activeSubject] || [];

  return (
    <div className="page-enter" style={{ padding: '28px 32px 80px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Subject tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {subjects.map(s => (
          <button key={s} onClick={() => setActiveSubject(s)} className="focus-ring" style={{
            padding: '8px 16px',
            background: activeSubject === s ? 'var(--text)' : 'transparent',
            color: activeSubject === s ? 'var(--bg)' : 'var(--text-2)',
            border: '1px solid ' + (activeSubject === s ? 'var(--text)' : 'var(--border)'),
            borderRadius: 10, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
          }}>{s}</button>
        ))}
      </div>

      <SectionHeader
        title={`${activeSubject} · Class 10 PSEB`}
        subtitle={`${list.filter(c => c.status === 'done').length} of ${list.length} chapters complete`}
        action={<Button variant="ghost" size="sm" icon="filter">Filter</Button>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map(ch => <ChapterRow key={ch.n} ch={ch} subject={activeSubject} onOpen={() => navigate('tutor')} />)}
      </div>
    </div>
  );
}

function ChapterRow({ ch, subject, onOpen }) {
  const [hov, setHov] = useState(false);
  const isDone     = ch.status === 'done';
  const isActive   = ch.status === 'active';
  const isUpcoming = ch.status === 'upcoming';

  return (
    <Card padding={0} hover onClick={onOpen}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '56px 1fr auto auto',
          alignItems: 'center', gap: 16,
          padding: '16px 20px',
        }}>
        {/* Chapter number */}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: isDone     ? 'rgba(22,163,74,.1)'
                    : isActive   ? 'var(--accent-soft)'
                    : 'var(--subtle)',
          color: isDone ? 'var(--accent-2)' : isActive ? 'var(--accent)' : 'var(--muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14,
        }}>
          {isDone ? <Icon name="check" size={18} /> : `0${ch.n}`}
        </div>

        {/* Title + meta */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}>{ch.title}</span>
            {isActive && <Badge variant="accent" size="sm">In progress</Badge>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            {ch.topics} topics · Chapter {ch.n}
            {isActive && ` · ${ch.progress}% complete`}
          </div>
        </div>

        {/* Progress mini */}
        <div style={{ width: 120, display: isUpcoming ? 'none' : 'block' }} className="ch-progress">
          <ProgressBar value={ch.progress} height={4} color={isDone ? 'var(--accent-2)' : undefined} />
        </div>
        <style>{`@media (max-width: 700px) { .ch-progress { display: none !important; } }`}</style>

        {/* Action */}
        <div style={{
          color: hov ? 'var(--accent)' : 'var(--muted)',
          transition: 'all .18s',
          transform: hov ? 'translateX(2px)' : 'none',
        }}>
          <Icon name="arrow" size={16} />
        </div>
      </div>
    </Card>
  );
}

window.PageLearn = PageLearn;
