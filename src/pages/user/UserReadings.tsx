import { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '@/components/SidebarLayout';
import { useAuthStore } from '@/store/authStore';
import { formatINR, formatIndianNumber, waterVillagerPayoutFromLitresSaved, LITERS_PER_WATER_BLOCK } from '@/lib/credit-utils';
import { mockReadings, mockWaterReadings } from '@/lib/mock-data';

const SOLAR_PRICE = 45;

export default function UserReadings() {
  const { user } = useAuthStore();
  const profile = user?.villager_profile;
  const [tab, setTab] = useState<'solar' | 'water'>('solar');

  if (!user || !profile) return null;

  return (
    <SidebarLayout>
      <div className="mb-6">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← Back to Dashboard
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground mt-2">My Readings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Household in {profile.village_name}. Solar from your panel; water from IoT vs BIS baseline (₹15 gross per {LITERS_PER_WATER_BLOCK} L saved; you receive 70%).
        </p>
      </div>

      <div className="flex border border-border rounded-lg overflow-hidden mb-6 max-w-md">
        <button
          type="button"
          onClick={() => setTab('solar')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === 'solar' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          ☀️ Solar
        </button>
        <button
          type="button"
          onClick={() => setTab('water')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === 'water' ? 'bg-sky text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          💧 Water
        </button>
      </div>

      {tab === 'solar' ? (
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Month</th>
                  <th className="pb-3 font-medium">kWh</th>
                  <th className="pb-3 font-medium">Solar credits</th>
                  <th className="pb-3 font-medium">Est. payout (70%)</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockReadings.map((r, i) => (
                  <tr key={r.id} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                    <td className="py-3">{r.month}/{r.year}</td>
                    <td className="py-3">{r.kwh_generated} kWh</td>
                    <td className="py-3">{r.credits_calculated}</td>
                    <td className="py-3">{formatINR(r.credits_calculated * SOLAR_PRICE * 0.7)}</td>
                    <td className="py-3">
                      {r.verified ? (
                        <span className="text-success text-xs font-medium">Verified ✓</span>
                      ) : (
                        <span className="text-warning text-xs font-medium">Pending ⏳</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Month</th>
                  <th className="pb-3 font-medium">Litres saved</th>
                  <th className="pb-3 font-medium">100 L blocks</th>
                  <th className="pb-3 font-medium">Est. payout</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockWaterReadings.map((r, i) => (
                  <tr key={r.id} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                    <td className="py-3">{r.month}/{r.year}</td>
                    <td className="py-3">{formatIndianNumber(r.liters_conserved ?? 0)} L</td>
                    <td className="py-3">{r.credits_calculated}</td>
                    <td className="py-3">{formatINR(waterVillagerPayoutFromLitresSaved(r.liters_conserved ?? 0))}</td>
                    <td className="py-3">
                      {r.verified ? (
                        <span className="text-success text-xs font-medium">Verified ✓</span>
                      ) : (
                        <span className="text-warning text-xs font-medium">Pending ⏳</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            100 L blocks = floor(litres saved ÷ 100). Payout = ₹1 per block (gross) × 70% to your household. Sensors at the common source and your home feed this dashboard.
          </p>
        </div>
      )}
    </SidebarLayout>
  );
}
