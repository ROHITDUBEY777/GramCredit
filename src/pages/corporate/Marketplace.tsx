import { useState, useMemo } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import CreditListingCard from '@/components/CreditListingCard';
import { mockListings } from '@/lib/mock-data';
import { formatINR } from '@/lib/credit-utils';
import type { CreditListing } from '@/types';

export default function Marketplace() {
  const [marketplaceMode, setMarketplaceMode] = useState<'solar' | 'water' | 'all'>('solar');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buyingListing, setBuyingListing] = useState<CreditListing | null>(null);
  const [buyAmount, setBuyAmount] = useState(1);
  const [purchased, setPurchased] = useState(false);

  const filtered = useMemo(() => {
    return mockListings.filter(l => {
      if (marketplaceMode === 'solar' && l.listing_type !== 'solar') return false;
      if (marketplaceMode === 'water' && l.listing_type !== 'water') return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      return true;
    });
  }, [marketplaceMode, statusFilter]);

  const handlePurchase = () => {
    setPurchased(true);
    setTimeout(() => {
      setBuyingListing(null);
      setPurchased(false);
    }, 3000);
  };

  const modeTitle: Record<typeof marketplaceMode, string> = {
    solar: 'Solar credits',
    water: 'Water credits',
    all: 'All credit types',
  };

  return (
    <SidebarLayout>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Marketplace</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Buy verified credits by village. Use <span className="font-medium text-foreground">Solar</span> for kWh-based
          generation credits and <span className="font-medium text-foreground">Water</span> for IoT-measured conservation credits from different villages.
        </p>
      </div>

      {/* Primary: Solar vs Water vs All */}
      <div className="flex flex-col gap-3 mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Credit type</p>
        <div className="flex flex-wrap gap-2">
          {([
            ['solar', '☀️ Solar credits'],
            ['water', '💧 Water credits'],
            ['all', 'All types'],
          ] as const).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setMarketplaceMode(mode)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                marketplaceMode === mode
                  ? mode === 'water'
                    ? 'bg-sky text-primary-foreground'
                    : mode === 'solar'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
        <p className="text-sm text-foreground">
          Showing: <span className="font-semibold">{modeTitle[marketplaceMode]}</span>
          {marketplaceMode === 'water' && (
            <span className="text-muted-foreground"> — priced at ₹15/credit (demo); each bundle lists its village.</span>
          )}
        </p>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-input rounded-lg px-3 py-2 text-sm bg-background w-full sm:w-auto"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="partial">Partial</option>
          <option value="sold_out">Sold Out</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map(listing => (
          <CreditListingCard key={listing.id} listing={listing} onBuy={() => { setBuyingListing(listing); setBuyAmount(1); }} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No listings match your filters</p>
        </div>
      )}

      {buyingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => !purchased && setBuyingListing(null)}>
          <div className="bg-card rounded-xl shadow-lg border border-border p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            {purchased ? (
              <div className="text-center py-6">
                <p className="text-4xl mb-3">✅</p>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">Purchase Confirmed!</h3>
                <p className="text-sm text-muted-foreground mb-1">BRSR impact certificate reference:</p>
                <p className="font-mono font-bold text-primary">GC-2026-{String(Math.floor(Math.random() * 9999)).padStart(4, '0')}</p>
                <p className="text-xs text-muted-foreground mt-3">Village households will receive payment within 3 business days.</p>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                  Buy {buyingListing.listing_type === 'water' ? 'Water' : 'Solar'} Credits
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {buyingListing.batch_code} — {buyingListing.village_name}, {buyingListing.village_district}
                </p>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">How many credits? (max: {buyingListing.credits_remaining})</label>
                    <input
                      type="number"
                      min={1}
                      max={buyingListing.credits_remaining}
                      value={buyAmount}
                      onChange={e => setBuyAmount(Math.min(Number(e.target.value), buyingListing.credits_remaining))}
                      className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credits</span>
                      <span>{buyAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per credit</span>
                      <span>{formatINR(buyingListing.price_per_credit)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-border pt-2">
                      <span>Total you pay</span>
                      <span>{formatINR(buyAmount * buyingListing.price_per_credit)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">After purchase, 70% goes directly to village households.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setBuyingListing(null)} className="flex-1 border border-input rounded-lg py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button onClick={handlePurchase} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
                    Confirm Purchase
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
