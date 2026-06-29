'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowRight, Eye, EyeOff, Mail, Lock, User, CheckCircle2,
  RefreshCw, ChevronLeft, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  return <Suspense><AuthFlow /></Suspense>;
}

type Screen =
  | { view: 'signin' }
  | { view: 'signup_form' }
  | { view: 'signup_otp'; email: string; name: string; password: string }
  | { view: 'forgot_email' }
  | { view: 'forgot_otp'; email: string }
  | { view: 'reset_password'; email: string; code: string }
  | { view: 'done'; message: string };

function AuthFlow() {
  const router = useRouter();
  const sp = useSearchParams();
  const [screen, setScreen] = useState<Screen>({ view: 'signin' });

  const to = (s: Screen) => setScreen(s);
  const callbackUrl = sp.get('callbackUrl') || '/dashboard';

  const props = { to, callbackUrl, router };
  switch (screen.view) {
    case 'signin':       return <Layout><SignIn {...props} /></Layout>;
    case 'signup_form':  return <Layout><SignUpForm {...props} /></Layout>;
    case 'signup_otp':   return <Layout><SignUpOtp {...props} screen={screen} /></Layout>;
    case 'forgot_email': return <Layout><ForgotEmail {...props} /></Layout>;
    case 'forgot_otp':   return <Layout><ForgotOtp {...props} screen={screen} /></Layout>;
    case 'reset_password': return <Layout><ResetPassword {...props} screen={screen} /></Layout>;
    case 'done':         return <Layout><Done message={screen.message} callbackUrl={callbackUrl} router={router} /></Layout>;
  }
}

// ─── Shared helpers ────────────────────────────────────────────────
interface StepProps {
  to: (s: Screen) => void;
  callbackUrl: string;
  router: ReturnType<typeof useRouter>;
}

function Field({
  label, type = 'text', value, onChange, placeholder, right, autoFocus, name,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; right?: React.ReactNode; autoFocus?: boolean; name?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-semibold text-fg-2">{label}</label>
      <div className="relative flex items-center">
        <input
          name={name}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={type === 'password' ? 'current-password' : undefined}
          className="w-full h-10 px-3.5 pr-9 bg-surface border border-border rounded-xl text-[13.5px] text-fg placeholder:text-muted outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgb(var(--accent)/.1)] transition-all"
        />
        {right && <div className="absolute right-3 flex items-center">{right}</div>}
      </div>
    </div>
  );
}

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-semibold text-fg-2">Verification code</label>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        autoFocus
        placeholder="· · · · · ·"
        className="w-full h-14 text-center text-3xl font-bold tracking-[16px] bg-surface border-2 border-border rounded-xl text-fg placeholder:text-muted/40 outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgb(var(--accent)/.1)] transition-all"
      />
    </div>
  );
}

function Err({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="text-[12.5px] text-danger bg-danger/8 border border-danger/25 rounded-lg px-3 py-2 leading-relaxed">
      {msg}
    </div>
  );
}

function PwField({ value, onChange, placeholder, label }: { value: string; onChange: (v: string) => void; placeholder?: string; label?: string }) {
  const [show, setShow] = useState(false);
  return (
    <Field
      label={label ?? 'Password'}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? 'Enter password'}
      name="password"
      right={
        <button type="button" onClick={() => setShow(s => !s)} className="text-muted hover:text-fg">
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      }
    />
  );
}

// ─── Screens ───────────────────────────────────────────────────────
function SignIn({ to, callbackUrl, router }: StepProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true); setError(null);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError('Incorrect email or password.'); return; }
    router.push(callbackUrl);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Heading title="Welcome back" sub="Sign in to continue learning." />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoFocus />
      <PwField value={password} onChange={setPassword} />
      <div className="text-right -mt-2">
        <button type="button" onClick={() => to({ view: 'forgot_email' })}
          className="text-[12.5px] text-accent font-medium hover:underline">Forgot password?</button>
      </div>
      <Err msg={error} />
      <Button type="submit" variant="gradient" size="lg" full loading={loading} iconRight={<ArrowRight className="w-4 h-4" />}>
        Sign in
      </Button>
      <p className="text-center text-[12.5px] text-fg-2">
        No account?{' '}
        <button type="button" onClick={() => to({ view: 'signup_form' })} className="text-accent font-semibold hover:underline">
          Create one free
        </button>
      </p>
    </form>
  );
}

