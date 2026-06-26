const { useState, useEffect, useRef, useMemo } = React;
// Sign In — minimal, beautiful auth screen
function PageSignIn({ onAuth }) {
  const [mode, setMode] = useState('signin'); // signin | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const submit = (e) => {
    e?.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth({ name: name || 'Arjun Kumar', email });
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg)',
    }}>
      {/* LEFT — brand panel, hidden on small */}
      <div style={{
        flex: '0 0 44%', padding: 40,
        background: '#0A0A0B', color: '#FAFAFA',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }} className="auth-brand">
        <style>{`@media (max-width: 880px) { .auth-brand { display: none !important; } }`}</style>

        {/* decorative gradient blobs */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,.22) 0%, transparent 65%)',
          left: -100, bottom: -100, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,.18) 0%, transparent 65%)',
          right: -50, top: 50, pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56, position: 'relative' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'var(--gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14,
            boxShadow: '0 0 32px rgba(59,130,246,.4)',
          }}>S</div>
          <span className="font-head" style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Sikhya</span>
        </div>

        {/* Headline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', maxWidth: 420 }}>
          <h1 className="font-head" style={{
            fontSize: 'clamp(32px, 3.4vw, 44px)', fontWeight: 700,
            lineHeight: 1.1, letterSpacing: '-.03em',
            color: '#fff', marginBottom: 20,
          }}>
            Learning<br />
            <span style={{
              background: 'var(--gradient)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>without limits.</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.65)', lineHeight: 1.7, marginBottom: 32 }}>
            Your free AI teacher for Class 6–12. English, Hindi, and Punjabi — mapped to your exact syllabus.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'AI explanations in 3 languages',
              'Mapped to PSEB / CBSE / ICSE syllabus',
              'Progress tracking that actually helps',
              'Bring your own API key — full control',
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(34,197,94,.15)',
                  border: '1px solid rgba(34,197,94,.3)',
                  color: '#22C55E', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name="check" size={11} stroke={2.5} />
                </div>
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,.78)' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: 'var(--bg)',
      }}>
        <div style={{
          padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid var(--border)',
        }}>
          <a href="index.html" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--text-2)', textDecoration: 'none', fontSize: 13, fontWeight: 500,
          }}>
            <Icon name="chev_left" size={14} /> Back to home
          </a>
          <ThemeToggleStandalone />
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
          <div style={{ width: '100%', maxWidth: 380 }}>
            <h2 className="font-head" style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', letterSpacing: '-.025em', marginBottom: 6 }}>
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-2)', marginBottom: 28 }}>
              {mode === 'signin' ? 'Sign in to continue learning.' : 'Free forever. 30 seconds.'}
            </p>

            {/* Tabs */}
            <div style={{
              display: 'flex', padding: 3,
              background: 'var(--subtle)', borderRadius: 9,
              marginBottom: 24, border: '1px solid var(--border)',
            }}>
              {[{ id: 'signin', label: 'Sign in' }, { id: 'signup', label: 'Create account' }].map(t => (
                <button key={t.id} onClick={() => setMode(t.id)} className="focus-ring" style={{
                  flex: 1, padding: '7px 12px',
                  background: mode === t.id ? 'var(--surface)' : 'transparent',
                  border: 'none', borderRadius: 7,
                  fontSize: 12.5, fontWeight: 600,
                  color: mode === t.id ? 'var(--text)' : 'var(--text-2)',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: mode === t.id ? 'var(--shadow-1)' : 'none',
                  transition: 'all .18s',
                }}>{t.label}</button>
              ))}
            </div>

            <form onSubmit={submit}>
              {mode === 'signup' && (
                <TextInput label="Full name" value={name} onChange={setName} placeholder="Arjun Kumar" style={{ marginBottom: 14 }} />
              )}
              <TextInput
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
                style={{ marginBottom: 14 }}
                autoFocus
              />
              <TextInput
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter password'}
                type={showPw ? 'text' : 'password'}
                iconRight={
                  <button type="button" onClick={() => setShowPw(s => !s)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 0 }}>
                    <Icon name={showPw ? 'eye_off' : 'eye'} size={14} />
                  </button>
                }
                style={{ marginBottom: 8 }}
              />
              {mode === 'signin' && (
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <a href="#" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                    Forgot password?
                  </a>
                </div>
              )}
              {mode === 'signup' && <div style={{ marginBottom: 20 }} />}

              <Button variant="gradient" size="lg" full type="submit" loading={loading} iconRight="arrow">
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </Button>
            </form>

            <button onClick={() => onAuth({ name: 'Guest', email: 'guest@sikhya.app', guest: true })} style={{
              width: '100%', padding: '11px 14px', background: 'transparent',
              border: 'none', cursor: 'pointer', color: 'var(--text-2)',
              fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit',
              marginTop: 16
            }}>
              Continue as guest →
            </button>

            <div style={{ marginTop: 24, fontSize: 11.5, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
              By continuing you agree to our <a href="#" style={{ color: 'var(--text-2)', textDecoration: 'underline' }}>Terms</a>
              {' '}and <a href="#" style={{ color: 'var(--text-2)', textDecoration: 'underline' }}>Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeToggleStandalone() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="focus-ring" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} style={{
      width: 34, height: 34, background: 'transparent',
      border: '1px solid var(--border)', borderRadius: 9,
      color: 'var(--text-2)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={theme === 'light' ? 'moon' : 'sun'} size={15} />
    </button>
  );
}

window.PageSignIn = PageSignIn;
