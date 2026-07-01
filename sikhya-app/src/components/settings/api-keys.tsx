'use client';
import { useEffect, useState } from 'react';
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { SectionHeader } from '@/components/ui/section-header';
import { cn } from '@/lib/utils';

type Provider = 'openai' | 'anthropic' | 'google' | 'groq' | 'nvidia';

type ApiKey = {
  id: string;
  provider: Provider;
  label: string;
  maskedKey: string;
  active: boolean;
  requestsCount: number;
  lastUsedAt: string | null;
};

const PROVIDERS: Record<Provider, { name: string; model: string; hint: string; bg: string }> = {
  openai:    { name: 'OpenAI',     model: 'GPT-4o, GPT-3.5',          hint: 'sk-...',  bg: '#10A37F' },
  anthropic: { name: 'Anthropic',  model: 'Claude 3.5 Sonnet, Haiku', hint: 'sk-ant-', bg: '#D97757' },
  google:    { name: 'Google',     model: 'Gemini Pro, Flash',         hint: 'AIza...', bg: '#4285F4' },
  groq:      { name: 'Groq',       model: 'Llama, Mixtral (fast)',     hint: 'gsk_...', bg: '#F55036' },
  nvidia:    { name: 'NVIDIA',     model: 'NIM (OpenAI-compatible)',   hint: 'nvapi-',  bg: '#76B900' },
};