function SignUpForm({ to }: StepProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'verify_email' }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? 'Failed to send code'); }
      to({ view: 'signup_otp', email, name, password });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Heading title="Create your account" sub="Free forever. Enter your details to get started." />
      <Field label="Full name" value={name} onChange={setName} placeholder="Arjun Singh" autoFocus />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <PwField value={password} onChange={setPassword} placeholder="At least 8 characters" label="Password" />
      <Err msg={error} />
      <Button type="submit" variant="gradient" size="lg" full loading={loading} iconRight={<ArrowRight className="w-4 h-4" />}>
        Send verification code
      </Button>
      <p className="text-center text-[12.5px] text-fg-2">
        Already have an account?{' '}
        <button type="button" onClick={() => to({ view: 'signin' })} className="text-accent font-semibold hover:underline">Sign in</button>
      </p>
    </form>
  );
}

function SignUpOtp({ to, callbackUrl, router, screen }: StepProps & { screen: { email: string; name: string; password: string } }) {
  const { email, name, password } = screen;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) { setError('Enter the 6-digit code from your email.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, code }),
      });
      const j = await res.json();
      if (!res.ok) { setError(j.error ?? 'Registration failed.'); return; }
      const login = await signIn('credentials', { email, password, redirect: false });
      if (login?.error) { router.push('/signin'); return; }
      router.push(callbackUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true); setError(null);
    await fetch('/api/auth/send-otp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type: 'verify_email' }),
    });
    setResending(false);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Heading title="Check your email" sub={<>We sent a 6-digit code to <strong className="text-fg">{email}</strong></>} />
      <OtpInput value={code} onChange={setCode} />
      <Err msg={error} />
      <Button type="submit" variant="gradient" size="lg" full loading={loading} iconRight={<ArrowRight className="w-4 h-4" />}>
        Verify & create account
      </Button>
      <div className="flex items-center justify-between text-[12.5px]">
        <button type="button" onClick={() => to({ view: 'signup_form' })} className="text-fg-2 hover:text-fg flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button type="button" onClick={resend} disabled={resending} className="text-accent font-medium hover:underline flex items-center gap-1">
          <RefreshCw className={cn('w-3 h-3', resending && 'animate-spin')} /> Resend code
        </button>
      </div>
    </form>
  );
}

function ForgotEmail({ to }: StepProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true); setError(null);
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'reset_password' }),
      });
      // Always advance (don't reveal if email exists)
      to({ view: 'forgot_otp', email });
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Heading title="Forgot password?" sub="Enter your email and we'll send you a reset code." />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoFocus />
      <Err msg={error} />
      <Button type="submit" variant="gradient" size="lg" full loading={loading} iconRight={<Mail className="w-4 h-4" />}>
        Send reset code
      </Button>
      <button type="button" onClick={() => to({ view: 'signin' })} className="text-center text-[12.5px] text-fg-2 hover:text-fg flex items-center justify-center gap-1">
        <ChevronLeft className="w-3.5 h-3.5" /> Back to sign in
      </button>
    </form>
  );
}

function ForgotOtp({ to, screen }: StepProps & { screen: { email: string } }) {
  const { email } = screen;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) { setError('Enter the 6-digit code from your email.'); return; }
    // Pre-validate code before asking for new password (better UX than failing later)
    setLoading(true); setError(null);
    // We don't validate here — let the reset step do it atomically.
    setLoading(false);
    to({ view: 'reset_password', email, code });
  };

  const resend = async () => {
    setResending(true);
    await fetch('/api/auth/send-otp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type: 'reset_password' }),
    });
    setResending(false);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Heading title="Enter the code" sub={<>Check your email at <strong className="text-fg">{email}</strong></>} />
      <OtpInput value={code} onChange={setCode} />
      <Err msg={error} />
      <Button type="submit" variant="gradient" size="lg" full loading={loading} iconRight={<ArrowRight className="w-4 h-4" />}>
        Continue
      </Button>
      <div className="flex items-center justify-between text-[12.5px]">
        <button type="button" onClick={() => to({ view: 'forgot_email' })} className="text-fg-2 hover:text-fg flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button type="button" onClick={resend} disabled={resending} className="text-accent font-medium hover:underline flex items-center gap-1">
          <RefreshCw className={cn('w-3 h-3', resending && 'animate-spin')} /> Resend
        </button>
      </div>
    </form>
  );
}

