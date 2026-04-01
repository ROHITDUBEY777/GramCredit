import { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import CreditListingCard from '@/components/CreditListingCard';
import { mockListings } from '@/lib/mock-data';
import { formatINR } from '@/lib/credit-utils';
import type { CreditListing } from '@/types';

export default function Marketplace() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buyingListing, setBuyingListing] = useState<CreditListing | null>(null);
  const [buyAmount, setBuyAmount] = useState(1);
  const [purchased, setPurchased] = useState(false);

  const filtered = mockListings.filter(l => {
    if (typeFilter !== 'all' && l.listing_type !== typeFilter) return false;
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    return true;
  });

  const handlePurchase = () => {
    setPurchased(true);
    setTimeout(() => {
      setBuyingListing(null);
      setPurchased(false);
    }, 3000);
  };

  return (
    <SidebarLayout>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Verified Rural ESG Credits. BRSR-Ready.</h1>
        <p className="text-sm text-muted-foreground mt-1">Every credit comes with village identity, GPS data, and full audit documentation.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-input rounded-lg px-3 py-2 text-sm bg-background w-full sm:w-auto">
          <option value="all">All Types</option>
          <option value="solar">Solar</option>
          <option value="water">Water</option>
          <option value="combined">Combined</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-input rounded-lg px-3 py-2 text-sm bg-background w-full sm:w-auto">
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="partial">Partial</option>
          <option value="sold_out">Sold Out</option>
        </select>
      </div>

      {/* Listings grid */}
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

      {/* Buy Modal */}
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
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">Buy Credits</h3>
                <p className="text-sm text-muted-foreground mb-4">{buyingListing.batch_code} — {buyingListing.village_name}</p>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">How many credits? (max: {buyingListing.credits_remaining})</label>
                    <input type="number" min={1} max={buyingListing.credits_remaining} value={buyAmount}
                      onChange={e => setBuyAmount(Math.min(Number(e.target.value), buyingListing.credits_remaining))}
                      className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
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
