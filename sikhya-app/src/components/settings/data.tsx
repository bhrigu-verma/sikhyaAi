'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { Download, Trash2 } from 'lucide-react';

export function DataSection() {
  return (
    <div>
      <SectionHeader title="Data & Privacy" subtitle="Manage your data and account" />
      <Card padding="lg" className="mb-3">
        <div className="text-[13.5px] font-semibold text-fg mb-1">Export your data</div>
        <div className="text-[12.5px] text-muted mb-3.5">Download all your chats, progress, and notes as JSON.</div>
        <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export everything</Button>
      </Card>
      <Card padding="lg" className="mb-3">
        <div className="text-[13.5px] font-semibold text-fg mb-1">Clear AI history</div>
        <div className="text-[12.5px] text-muted mb-3.5">Remove all saved AI tutor conversations. Cannot be undone.</div>
        <Button variant="outline" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />}>Clear chats</Button>
      </Card>
      <Card padding="lg" className="border-danger/25">
        <div className="text-[13.5px] font-semibold text-danger mb-1">Delete account</div>
        <div className="text-[12.5px] text-muted mb-3.5">Permanently delete your account and all data. Cannot be undone.</div>
        <Button variant="danger" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />}>Delete my account</Button>
      </Card>
    </div>
  );
}
