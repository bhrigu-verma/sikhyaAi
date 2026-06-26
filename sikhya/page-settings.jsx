const { useState, useEffect, useRef, useMemo } = React;
// Settings — Profile, Appearance, API Keys (the hero section), Preferences
function PageSettings({ navigate, user }) {
  const TABS = [
    { id: 'profile',   label: 'Profile',     icon: 'user' },
    { id: 'apikeys',   label: 'API Keys',    icon: 'key' },
    { id: 'appearance',label: 'Appearance',  icon: 'sun' },
    { id: 'prefs',     label: 'Preferences', icon: 'settings' },
    { id: 'data',      label: 'Data',        icon: 'shield' },
  ];
  const [tab, setTab] = useState('apikeys');

  return (
    <div className="page-enter" style={{ padding: '28px 32px 80px', maxWidth: 1100, margin: '0 auto' }}>

      <div style={{
        display: 'grid', gridTemplateColumns: '200px 1fr', gap: 28,
      }} className="settings-grid">
        <style>{`@media (max-width: 800px) { .settings-grid { grid-template-columns: 1fr !important; } .settings-side { display: flex !important; flex-direction: row !important; overflow-x: auto; padding-bottom: 8px; } .settings-side button { flex-shrink: 0; } }`}</style>

        {/* Vertical tabs */}
        <aside className="settings-side" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="focus-ring" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              background: tab === t.id ? 'var(--subtle)' : 'transparent',
              color: tab === t.id ? 'var(--text)' : 'var(--text-2)',
              border: '1px solid ' + (tab === t.id ? 'var(--border)' : 'transparent'),
              borderRadius: 9, fontSize: 13, fontWeight: tab === t.id ? 600 : 500,
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              transition: 'all .15s',
            }}>
              <Icon name={t.icon} size={15} />
              {t.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div>
          {tab === 'profile'    && <SettingsProfile user={user} />}
          {tab === 'apikeys'    && <SettingsAPIKeys />}
          {tab === 'appearance' && <SettingsAppearance />}
          {tab === 'prefs'      && <SettingsPrefs />}
          {tab === 'data'       && <SettingsData />}
        </div>
      </div>
    </div>
  );
}

