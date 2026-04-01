import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  borderColor?: string;
}

export default function StatCard({ icon, label, value, sublabel, borderColor = 'border-t-primary' }: StatCardProps) {
  return (
    <div className={`bg-card rounded-lg shadow-sm border-t-[3px] ${borderColor} p-5`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-muted-foreground font-body">{label}</span>
      </div>
      <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
      {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
    </div>
  );
}
