'use client';
import { useState } from 'react';
import { User, Key, Sun, Settings as Cog, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApiKeysSection } from '@/components/settings/api-keys';
import { ProfileSection } from '@/components/settings/profile';
import { AppearanceSection } from '@/components/settings/appearance';
import { PreferencesSection } from '@/components/settings/preferences';
import { DataSection } from '@/components/settings/data';

const TABS = [
  { id: 'apikeys',    label: 'API Keys',    icon: Key },
  { id: 'profile',    label: 'Profile',     icon: User },
  { id: 'appearance', label: 'Appearance',  icon: Sun },
  { id: 'prefs',      label: 'Preferences', icon: Cog },
  { id: 'data',       label: 'Data',        icon: ShieldCheck },
] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('apikeys');

  return (
    <div className="px-8 py-7 pb-20 max-w-[1100px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-7">
        <aside className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible -mx-8 px-8 md:mx-0 md:px-0">
          {TABS.map(t => {
            const Ic = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[13px] shrink-0 transition-colors text-left',
                  tab === t.id
                    ? 'bg-subtle text-fg font-semibold border border-border'
                    : 'text-fg-2 hover:text-fg border border-transparent',
                )}
              >
                <Ic className="w-[15px] h-[15px]" />
                {t.label}
              </button>
            );
          })}
        </aside>

        <div>
          {tab === 'apikeys'    && <ApiKeysSection />}
          {tab === 'profile'    && <ProfileSection />}
          {tab === 'appearance' && <AppearanceSection />}
          {tab === 'prefs'      && <PreferencesSection />}
          {tab === 'data'       && <DataSection />}
        </div>
      </div>
    </div>
  );
}
