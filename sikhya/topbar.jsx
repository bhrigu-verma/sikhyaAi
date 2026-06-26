const { useState, useEffect, useRef, useMemo } = React;
// TopBar — page title, search, theme toggle, notifications
function TopBar({ page, navigate, onMobileMenu }) {
  const { theme, toggle } = useTheme();
  const meta = {
    dashboard: { title: 'Overview',     sub: 'Your learning at a glance' },
    tutor:     { title: 'AI Tutor',     sub: 'Ask anything in any language' },
    learn:     { title: 'Learn',        sub: 'Class 10 · PSEB syllabus' },
    practice:  { title: 'Practice',     sub: 'Drill what matters most' },
    tests:     { title: 'Tests',        sub: 'Mock exams and assessments' },
    progress:  { title: 'Progress',     sub: 'Where you stand, what to focus on' },
    settings:  { title: 'Settings',     sub: 'API keys, preferences, account' },
    profile:   { title: 'Profile',      sub: 'Your account' },
  }[page] || { title: page, sub: '' };

  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header style={{
      height: 60, flexShrink: 0,
      background: 'rgba(var(--surface-rgb, 255,255,255), .7)',
      backgroundColor: 'var(--surface)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 14,
      position: 'sticky', top: 0, zIndex: 30,
    }}>
      {/* mobile menu */}
      <button
        onClick={onMobileMenu}
        className="focus-ring"
        style={{
          display: 'none', width: 36, height: 36,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--text-2)', borderRadius: 8,
          alignItems: 'center', justifyContent: 'center',
        }}>
        <Icon name="menu" size={18} />
      </button>
      <style>{`@media (max-width: 900px) { header button[data-mobile-menu] { display: flex !important; } }`}</style>

      {/* Title */}
      <div style={{ minWidth: 0 }}>
        <h1 className="font-head" style={{
          fontSize: 16, fontWeight: 700, color: 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{meta.title}</h1>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>{meta.sub}</div>
      </div>

      {/* Search — center-aligned, hidden on mobile */}
      <div style={{
        flex: 1, maxWidth: 420, marginLeft: 24,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 10px',
        background: 'var(--subtle)',
        border: '1px solid var(--border)',
        borderRadius: 9,
        transition: 'all .2s',
      }}
      className="topbar-search">
        <Icon name="search" size={14} style={{ color: 'var(--muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search lessons, topics, papers…"
          style={{
            flex: 1, padding: '8px 0', background: 'transparent', border: 'none',
            fontSize: 13, color: 'var(--text)',
          }}
        />
        <Kbd>⌘K</Kbd>
      </div>
      <style>{`@media (max-width: 800px) { .topbar-search { display: none !important; } }`}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        {/* Ask AI */}
        {page !== 'tutor' && (
          <Button variant="gradient" size="sm" icon="sparkles" onClick={() => navigate('tutor')}>
            Ask AI
          </Button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="focus-ring"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            width: 36, height: 36,
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-2)',
            borderRadius: 9, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            transition: 'all .2s',
          }}>
          <div style={{
            position: 'absolute',
            transform: theme === 'light' ? 'translateY(0) rotate(0)' : 'translateY(-30px) rotate(90deg)',
            transition: 'transform .35s cubic-bezier(.4,0,.2,1)',
          }}>
            <Icon name="sun" size={16} />
          </div>
          <div style={{
            position: 'absolute',
            transform: theme === 'dark' ? 'translateY(0) rotate(0)' : 'translateY(30px) rotate(-90deg)',
            transition: 'transform .35s cubic-bezier(.4,0,.2,1)',
          }}>
            <Icon name="moon" size={16} />
          </div>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="focus-ring"
            style={{
              width: 36, height: 36,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
              borderRadius: 9, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
            <Icon name="bell" size={16} />
            <div style={{
              position: 'absolute', top: 8, right: 9,
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--accent-2)',
              boxShadow: '0 0 0 2px var(--surface)',
            }} className="pulse"></div>
          </button>
          {notifOpen && <NotificationsDropdown onClose={() => setNotifOpen(false)} />}
        </div>
      </div>
    </header>
  );
}

function NotificationsDropdown({ onClose }) {
  const items = [
    { icon: 'bolt',     title: 'Practice streak: 7 days 🔥', sub: 'Keep going to reach 10!', time: 'now',   tone: 'warn'    },
    { icon: 'check',    title: 'Chapter 6 unlocked',         sub: 'Life Processes — Science',   time: '2h',  tone: 'success' },
    { icon: 'sparkles', title: 'AI summary ready',           sub: 'For French Revolution chat', time: '4h',  tone: 'accent'  },
  ];
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 39 }}></div>
      <div style={{
        position: 'absolute', top: '110%', right: 0, width: 320,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 12, boxShadow: 'var(--shadow-3)', zIndex: 40,
        overflow: 'hidden',
        animation: 'page-in .2s ease',
      }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <span className="font-head" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Notifications</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 11.5, fontWeight: 600 }}>Mark all read</button>
        </div>
        <div>
          {items.map((it, i) => (
            <div key={i} style={{
              padding: '12px 14px', borderBottom: '1px solid var(--border)',
              display: 'flex', gap: 10, alignItems: 'flex-start',
              transition: 'background .15s', cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--subtle)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: it.tone === 'success' ? 'rgba(22,163,74,.1)'
                          : it.tone === 'warn'    ? 'rgba(217,119,6,.12)'
                          : 'var(--accent-soft)',
                color: it.tone === 'success' ? 'var(--accent-2)'
                     : it.tone === 'warn'    ? 'var(--warning)'
                     : 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={it.icon} size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 1 }}>{it.title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{it.sub}</div>
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{it.time}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: 10, textAlign: 'center' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 12, fontWeight: 600 }}>
            View all activity →
          </button>
        </div>
      </div>
    </>
  );
}

window.TopBar = TopBar;
