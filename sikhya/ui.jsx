// UI primitives — buttons, cards, inputs, badges
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

/* ============ ThemeContext + helpers ============ */
const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sikhya-theme', theme);
  }, [theme]);
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
function useTheme() { return useContext(ThemeContext); }

/* ============ Button ============ */
function Button({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, disabled, style = {}, full, type = 'button', loading }) {
  const [hov, setHov] = useState(false);
  const sizeMap = {
    sm: { padY: 6,  padX: 12, fs: 12.5, gap: 5, ic: 14, radius: 8 },
    md: { padY: 9,  padX: 16, fs: 13.5, gap: 6, ic: 15, radius: 10 },
    lg: { padY: 12, padX: 22, fs: 14.5, gap: 7, ic: 16, radius: 12 },
  };
  const sz = sizeMap[size];

  const variants = {
    primary: {
      bg: 'var(--text)', color: 'var(--bg)', border: 'transparent',
      hov: { bg: 'var(--accent)', color: '#fff' },
    },
    accent: {
      bg: 'var(--accent)', color: '#fff', border: 'transparent',
      hov: { transform: 'translateY(-1px)', shadow: '0 6px 24px var(--accent-ring)' },
    },
    gradient: {
      bg: 'var(--gradient)', color: '#fff', border: 'transparent',
      hov: { transform: 'translateY(-1px)', shadow: '0 8px 28px var(--accent-ring)' },
    },
    ghost: {
      bg: 'transparent', color: 'var(--text-2)', border: 'transparent',
      hov: { bg: 'var(--subtle)', color: 'var(--text)' },
    },
    outline: {
      bg: 'var(--surface)', color: 'var(--text)', border: 'var(--border)',
      hov: { border: 'var(--border-strong)' },
    },
    soft: {
      bg: 'var(--accent-soft)', color: 'var(--accent)', border: 'transparent',
      hov: { bg: 'var(--accent-soft)', color: 'var(--accent)' },
    },
    danger: {
      bg: 'transparent', color: 'var(--danger)', border: 'var(--border)',
      hov: { bg: 'rgba(220,38,38,.08)', border: 'rgba(220,38,38,.4)' },
    },
  };
  const v = variants[variant] || variants.primary;
  const h = hov && !disabled ? v.hov : {};
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="focus-ring"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sz.gap,
        padding: `${sz.padY}px ${sz.padX}px`,
        background: h.bg || v.bg, color: h.color || v.color,
        border: `1px solid ${h.border || v.border}`,
        borderRadius: sz.radius, fontSize: sz.fs, fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? .5 : 1,
        transition: 'all .2s cubic-bezier(.4,0,.2,1)',
        transform: h.transform || 'none',
        boxShadow: h.shadow || 'none',
        width: full ? '100%' : undefined,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {loading
        ? <Spinner size={sz.ic} />
        : icon && <Icon name={icon} size={sz.ic} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sz.ic} />}
    </button>
  );
}

/* ============ Spinner ============ */
function Spinner({ size = 14 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: '2px solid currentColor', borderTopColor: 'transparent',
      animation: 'spin .8s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ============ Card ============ */
function Card({ children, style = {}, hover = false, padding = 20, onClick, glow }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding,
        transition: 'all .25s cubic-bezier(.4,0,.2,1)',
        cursor: onClick ? 'pointer' : 'default',
        transform: hover && hov ? 'translateY(-2px)' : 'none',
        boxShadow: hover && hov
          ? 'var(--shadow-2)'
          : glow ? 'var(--shadow-1), var(--glow)' : 'var(--shadow-1)',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ============ Input ============ */
function TextInput({ label, value, onChange, placeholder, type = 'text', icon, iconRight, hint, error, style = {}, autoFocus }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ ...style }}>
      {label && (
        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 12px',
        background: 'var(--surface)',
        border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 10,
        boxShadow: focused ? '0 0 0 3px var(--accent-ring)' : 'none',
        transition: 'all .2s',
      }}>
        {icon && <Icon name={icon} size={15} style={{ color: 'var(--muted)' }} />}
        <input
          type={type}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, padding: '11px 0', background: 'transparent', border: 'none',
            fontSize: 14, color: 'var(--text)',
          }}
        />
        {iconRight}
      </div>
      {(hint || error) && (
        <div style={{ fontSize: 11.5, color: error ? 'var(--danger)' : 'var(--muted)', marginTop: 6 }}>
          {error || hint}
        </div>
      )}
    </div>
  );
}

