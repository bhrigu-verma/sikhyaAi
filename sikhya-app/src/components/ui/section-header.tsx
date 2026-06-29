import * as React from 'react';
export function SectionHeader({
  title, subtitle, action,
}: { title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <div>
        <h2 className="font-head text-lg font-bold tracking-tight text-fg">{title}</h2>
        {subtitle && <div className="text-[13px] text-fg-2 mt-0.5">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}
