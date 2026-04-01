import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SidebarLayout from '@/components/SidebarLayout';
import StatCard from '@/components/StatCard';
import { formatINR, formatDate } from '@/lib/credit-utils';
import { mockAdminOverview, mockMonthlyData, mockTransactions, mockVillages, mockListings } from '@/lib/mock-data';

const pieData = [
  { name: 'Solar', value: 3200, color: 'hsl(35, 90%, 55%)' },
  { name: 'Water', value: 610, color: 'hsl(210, 53%, 23%)' },
];

function creditTypeLabel(t?: string) {
  if (t === 'water') return 'Water';
  if (t === 'solar') return 'Solar';
  if (t === 'combined') return 'Combined';
  return '—';
}

export default function AdminDashboard() {
  const o = mockAdminOverview;
  const waterListings = mockListings.filter(l => l.listing_type === 'water');

  return (
    <SidebarLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Admin Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatCard icon="🏘️" label="Total Villages" value={o.total_villages} sublabel={`${o.active_villages} active · ${o.onboarding_villages} onboarding · ${o.pipeline_villages} pipeline`} borderColor="border-t-primary" />
        <StatCard icon="👨‍👩‍👧‍👦" label="Enrolled Households" value={o.total_enrolled_households} borderColor="border-t-earth-mid" />
        <StatCard icon="📊" label="Credits Generated" value={o.total_credits_generated} borderColor="border-t-accent" />
        <StatCard icon="✅" label="Credits Sold" value={o.total_credits_sold} borderColor="border-t-success" />
        <StatCard icon="💰" label="Revenue (30%)" value={formatINR(o.total_revenue)} borderColor="border-t-warning" />
        <StatCard icon="🏦" label="Paid to Villages" value={formatINR(o.total_paid_to_villages)} borderColor="border-t-sky" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <h3 className="font-heading font-bold mb-4">Monthly Credits: Generated vs Sold</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="credits_generated" stroke="hsl(var(--earth-mid))" name="Generated" strokeWidth={2} />
              <Line type="monotone" dataKey="credits_sold" stroke="hsl(var(--sun))" name="Sold" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <h3 className="font-heading font-bold mb-4">Credit Type Split</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5 mb-8">
        <h3 className="font-heading font-bold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Corporate</th>
                <th className="pb-3 font-medium">Village</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Credits</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Fee (30%)</th>
                <th className="pb-3 font-medium">Village Share</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((t, i) => (
                <tr key={t.id} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                  <td className="py-3">{t.corporate_name}</td>
                  <td className="py-3">{t.village_name}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.credit_type === 'water' ? 'bg-sky/15 text-sky' : 'bg-primary/10 text-primary'}`}>
                      {creditTypeLabel(t.credit_type)}
                    </span>
                  </td>
                  <td className="py-3">{t.credits_purchased}</td>
                  <td className="py-3">{formatINR(t.total_amount)}</td>
                  <td className="py-3">{formatINR(t.gramcredit_fee)}</td>
                  <td className="py-3">{formatINR(t.village_share)}</td>
                  <td className="py-3">{formatDate(t.purchased_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Water credits by village (marketplace listings) */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5 mb-8">
        <h3 className="font-heading font-bold mb-2">Water credits — listings by village</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Corporates buy water conservation credits separately; each row is a bundle from IoT-verified savings in that village.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Village</th>
                <th className="pb-3 font-medium">District</th>
                <th className="pb-3 font-medium">Batch</th>
                <th className="pb-3 font-medium">Available / Total</th>
                <th className="pb-3 font-medium">₹/credit</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {waterListings.map((l, i) => (
                <tr key={l.id} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                  <td className="py-3 font-medium">{l.village_name}</td>
                  <td className="py-3">{l.village_district}</td>
                  <td className="py-3 font-mono text-xs">{l.batch_code}</td>
                  <td className="py-3">{l.credits_remaining} / {l.total_credits}</td>
                  <td className="py-3">{l.price_per_credit}</td>
                  <td className="py-3 capitalize">{l.status.replace('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Village health */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5">
        <h3 className="font-heading font-bold mb-4">Village Health</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Village</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Enrolled HH</th>
                <th className="pb-3 font-medium">Credits/Month</th>
                <th className="pb-3 font-medium">Solar kW</th>
                <th className="pb-3 font-medium">Water IoT</th>
              </tr>
            </thead>
            <tbody>
              {mockVillages.map((v, i) => (
                <tr key={v.id} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                  <td className="py-3 font-medium">{v.name}, {v.state}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${v.status === 'active' ? 'bg-success/10 text-success' : v.status === 'onboarding' ? 'bg-warning/10 text-warning' : 'bg-sky/10 text-sky'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3">{v.enrolled_households}</td>
                  <td className="py-3">{v.status === 'active' ? 634 : 0}</td>
                  <td className="py-3">{v.total_solar_capacity_kw}</td>
                  <td className="py-3 text-xs">{v.has_water_stress ? 'IoT · high stress' : 'IoT · standard'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
