import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SidebarLayout from '@/components/SidebarLayout';
import { useAuthStore } from '@/store/authStore';
import { formatINR, waterVillagerPayoutFromLitresSaved } from '@/lib/credit-utils';
import { mockReadings, mockWaterReadings } from '@/lib/mock-data';

const SOLAR_PRICE = 45;

export default function UserEarnings() {
  const { user } = useAuthStore();
  const profile = user?.villager_profile;

  if (!user || !profile) return null;

  const combined = mockReadings.map((r, i) => {
    const w = mockWaterReadings[i];
    const solarPayout = r.credits_calculated * SOLAR_PRICE * 0.7;
    const waterPayout = w ? waterVillagerPayoutFromLitresSaved(w.liters_conserved ?? 0) : 0;
    return {
      label: `${r.month}/${r.year}`,
      solarPayout,
      waterPayout,
      total: solarPayout + waterPayout,
    };
  });

  const totalSolarPayout = combined.reduce((s, r) => s + r.solarPayout, 0);
  const totalWaterPayout = combined.reduce((s, r) => s + r.waterPayout, 0);

  return (
    <SidebarLayout>
      <div className="mb-6">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← Back to Dashboard
        </Link>
        <h1 className="font-heading text-2xl font-bold text-foreground mt-2">Earnings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your estimated villager share (70%) from solar (₹{SOLAR_PRICE}/credit) and water (₹1 per 100 L saved, gross, before your 70%).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Solar payout (period)</p>
          <p className="text-xl font-heading font-bold text-foreground">{formatINR(totalSolarPayout)}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Water payout (period)</p>
          <p className="text-xl font-heading font-bold text-sky">{formatINR(totalWaterPayout)}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Combined</p>
          <p className="text-xl font-heading font-bold text-primary">{formatINR(totalSolarPayout + totalWaterPayout)}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-5 mb-8">
        <h2 className="font-heading font-bold text-lg mb-4">Monthly payout — solar vs water</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={combined}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(val: number) => formatINR(val)} />
            <Legend />
            <Bar dataKey="solarPayout" fill="hsl(var(--earth-mid))" name="Solar (70%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="waterPayout" fill="hsl(var(--sky))" name="Water (70%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <h2 className="font-heading font-bold text-lg mb-4">Solar — month by month</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[280px]">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Month</th>
                  <th className="pb-3 font-medium">Payout</th>
                </tr>
              </thead>
              <tbody>
                {combined.map((row, i) => (
                  <tr key={row.label} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                    <td className="py-2">{row.label}</td>
                    <td className="py-2">{formatINR(row.solarPayout)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <h2 className="font-heading font-bold text-lg mb-4">Water — month by month</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[280px]">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Month</th>
                  <th className="pb-3 font-medium">Payout</th>
                </tr>
              </thead>
              <tbody>
                {combined.map((row, i) => (
                  <tr key={row.label} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                    <td className="py-2">{row.label}</td>
                    <td className="py-2">{formatINR(row.waterPayout)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
