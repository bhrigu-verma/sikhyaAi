export const metadata = { title: 'Offline — Sikhya' };

export default function OfflinePage() {
  return (
    <div className="min-h-screen grid place-items-center bg-bg text-fg px-6 text-center">
      <div className="max-w-sm">
        <div className="text-5xl mb-4">📡</div>
        <h1 className="font-head text-2xl font-bold mb-2">You&rsquo;re offline</h1>
        <p className="text-sm text-fg-2 leading-relaxed">
          Sikhya needs an internet connection to ask the tutor and load new content.
          Pages you&rsquo;ve already opened may still work. Reconnect and try again.
        </p>
        <p className="text-xs text-muted mt-6">ਤੁਸੀਂ ਆਫ਼ਲਾਈਨ ਹੋ — ਕਿਰਪਾ ਕਰਕੇ ਇੰਟਰਨੈੱਟ ਨਾਲ ਜੁੜੋ।</p>
      </div>
    </div>
  );
}
