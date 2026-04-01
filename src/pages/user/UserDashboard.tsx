import { Link } from 'react-router-dom';
import SidebarLayout from '@/components/SidebarLayout';
import StatCard from '@/components/StatCard';
import { useAuthStore } from '@/store/authStore';
import { formatINR, formatDate, formatIndianNumber, waterVillagerPayoutFromLitresSaved, LITERS_PER_WATER_BLOCK, WATER_VILLAGER_INR_PER_100L } from '@/lib/credit-utils';
import { mockReadings, mockWaterReadings } from '@/lib/mock-data';

const SOLAR_PRICE = 45;

export default function UserDashboard() {
  const { user } = useAuthStore();
  const profile = user?.villager_profile;

  if (!user || !profile) return null;

  const solarCredits = profile.solar_credits_earned ?? 0;
  const waterCredits = profile.water_credits_earned ?? 0;
  const litersSaved = profile.water_liters_saved_total ?? 0;

  const lastSolar = mockReadings[mockReadings.length - 1];
  const lastWater = mockWaterReadings[mockWaterReadings.length - 1];

  const solarThisMonth = lastSolar?.credits_calculated ?? 0;
  const litersThisMonth = lastWater?.liters_conserved ?? 0;
  const waterThisMonth = Math.floor(litersThisMonth / LITERS_PER_WATER_BLOCK);
  const waterEstPayout = waterVillagerPayoutFromLitresSaved(litersThisMonth);

  return (
    <SidebarLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Credits are earned separately: <span className="text-foreground font-medium">solar</span> from kWh generated and{' '}
        <span className="text-foreground font-medium">water</span> from litres saved (₹{WATER_VILLAGER_INR_PER_100L} per {LITERS_PER_WATER_BLOCK} L before your 70% share), measured by IoT.
      </p>

      {/* Split credit overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon="☀️" label="Solar credits (lifetime)" value={solarCredits} borderColor="border-t-accent" />
        <StatCard icon="💧" label="Water credits (lifetime)" value={waterCredits} borderColor="border-t-sky" />
        <StatCard icon="🚰" label="Water saved (total L)" value={formatIndianNumber(litersSaved)} borderColor="border-t-primary" />
        <StatCard icon="₹" label="Total payout received" value={formatINR(profile.total_payout_received)} borderColor="border-t-success" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
          <h2 className="font-heading font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">This month — Solar</h2>
          <div className="flex justify-between items-baseline gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Credits</p>
              <p className="text-2xl font-heading font-bold text-foreground">{solarThisMonth}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">kWh</p>
              <p className="text-lg font-semibold">{lastSolar?.kwh_generated ?? 0}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Est. payout (70%)</p>
              <p className="text-sm font-semibold text-primary">{formatINR(solarThisMonth * SOLAR_PRICE * 0.7)}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
          <h2 className="font-heading font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">This month — Water</h2>
          <div className="flex justify-between items-baseline gap-4 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground">100 L blocks ({LITERS_PER_WATER_BLOCK} L = 1)</p>
              <p className="text-2xl font-heading font-bold text-sky">{waterThisMonth}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Litres saved</p>
              <p className="text-lg font-semibold">{formatIndianNumber(litersThisMonth)} L</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Est. payout (70% of ₹1/block)</p>
              <p className="text-sm font-semibold text-primary">{formatINR(waterEstPayout)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solar panel info */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5 mb-8">
        <h2 className="font-heading font-bold text-lg mb-3">My Solar Panel</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Capacity</p>
            <p className="font-semibold">{profile.panel_capacity_kw} kW</p>
          </div>
          <div>
            <p className="text-muted-foreground">Installed</p>
            <p className="font-semibold">{profile.panel_installed_date ? formatDate(profile.panel_installed_date) : '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-semibold text-success">Active ✓</p>
          </div>
          <div>
            <p className="text-muted-foreground">Monthly Estimate</p>
            <p className="font-semibold">{Math.round(profile.panel_capacity_kw * 5.5 * 30)} kWh</p>
          </div>
        </div>
      </div>

      {/* Water IoT */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5 mb-8">
        <h2 className="font-heading font-bold text-lg mb-2">Water savings (IoT)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Meters at the village common tap and your home record usage against the BIS baseline. Savings convert to credits; you redeem for cash on your weekly or monthly cycle.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total litres saved (verified)</p>
            <p className="font-semibold text-lg">{formatIndianNumber(litersSaved)} L</p>
          </div>
          <div>
            <p className="text-muted-foreground">Water credits earned</p>
            <p className="font-semibold text-lg text-sky">{waterCredits}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Villager rate</p>
            <p className="font-semibold">₹{WATER_VILLAGER_INR_PER_100L} / {LITERS_PER_WATER_BLOCK} L saved (gross)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/dashboard/readings"
          className="group bg-card rounded-lg border border-border p-5 shadow-sm hover:border-primary/40 hover:bg-muted/30 transition-colors"
        >
          <h2 className="font-heading font-bold text-lg text-foreground group-hover:text-primary">My Readings</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-3">
            Solar (kWh) and water (litres saved) history with verification status.
          </p>
          <span className="text-sm font-semibold text-primary">Open readings →</span>
        </Link>
        <Link
          to="/dashboard/earnings"
          className="group bg-card rounded-lg border border-border p-5 shadow-sm hover:border-primary/40 hover:bg-muted/30 transition-colors"
        >
          <h2 className="font-heading font-bold text-lg text-foreground group-hover:text-primary">Earnings</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-3">
            Payout breakdown for solar vs water by month.
          </p>
          <span className="text-sm font-semibold text-primary">Open earnings →</span>
        </Link>
      </div>

      {/* Village section */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5">
        <h2 className="font-heading font-bold text-lg mb-3">My Village — {profile.village_name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">District, State</p>
            <p className="font-semibold">Bangalore, Karnataka</p>
          </div>
          <div>
            <p className="text-muted-foreground">Enrolled Households</p>
            <p className="font-semibold">47</p>
          </div>
          <div>
            <p className="text-muted-foreground">Village pool (solar / water this month)</p>
            <p className="font-semibold">412 / 1,240 credits</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
