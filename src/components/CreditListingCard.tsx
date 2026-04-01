import type { CreditListing } from '@/types';
import { formatINR } from '@/lib/credit-utils';

const statusColors: Record<string, string> = {
  available: 'bg-success/10 text-success',
  partial: 'bg-warning/10 text-warning',
  sold_out: 'bg-muted text-muted-foreground',
};

const typeIcons: Record<string, string> = {
  solar: '☀️',
  water: '💧',
  combined: '🌿',
};

interface CreditListingCardProps {
  listing: CreditListing;
  onBuy?: () => void;
}

export default function CreditListingCard({ listing, onBuy }: CreditListingCardProps) {
  const soldPercent = Math.round(((listing.total_credits - listing.credits_remaining) / listing.total_credits) * 100);

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[listing.listing_type]}</span>
          <span className="font-mono text-xs text-muted-foreground">{listing.batch_code}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[listing.status]}`}>
          {listing.status.replace('_', ' ')}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h3 className="font-heading font-bold text-foreground">{listing.village_name}</h3>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            listing.listing_type === 'water' ? 'bg-sky/15 text-sky' : 'bg-primary/10 text-primary'
          }`}
        >
          {listing.listing_type === 'water' ? 'Water credits' : listing.listing_type === 'solar' ? 'Solar credits' : 'Combined'}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{listing.village_district}, {listing.village_state}</p>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Credits Available</span>
          <span className="font-semibold">{listing.credits_remaining} / {listing.total_credits}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${soldPercent}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Price per credit</span>
          <span className="font-semibold">{formatINR(listing.price_per_credit)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Bundle value</span>
          <span className="font-semibold">{formatINR(listing.total_bundle_value)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {listing.sdg_tags.map(tag => (
          <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
        {listing.gps_verified && <span className="flex items-center gap-1">✓ GPS Verified</span>}
        {listing.meter_certified && <span className="flex items-center gap-1">✓ Meter Certified</span>}
        {listing.brsr_ready && <span className="flex items-center gap-1">✓ BRSR-Ready</span>}
      </div>

      {listing.status !== 'sold_out' && (
        <button
          onClick={onBuy}
          className="w-full bg-primary text-primary-foreground rounded-md py-2.5 font-medium hover:opacity-90 transition-opacity"
        >
          Buy Credits →
        </button>
      )}
    </div>
  );
}