/* ============ Badge ============ */
function Badge({ children, variant = 'neutral', size = 'md', style = {} }) {
  const variants = {
    neutral: { bg: 'var(--subtle)', color: 'var(--text-2)', border: 'var(--border)' },
    accent:  { bg: 'var(--accent-soft)', color: 'var(--accent)', border: 'var(--accent-ring)' },
    success: { bg: 'rgba(22,163,74,.1)', color: 'var(--accent-2)', border: 'rgba(22,163,74,.25)' },
    warn:    { bg: 'rgba(217,119,6,.1)', color: 'var(--warning)', border: 'rgba(217,119,6,.25)' },
    danger:  { bg: 'rgba(220,38,38,.1)', color: 'var(--danger)', border: 'rgba(220,38,38,.25)' },
  };
  const v = variants[variant] || variants.neutral;
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: sm ? '2px 7px' : '3px 9px',
      borderRadius: 999, fontSize: sm ? 10 : 11, fontWeight: 600,
      background: v.bg, color: v.color, border: `1px solid ${v.border}`,
      lineHeight: 1.4,
      ...style,
    }}>{children}</span>
  );
}

/* ============ SectionHeader ============ */
function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
      <div>
        <h2 className="font-head" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

/* ============ ProgressBar ============ */
function ProgressBar({ value = 0, height = 6, color, bg }) {
  return (
    <div style={{
      height, borderRadius: height / 2,
      background: bg || 'var(--subtle)',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', width: `${Math.min(100, value)}%`,
        background: color || 'var(--gradient)',
        borderRadius: height / 2,
        transition: 'width 1s cubic-bezier(.4,0,.2,1)',
      }} />
    </div>
  );
}

/* ============ ToggleSwitch ============ */
function Toggle({ checked, onChange, size = 'md' }) {
  const sz = size === 'sm' ? { w: 32, h: 18, k: 14 } : { w: 38, h: 22, k: 18 };
  return (
    <button
      onClick={() => onChange?.(!checked)}
      className="focus-ring"
      style={{
        width: sz.w, height: sz.h,
        borderRadius: sz.h,
        background: checked ? 'var(--accent)' : 'var(--border-strong)',
        border: 'none', cursor: 'pointer',
        position: 'relative', transition: 'background .2s', padding: 0,
      }}>
      <div style={{
        position: 'absolute',
        top: 2, left: checked ? sz.w - sz.k - 2 : 2,
        width: sz.k, height: sz.k, background: '#fff', borderRadius: '50%',
        transition: 'left .2s cubic-bezier(.4,0,.2,1)',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  );
}

/* ============ Kbd ============ */
function Kbd({ children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 18, padding: '1px 5px',
      fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600,
      color: 'var(--text-2)', background: 'var(--surface)',
      border: '1px solid var(--border)', borderBottomWidth: 2,
      borderRadius: 5,
    }}>{children}</span>
  );
}

/* ============ Avatar ============ */
function Avatar({ name = '?', size = 32, style = {} }) {
  const initial = name.trim()[0]?.toUpperCase() || '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--gradient)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: size * 0.42,
      flexShrink: 0, letterSpacing: 0,
      ...style,
    }}>{initial}</div>
  );
}

/* ============ EmptyState ============ */
function EmptyState({ icon = 'sparkles', title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: 'var(--subtle)', color: 'var(--muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon name={icon} size={22} />
      </div>
      <div className="font-head" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 320, marginBottom: 16 }}>{subtitle}</div>}
      {action}
    </div>
  );
}

Object.assign(window, {
  ThemeProvider, useTheme,
  Button, Card, TextInput, Badge, SectionHeader, ProgressBar,
  Toggle, Kbd, Avatar, EmptyState, Spinner,
});