function ResetPassword({ to, screen }: StepProps & { screen: { email: string; code: string } }) {
  const { email, code } = screen;
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });
      const j = await res.json();
      if (!res.ok) { setError(j.error ?? 'Reset failed.'); return; }
      to({ view: 'done', message: 'Password reset! You can now sign in with your new password.' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Heading title="Set new password" sub="Choose a strong password for your account." />
      <PwField value={password} onChange={setPassword} placeholder="At least 8 characters" label="New password" />
      <Err msg={error} />
      <Button type="submit" variant="gradient" size="lg" full loading={loading} iconRight={<Lock className="w-4 h-4" />}>
        Reset password
      </Button>
    </form>
  );
}

function Done({ message, callbackUrl, router }: { message: string; callbackUrl: string; router: ReturnType<typeof useRouter> }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/25 grid place-items-center">
        <CheckCircle2 className="w-8 h-8 text-success" />
      </div>
      <div>
        <h2 className="font-head text-xl font-bold text-fg mb-1">Done!</h2>
        <p className="text-[13.5px] text-fg-2 leading-relaxed">{message}</p>
      </div>
      <Button variant="gradient" size="lg" iconRight={<ArrowRight className="w-4 h-4" />} onClick={() => router.push('/signin')}>
        Go to sign in
      </Button>
    </div>
  );
}

// ─── Layout helpers ────────────────────────────────────────────────
function Heading({ title, sub }: { title: string; sub: React.ReactNode }) {
  return (
    <div className="mb-2">
      <h2 className="font-head text-[24px] font-bold tracking-tight text-fg mb-1">{title}</h2>
      <p className="text-[13px] text-fg-2 leading-relaxed">{sub}</p>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-bg">
      {/* Brand panel — desktop only */}
      <aside className="hidden lg:flex flex-[0_0_42%] flex-col relative overflow-hidden bg-[#06050a] px-10 py-10">
        {/* Glows */}
        <div className="absolute w-[520px] h-[520px] rounded-full blur-3xl pointer-events-none -left-28 -bottom-20"
             style={{ background: 'radial-gradient(circle, rgba(251,191,36,.16) 0%, transparent 60%)' }} />
        <div className="absolute w-[360px] h-[360px] rounded-full blur-3xl pointer-events-none right-0 top-8"
             style={{ background: 'radial-gradient(circle, rgba(99,102,241,.13) 0%, transparent 60%)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5 mb-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 grid place-items-center shadow-[0_0_28px_rgba(251,191,36,.35)]">
            <span className="text-white font-bold text-[19px] leading-none font-indic">ਸ</span>
          </div>
          <span className="font-head text-[15px] font-bold text-white">Sikhya</span>
        </div>

        {/* Hero copy */}
        <div className="relative mt-auto pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11.5px] text-white/60 mb-5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Free AI tutor · Class 6–12
          </div>
          <h1 className="font-head text-[42px] font-bold leading-[1.1] tracking-tight text-white mb-4">
            Learn in your<br /><span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">own language.</span>
          </h1>
          <p className="text-[14px] text-white/55 leading-relaxed max-w-[380px] mb-7">
            Punjabi, Hindi or English — ask anything from your PSEB textbook and get step-by-step answers, practice tests, and a study plan built around you.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: '46,000+', l: 'Textbook pages indexed' },
              { n: '6 boards', l: 'PSEB, CBSE, ICSE & more' },
              { n: '3 languages', l: 'Pa · Hi · En' },
              { n: '100% free', l: 'Always, forever' },
            ].map(s => (
              <div key={s.n} className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3">
                <div className="text-[18px] font-bold text-white leading-none mb-0.5">{s.n}</div>
                <div className="text-[11px] text-white/45">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        <header className="px-6 py-3.5 flex items-center justify-between border-b border-border bg-surface/60 backdrop-blur-xl">
          <Link href="/" className="text-[13px] font-medium text-fg-2 hover:text-fg flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 grid place-items-center">
              <span className="text-white font-bold text-[14px] font-indic">ਸ</span>
            </div>
            <span className="font-head text-sm font-bold text-fg">Sikhya</span>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[380px] animate-fade-in">
            {children}
          </div>
        </div>

        <footer className="px-6 py-3 text-center text-[11px] text-muted border-t border-border">
          By continuing, you agree to our{' '}
          <a href="#" className="text-fg-2 underline">Terms</a> &amp;{' '}
          <a href="#" className="text-fg-2 underline">Privacy Policy</a>.
        </footer>
      </div>
    </div>
  );
}
