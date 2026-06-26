const { useState, useEffect, useRef, useMemo } = React;
// Main App — wraps theme, manages auth state + routing
const PAGES = {
  dashboard: 'PageDashboard',
  tutor:     'PageTutor',
  learn:     'PageLearn',
  practice:  'PagePractice',
  progress:  'PageProgress',
  settings:  'PageSettings',
};

function App() {
  // hash-based routing
  const [page, setPage] = useState(() => {
    const h = window.location.hash.slice(1);
    return h === 'signin' ? 'signin' : (PAGES[h] ? h : 'dashboard');
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sikhya-user') || 'null'); } catch { return null; }
  });
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sikhya-collapsed') === '1');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (p) => {
    if (p === 'signout') {
      localStorage.removeItem('sikhya-user');
      setUser(null);
      window.location.hash = 'signin';
      setPage('signin');
      return;
    }
    setPage(p);
    setMobileOpen(false);
    window.location.hash = p;
  };

  // Sync from hash changes (back/forward)
  useEffect(() => {
    const handler = () => {
      const h = window.location.hash.slice(1);
      if (h === 'signin' || PAGES[h]) setPage(h);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // Persist collapse
  useEffect(() => {
    localStorage.setItem('sikhya-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  // Cmd+K search shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.topbar-search input')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onAuth = (u) => {
    setUser(u);
    localStorage.setItem('sikhya-user', JSON.stringify(u));
    setPage('dashboard');
    window.location.hash = 'dashboard';
  };

  // Force sign in for protected pages if no user
  // — but allow viewing the preview without auth for demo purposes
  if (page === 'signin' || (!user && false)) {
    return <PageSignIn onAuth={onAuth} />;
  }

  const PageComp = window[PAGES[page]] || window.PageDashboard;
  const currentUser = user || { name: 'Arjun Kumar', email: 'arjun@example.com', grade: 'Class 10 · PSEB' };

  return (
    <div className={'app-shell' + (collapsed ? ' collapsed' : '')}>
      <Sidebar
        page={page}
        navigate={navigate}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        user={currentUser}
      />
      <div className="app-main">
        <TopBar page={page} navigate={navigate} onMobileMenu={() => setMobileOpen(true)} />
        <div className="app-content" key={page}>
          <PageComp navigate={navigate} user={currentUser} />
        </div>
      </div>
    </div>
  );
}

// Mount with ThemeProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