export function ApiKeysSection() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/api-keys');
    if (res.ok) {
      const { keys } = await res.json();
      setKeys(keys);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleActive = async (id: string, active: boolean) => {
    // optimistic update — only one active at a time
    setKeys(prev => prev.map(k => ({ ...k, active: k.id === id ? active : (active ? false : k.active) })));
    await fetch(`/api/api-keys/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this key? You can add it again later.')) return;
    setKeys(prev => prev.filter(k => k.id !== id));
    await fetch(`/api/api-keys/${id}`, { method: 'DELETE' });
  };

  return (
    <div>
      <SectionHeader
        title="AI Provider Keys"
        subtitle="Bring your own keys. Encrypted with AES-256-GCM and never sent to the client again."
        action={<Button variant="accent" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowAdd(true)}>Add key</Button>}
      />

      {/* How keys connect */}
      <Card className="mb-4 border-accent/25 bg-accent/5" padding="md">
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-[10px] bg-accent text-white grid place-items-center shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="font-head font-bold text-fg mb-1">How your keys connect</div>
            <div className="text-[13px] text-fg-2 leading-relaxed">
              Sikhya routes your tutor queries through the <strong>active</strong> provider below.
              Server-side, we decrypt the key, call the provider, and stream the response back to you.
              Need a fallback? Set <code className="font-mono bg-surface px-1.5 py-px rounded text-xs">OPENAI_API_KEY</code> etc. in your <code className="font-mono bg-surface px-1.5 py-px rounded text-xs">.env</code>.
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2.5">
        {loading ? (
          <div className="text-center py-12 text-muted text-sm">Loading keys…</div>
        ) : keys.length === 0 ? (
          <Card className="text-center py-12">
            <Key className="w-8 h-8 mx-auto mb-3 text-muted" />
            <div className="font-head font-bold text-fg mb-1">No API keys yet</div>
            <div className="text-[13px] text-fg-2 mb-4">Add one to start using the AI tutor with your own provider.</div>
            <Button variant="accent" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowAdd(true)}>Add your first key</Button>
          </Card>
        ) : (
          keys.map(k => (
            <KeyRow
              key={k.id}
              k={k}
              onToggle={(v) => toggleActive(k.id, v)}
              onRemove={() => remove(k.id)}
            />
          ))
        )}
      </div>

      <EnvSection />

      {showAdd && <AddKeyModal onClose={() => setShowAdd(false)} onAdded={() => { setShowAdd(false); load(); }} />}
    </div>
  );
}

function KeyRow({ k, onToggle, onRemove }: { k: ApiKey; onToggle: (v: boolean) => void; onRemove: () => void }) {
  const [copied, setCopied] = useState(false);
  const p = PROVIDERS[k.provider];

  return (
    <div className={cn(
      'grid grid-cols-[auto_1fr_auto_auto_auto] gap-3.5 items-center px-4 py-3.5',
      'bg-surface rounded-xl border transition-all',
      k.active ? 'border-accent/40 shadow-[0_0_0_1px_rgb(var(--accent)/.25)]' : 'border-border',
    )}>
      <div className="w-7 h-7 rounded-[7px] grid place-items-center text-white font-head font-extrabold text-xs"
           style={{ background: p.bg }}>
        {p.name[0]}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-fg truncate">{k.label}</span>
          {k.active && <Badge variant="success" size="sm">Active</Badge>}
        </div>
        <div className="text-[11.5px] text-muted mt-0.5">
          <span className="font-mono">{k.maskedKey}</span> · {k.requestsCount.toLocaleString()} requests
          {k.lastUsedAt && ' · last used ' + new Date(k.lastUsedAt).toLocaleDateString()}
        </div>
      </div>
      <button
        onClick={() => { navigator.clipboard?.writeText(k.maskedKey); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="w-8 h-8 grid place-items-center border border-border rounded-lg text-muted hover:text-fg"
        title="Copy"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-accent-2" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <Toggle checked={k.active} onChange={onToggle} size="sm" />
      <button
        onClick={onRemove}
        className="w-8 h-8 grid place-items-center border border-border rounded-lg text-muted hover:text-danger hover:border-danger"
        title="Remove"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function EnvSection() {
  return (
    <div className="mt-8">
      <SectionHeader title="Environment" subtitle="Server-side variables read from .env at boot" />
      <Card padding="none" className="overflow-hidden">
        <EnvRow k="DATABASE_URL"     v="postgresql://••••@host/sikhya"   />
        <EnvRow k="NEXTAUTH_SECRET"  v="••••••••••••••••••••"             />
        <EnvRow k="ENCRYPTION_KEY"   v="••••••••••••••••••••"             />
        <EnvRow k="OPENAI_API_KEY"   v="sk-proj-•••••••K9p2" linked        />
        <EnvRow k="ANTHROPIC_API_KEY" v="not set" status="warn"             />
        <EnvRow k="NVIDIA_API_KEY"    v="nvapi-••••••••••••" linked last    />
      </Card>
      <div className="text-[11.5px] text-muted mt-2.5">
        Edit <code className="font-mono">.env</code> directly to change these. Restart required.
      </div>
    </div>
  );
}

function EnvRow({ k, v, linked, status, last }: { k: string; v: string; linked?: boolean; status?: 'warn'; last?: boolean }) {
  const [reveal, setReveal] = useState(false);
  return (
    <div className={cn('grid grid-cols-[220px_1fr_auto] gap-3.5 items-center px-4 py-3 font-mono text-[12.5px]', !last && 'border-b border-border')}>
      <span className="text-fg font-medium">{k}</span>
      <span className="text-fg-2 truncate">{reveal && v !== 'not set' ? v.replace(/•/g, 'x') : v}</span>
      <div className="flex gap-1.5 items-center">
        {linked && <Badge variant="accent" size="sm">linked</Badge>}
        {status === 'warn' && <Badge variant="warn" size="sm">missing</Badge>}
        {v !== 'not set' && (
          <button onClick={() => setReveal(r => !r)} className="w-6 h-6 grid place-items-center text-muted hover:text-fg rounded">
            {reveal ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
        )}
      </div>
    </div>
  );
}

function AddKeyModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [provider, setProvider] = useState<Provider>('openai');
  const [label, setLabel] = useState('');
  const [keyStr, setKeyStr] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sel = PROVIDERS[provider];

  const save = async () => {
    if (!keyStr.trim()) return;
    setSaving(true); setError(null);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, label: label || `${sel.name} · Personal`, key: keyStr }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(typeof j.error === 'string' ? j.error : 'Could not save key');
      }
      onAdded();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(520px,92vw)] max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-2xl shadow-soft-3 z-[101] animate-fade-in">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center">
          <div>
            <div className="font-head text-base font-bold text-fg">Add API key</div>
            <div className="text-xs text-muted mt-0.5">Encrypted before storage. Never visible to others.</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 grid place-items-center text-muted hover:text-fg rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4.5">
            <label className="block text-[12.5px] font-semibold mb-2 text-fg">Provider</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(PROVIDERS) as [Provider, typeof PROVIDERS[Provider]][]).map(([id, p]) => (
                <button
                  key={id}
                  onClick={() => setProvider(id)}
                  className={cn(
                    'flex items-center gap-2.5 px-3.5 py-3 rounded-[10px] text-left transition-all',
                    'bg-surface border-[1.5px]',
                    provider === id ? 'border-accent bg-accent/5' : 'border-border hover:border-border-strong',
                  )}
                >
                  <div className="w-[26px] h-[26px] rounded-[7px] grid place-items-center text-white font-extrabold text-xs" style={{ background: p.bg }}>
                    {p.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-fg">{p.name}</div>
                    <div className="text-[10.5px] text-muted truncate">{p.model}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Input label="Label (optional)" placeholder={`${sel.name} · Personal`} value={label} onChange={e => setLabel(e.target.value)} className="mb-4" />
          <Input
            label="API key" placeholder={sel.hint + '…'}
            type={show ? 'text' : 'password'} value={keyStr} onChange={e => setKeyStr(e.target.value)}
            icon={<Key className="w-3.5 h-3.5" />}
            iconRight={<button onClick={() => setShow(s => !s)} className="text-muted hover:text-fg">{show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>}
            hint="Pasted keys are encrypted with AES-256-GCM server-side."
          />

          {error && (
            <div className="mt-3 text-[12.5px] text-danger bg-danger/10 border border-danger/25 rounded-lg px-3 py-2">{error}</div>
          )}

          <div className="flex gap-2.5 mt-6 justify-end">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="accent" icon={<Key className="w-3.5 h-3.5" />} disabled={!keyStr.trim()} loading={saving} onClick={save}>Save key</Button>
          </div>
        </div>
      </div>
    </>
  );
}
