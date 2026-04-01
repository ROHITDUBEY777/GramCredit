import type { Village } from '@/types';

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  onboarding: 'bg-warning/10 text-warning',
  pipeline: 'bg-sky/10 text-sky',
};

interface VillageCardProps {
  village: Village;
  onClick?: () => void;
}

export default function VillageCard({ village, onClick }: VillageCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-lg shadow-sm border border-border p-5 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">{village.name}</h3>
          <p className="text-sm text-muted-foreground">{village.district}, {village.state}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[village.status]}`}>
          {village.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Households</p>
          <p className="font-semibold">{village.enrolled_households} / {village.total_households}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Solar kW</p>
          <p className="font-semibold">{village.total_solar_capacity_kw}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Credits</p>
          <p className="font-semibold">{village.total_credits_generated}</p>
        </div>
        <div>
          <p className="text-muted-foreground">CO₂ Avoided</p>
          <p className="font-semibold">{village.co2_avoided_tonnes}t</p>
        </div>
      </div>
    </div>
  );
}
