import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SidebarLayout from '@/components/SidebarLayout';
import StatCard from '@/components/StatCard';
import { useAuthStore } from '@/store/authStore';
import { formatINR, formatDate } from '@/lib/credit-utils';
import { mockReadings, mockMonthlyData } from '@/lib/mock-data';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const profile = user?.villager_profile;

  if (!user || !profile) return null;

  const earningsData = mockMonthlyData.map(d => ({
    month: d.month,
    gross: d.revenue,
    payout: d.payout,
  }));

  return (
    <SidebarLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="☀️" label="Total Credits Earned" value={profile.total_credits_earned} borderColor="border-t-accent" />
        <StatCard icon="₹" label="Total Payout" value={formatINR(profile.total_payout_received)} borderColor="border-t-success" />
        <StatCard icon="📊" label="Credits This Month" value={mockReadings[mockReadings.length - 1]?.credits_calculated || 0} borderColor="border-t-primary" />
        <StatCard icon="⚡" label="kWh This Month" value={`${mockReadings[mockReadings.length - 1]?.kwh_generated || 0} kWh`} borderColor="border-t-warning" />
      </div>

      {/* Solar panel info */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5 mb-8">
        <h2 className="font-heading font-bold text-lg mb-3">My Solar Panel</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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

      {/* Monthly earnings chart */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5 mb-8">
        <h2 className="font-heading font-bold text-lg mb-4">Monthly Earnings</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(val: number) => formatINR(val)} />
            <Bar dataKey="gross" fill="hsl(var(--earth-mid))" name="Gross Value" radius={[4, 4, 0, 0]} />
            <Bar dataKey="payout" fill="hsl(var(--sun))" name="Your Payout (70%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent readings */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5 mb-8">
        <h2 className="font-heading font-bold text-lg mb-4">Recent Readings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Month</th>
                <th className="pb-3 font-medium">kWh Generated</th>
                <th className="pb-3 font-medium">Credits</th>
                <th className="pb-3 font-medium">Payout</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockReadings.map((r, i) => (
                <tr key={r.id} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                  <td className="py-3">{r.month}/{r.year}</td>
                  <td className="py-3">{r.kwh_generated} kWh</td>
                  <td className="py-3">{r.credits_calculated}</td>
                  <td className="py-3">{formatINR(r.credits_calculated * 45 * 0.7)}</td>
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

      {/* Village section */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5">
        <h2 className="font-heading font-bold text-lg mb-3">My Village — {profile.village_name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">District, State</p>
            <p className="font-semibold">Anantapur, Karnataka</p>
          </div>
          <div>
            <p className="text-muted-foreground">Enrolled Households</p>
            <p className="font-semibold">47</p>
          </div>
          <div>
            <p className="text-muted-foreground">Village Credits This Month</p>
            <p className="font-semibold">634</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
