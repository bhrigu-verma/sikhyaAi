const { useState, useEffect, useRef, useMemo } = React;
// Sidebar — minimal, collapsible, glass-on-dark feel
const NAV_PRIMARY = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'tutor',     label: 'AI Tutor',  icon: 'sparkles' },
  { id: 'learn',     label: 'Learn',     icon: 'book' },
  { id: 'practice',  label: 'Practice',  icon: 'edit' },
  { id: 'progress',  label: 'Progress',  icon: 'chart' },
];

const NAV_SECONDARY = [
  { id: 'settings',  label: 'Settings',  icon: 'settings' },
];

function NavItem({ active, collapsed, label, icon, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={collapsed ? label : undefined}
      className="focus-ring"
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '10px' : '9px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: active ? 'var(--surface-2)' : hov ? 'var(--subtle)' : 'transparent',
        color: active ? 'var(--text)' : hov ? 'var(--text)' : 'var(--text-2)',
        border: '1px solid ' + (active ? 'var(--border)' : 'transparent'),
        borderRadius: 10,
        fontSize: 13.5,
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all .18s',
        fontFamily: 'inherit',
      }}>
      {/* active indicator bar */}
      {active && !collapsed && (
        <div style={{
          position: 'absolute', left: -10, top: 8, bottom: 8, width: 3,
          background: 'var(--accent)', borderRadius: 2,
        }} />
      )}
      <Icon name={icon} size={17} stroke={active ? 2 : 1.75} />
      {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
    </button>
  );
}

function Sidebar({ page, navigate, collapsed, onCollapse, mobileOpen, onMobileClose, user }) {
  const isCollapsed = collapsed;

  return (
    <>
      <aside
        className={'sidebar-wrap ' + (mobileOpen ? 'open' : '')}
        style={{
          width: isCollapsed ? 68 : 224,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          height: '100vh',
          transition: 'width .24s cubic-bezier(.4,0,.2,1)',
          position: 'relative',
          zIndex: 50,
        }}>
        {/* Logo + collapse */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '18px 10px' : '18px 16px',
          borderBottom: '1px solid var(--border)',
          minHeight: 60,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13.5,
              boxShadow: 'var(--glow)',
            }}>S</div>
            {!isCollapsed && (
              <span className="font-head" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
                Sikhya
              </span>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={onCollapse}
              className="focus-ring"
              title="Collapse sidebar"
              style={{
                width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', borderRadius: 6,
              }}>
              <Icon name="chev_left" size={15} />
            </button>
          )}
        </div>

        {/* Primary nav */}
        <nav style={{
          flex: 1, padding: isCollapsed ? '12px 10px' : '12px',
          display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto',
        }}>
          {!isCollapsed && (
            <div style={{
              fontSize: 10.5, fontWeight: 600, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '.08em',
              padding: '8px 12px 6px',
            }}>Workspace</div>
          )}
          {NAV_PRIMARY.map(item => (
            <NavItem key={item.id}
              {...item}
              active={page === item.id}
              collapsed={isCollapsed}
              onClick={() => { navigate(item.id); onMobileClose?.(); }}
            />
          ))}

          {!isCollapsed && (
            <div style={{
              fontSize: 10.5, fontWeight: 600, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '.08em',
              padding: '16px 12px 6px',
            }}>Account</div>
          )}
          {NAV_SECONDARY.map(item => (
            <NavItem key={item.id}
              {...item}
              active={page === item.id}
              collapsed={isCollapsed}
              onClick={() => { navigate(item.id); onMobileClose?.(); }}
            />
          ))}
        </nav>

        {/* Expand button when collapsed */}
        {isCollapsed && (
          <div style={{ padding: '0 10px 8px' }}>
            <button onClick={onCollapse} className="focus-ring" title="Expand"
              style={{
                width: '100%', padding: 8, display: 'flex', justifyContent: 'center',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', borderRadius: 8,
              }}>
              <Icon name="chev_right" size={15} />
            </button>
          </div>
        )}

        {/* User */}
        <div style={{
          padding: isCollapsed ? 10 : 12,
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar name={user?.name || 'A'} size={isCollapsed ? 32 : 34} />
          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Arjun K.'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                {user?.grade || 'Class 10 · PSEB'}
              </div>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={() => navigate('signout')}
              title="Sign out"
              className="focus-ring"
              style={{
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', borderRadius: 6,
              }}>
              <Icon name="logout" size={14} />
            </button>
          )}
        </div>
      </aside>

      {/* mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onMobileClose}></div>
      )}
    </>
  );
}

window.Sidebar = Sidebar;