/* ─── API KEYS — the headline feature ─── */
function SettingsAPIKeys() {
  const [keys, setKeys] = useState([
    { id: 1, provider: 'openai',    label: 'OpenAI · GPT-4',         masked: 'sk-...K9p2', active: true,  lastUsed: '2h ago', requests: 1247 },
    { id: 2, provider: 'anthropic', label: 'Anthropic · Claude',     masked: 'sk-...M4n8', active: false, lastUsed: 'never',  requests: 0 },
    { id: 3, provider: 'google',    label: 'Google · Gemini',        masked: 'AIz...T2q', active: false, lastUsed: '5d ago', requests: 42 },
  ]);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <SectionHeader
        title="AI Provider Keys"
        subtitle="Bring your own keys. They're encrypted and never leave your account."
        action={<Button variant="accent" size="sm" icon="plus" onClick={() => setShowAdd(true)}>Add key</Button>}
      />

      {/* Banner — your system info */}
      <Card padding={18} style={{ marginBottom: 16, borderColor: 'var(--accent-ring)', background: 'var(--accent-soft)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="key" size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="font-head" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              How your keys connect
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>
              Sikhya routes your tutor queries through the active provider below. Keys are stored encrypted with AES-256 server-side
              and resolved via your <span className="font-mono" style={{ background: 'var(--surface)', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>.env</span> at runtime.
              You can override per-session in chat.
            </div>
          </div>
        </div>
      </Card>

      {/* Provider list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {keys.map(k => (
          <ApiKeyRow key={k.id} k={k}
            onToggle={() => setKeys(prev => prev.map(x => ({ ...x, active: x.id === k.id })))}
            onRemove={() => setKeys(prev => prev.filter(x => x.id !== k.id))}
          />
        ))}
      </div>

      {/* Env vars section */}
      <div style={{ marginTop: 32 }}>
        <SectionHeader title="Environment" subtitle="Server-side variables read from .env" />
        <Card padding={0}>
          <EnvRow k="DATABASE_URL"        v="postgresql://••••@host/sikhya" />
          <EnvRow k="NEXTAUTH_SECRET"      v="••••••••••••••••••••" />
          <EnvRow k="ENCRYPTION_KEY"       v="••••••••••••••••••••" />
          <EnvRow k="OPENAI_API_KEY"       v="sk-proj-•••••••K9p2" linked />
          <EnvRow k="ANTHROPIC_API_KEY"    v="not set" status="warn" last />
        </Card>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 10 }}>
          Edit your <code style={{ fontFamily: 'var(--font-mono)' }}>.env</code> file directly to update these. Restart required after changes.
        </div>
      </div>

      {showAdd && <AddKeyModal onClose={() => setShowAdd(false)} onAdd={(p) => { setKeys(prev => [...prev, { id: Date.now(), ...p }]); setShowAdd(false); }} />}
    </div>
  );
}

function ApiKeyRow({ k, onToggle, onRemove }) {
  const [hov, setHov] = useState(false);
  const [copied, setCopied] = useState(false);
  const ProviderIcon = {
    openai:    () => <div style={{ width: 28, height: 28, borderRadius: 8, background: '#10A37F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13 }}>O</div>,
    anthropic: () => <div style={{ width: 28, height: 28, borderRadius: 8, background: '#D97757', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13 }}>A</div>,
    google:    () => <div style={{ width: 28, height: 28, borderRadius: 8, background: '#4285F4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13 }}>G</div>,
  }[k.provider] || (() => null);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', gap: 14, alignItems: 'center',
        padding: '14px 18px',
        background: 'var(--surface)',
        border: '1px solid ' + (k.active ? 'var(--accent-ring)' : 'var(--border)'),
        borderRadius: 12,
        transition: 'all .2s',
        boxShadow: k.active ? '0 0 0 1px var(--accent-ring)' : 'none',
      }}>
      <ProviderIcon />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{k.label}</span>
          {k.active && <Badge variant="success" size="sm">Active</Badge>}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
          <span className="font-mono">{k.masked}</span> · {k.requests.toLocaleString()} requests · last used {k.lastUsed}
        </div>
      </div>

      <button
        onClick={() => { navigator.clipboard?.writeText(k.masked); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="focus-ring"
        style={{
          width: 32, height: 32, background: 'transparent',
          border: '1px solid var(--border)', borderRadius: 8,
          color: 'var(--muted)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Copy">
        {copied ? <Icon name="check" size={14} style={{ color: 'var(--accent-2)' }} /> : <Icon name="copy" size={14} />}
      </button>

      <Toggle checked={k.active} onChange={onToggle} size="sm" />

      <button
        onClick={onRemove}
        className="focus-ring"
        style={{
          width: 32, height: 32, background: 'transparent',
          border: '1px solid var(--border)', borderRadius: 8,
          color: 'var(--muted)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s',
          opacity: hov ? 1 : .5,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.borderColor = 'var(--danger)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        title="Remove">
        <Icon name="trash" size={14} />
      </button>
    </div>
  );
}

function EnvRow({ k, v, linked, status, last }) {
  const [reveal, setReveal] = useState(false);
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '220px 1fr auto', gap: 14, alignItems: 'center',
      padding: '12px 18px',
      borderBottom: last ? 'none' : '1px solid var(--border)',
      fontFamily: 'var(--font-mono)', fontSize: 12.5,
    }}>
      <span style={{ color: 'var(--text)', fontWeight: 500 }}>{k}</span>
      <span style={{ color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {reveal && v !== 'not set' ? v.replace(/•/g, 'x') : v}
      </span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {linked && <Badge variant="accent" size="sm">linked</Badge>}
        {status === 'warn' && <Badge variant="warn" size="sm">missing</Badge>}
        {v !== 'not set' && (
          <button
            onClick={() => setReveal(r => !r)}
            className="focus-ring"
            style={{
              width: 26, height: 26, background: 'transparent', border: 'none',
              cursor: 'pointer', color: 'var(--muted)', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <Icon name={reveal ? 'eye_off' : 'eye'} size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

function AddKeyModal({ onClose, onAdd }) {
  const [provider, setProvider] = useState('openai');
  const [label, setLabel] = useState('');
  const [keyStr, setKeyStr] = useState('');
  const [show, setShow] = useState(false);

  const providers = [
    { id: 'openai',    name: 'OpenAI',     model: 'GPT-4o, GPT-3.5',          hint: 'sk-...',  bg: '#10A37F' },
    { id: 'anthropic', name: 'Anthropic',  model: 'Claude 3.5 Sonnet, Haiku', hint: 'sk-ant-', bg: '#D97757' },
    { id: 'google',    name: 'Google',     model: 'Gemini Pro, Flash',         hint: 'AIza...', bg: '#4285F4' },
    { id: 'groq',      name: 'Groq',       model: 'Llama, Mixtral (fast)',     hint: 'gsk_...', bg: '#F55036' },
  ];
  const sel = providers.find(p => p.id === provider);

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(4px)', zIndex: 100 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 'min(520px, 92vw)', maxHeight: '90vh', overflowY: 'auto',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, boxShadow: 'var(--shadow-3)', zIndex: 101,
        animation: 'page-in .3s cubic-bezier(.16,1,.3,1)',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="font-head" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Add API key</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Encrypted before storage. Never visible to others.</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
            <Icon name="x" size={16} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Provider</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {providers.map(p => (
                <button key={p.id} onClick={() => setProvider(p.id)} className="focus-ring" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px',
                  background: provider === p.id ? 'var(--accent-soft)' : 'var(--surface)',
                  border: '1.5px solid ' + (provider === p.id ? 'var(--accent)' : 'var(--border)'),
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit', transition: 'all .15s',
                }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: p.bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                    {p.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{p.model}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <TextInput
            label="Label (optional)"
            value={label}
            onChange={setLabel}
            placeholder={`${sel.name} · Personal`}
            style={{ marginBottom: 16 }}
          />

          <TextInput
            label="API key"
            value={keyStr}
            onChange={setKeyStr}
            placeholder={sel.hint + '…'}
            type={show ? 'text' : 'password'}
            icon="key"
            iconRight={
              <button onClick={() => setShow(s => !s)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 0 }}>
                <Icon name={show ? 'eye_off' : 'eye'} size={14} />
              </button>
            }
            hint="Pasted keys are encrypted with AES-256 server-side."
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="accent" icon="key" disabled={!keyStr.trim()}
              onClick={() => onAdd({
                provider, label: label || `${sel.name} · Personal`,
                masked: keyStr.slice(0, 5) + '...' + keyStr.slice(-4),
                active: false, lastUsed: 'just added', requests: 0,
              })}>
              Save key
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── PROFILE ─── */
function SettingsProfile({ user }) {
  return (
    <div>
      <SectionHeader title="Profile" subtitle="How others see you on Sikhya" />
      <Card padding={22}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 28 }}>
          <Avatar name={user?.name || 'Arjun'} size={64} />
          <div style={{ flex: 1 }}>
            <div className="font-head" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{user?.name || 'Arjun Kumar'}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{user?.email || 'arjun@example.com'}</div>
          </div>
          <Button variant="outline" size="sm" icon="upload">Change photo</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="prof-grid">
          <style>{`@media (max-width: 600px) { .prof-grid { grid-template-columns: 1fr !important; } }`}</style>
          <TextInput label="Full name"  value="Arjun Kumar"     onChange={() => {}} />
          <TextInput label="Email"       value="arjun@example.com" onChange={() => {}} type="email" />
          <TextInput label="Class"       value="Class 10"        onChange={() => {}} />
          <TextInput label="Board"       value="PSEB"            onChange={() => {}} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
          <Button variant="ghost">Reset</Button>
          <Button variant="accent">Save changes</Button>
        </div>
      </Card>
    </div>
  );
}

/* ─── APPEARANCE ─── */
function SettingsAppearance() {
  const { theme, setTheme } = useTheme();
  const [accent, setAccent] = useState('blue');
  const accents = [
    { id: 'blue',   bg: '#2563EB' },
    { id: 'violet', bg: '#7C3AED' },
    { id: 'teal',   bg: '#0891B2' },
    { id: 'amber',  bg: '#D97706' },
    { id: 'rose',   bg: '#E11D48' },
  ];

  return (
    <div>
      <SectionHeader title="Appearance" subtitle="Customize the look and feel" />

      <Card padding={22} style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Theme</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { id: 'light',  label: 'Light',  bg: '#FAFAF9', fg: '#18181B', border: '#E7E5E2' },
            { id: 'dark',   label: 'Dark',   bg: '#0A0A0B', fg: '#FAFAFA', border: '#27272A' },
            { id: 'system', label: 'System', bg: 'linear-gradient(135deg, #FAFAF9 50%, #0A0A0B 50%)', fg: 'var(--text)', border: 'var(--border)' },
          ].map(t => (
            <button key={t.id}
              onClick={() => setTheme(t.id === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t.id)}
              className="focus-ring"
              style={{
                background: 'var(--surface)',
                border: '1.5px solid ' + ((t.id === theme || (t.id === 'system' && false)) ? 'var(--accent)' : 'var(--border)'),
                borderRadius: 12, padding: 12, cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
              <div style={{
                height: 70, borderRadius: 8, background: t.bg, marginBottom: 10,
                border: '1px solid ' + t.border,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 8, left: 8, right: 8, height: 4, background: t.fg, opacity: .2, borderRadius: 2 }} />
                <div style={{ position: 'absolute', top: 18, left: 8, width: 30, height: 3, background: t.fg, opacity: .15, borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{t.label}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card padding={22}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Accent color</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {accents.map(a => (
            <button key={a.id} onClick={() => setAccent(a.id)} className="focus-ring" style={{
              width: 32, height: 32, borderRadius: 10,
              background: a.bg,
              border: '2px solid ' + (accent === a.id ? 'var(--text)' : 'transparent'),
              cursor: 'pointer', transition: 'all .2s',
              transform: accent === a.id ? 'scale(1.1)' : 'scale(1)',
            }} />
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 10 }}>
          Affects buttons, links, and highlights across the app.
        </div>
      </Card>
    </div>
  );
}

/* ─── PREFERENCES ─── */
function SettingsPrefs() {
  const [notif, setNotif] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const Item = ({ title, sub, val, onChange }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 18,
      padding: '16px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
      </div>
      <Toggle checked={val} onChange={onChange} />
    </div>
  );

  return (
    <div>
      <SectionHeader title="Preferences" subtitle="Customize your experience" />
      <Card padding="0 22px">
        <Item title="Push notifications" sub="Streak reminders, AI replies, new content" val={notif}   onChange={setNotif} />
        <Item title="Sound effects"      sub="Subtle clicks and confirmations"             val={sounds}  onChange={setSounds} />
        <Item title="Reduce motion"      sub="Minimize animations and transitions"         val={reduce}  onChange={setReduce} />
        <Item title="Auto-save chats"    sub="Save AI tutor conversations to your library" val={autoSave} onChange={setAutoSave} />
      </Card>
    </div>
  );
}

/* ─── DATA ─── */
function SettingsData() {
  return (
    <div>
      <SectionHeader title="Data & Privacy" subtitle="Manage your data and account" />
      <Card padding={22} style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Export your data</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>Download all your chats, progress, and notes as JSON.</div>
        <Button variant="outline" size="sm" icon="download">Export everything</Button>
      </Card>
      <Card padding={22} style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Clear AI history</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>Remove all saved AI tutor conversations. Cannot be undone.</div>
        <Button variant="outline" size="sm" icon="trash">Clear chats</Button>
      </Card>
      <Card padding={22} style={{ borderColor: 'rgba(220,38,38,.25)' }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--danger)', marginBottom: 4 }}>Delete account</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>Permanently delete your account and all data. This cannot be undone.</div>
        <Button variant="danger" size="sm" icon="trash">Delete my account</Button>
      </Card>
    </div>
  );
}

window.PageSettings = PageSettings;
