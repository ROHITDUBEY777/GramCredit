import SidebarLayout from '@/components/SidebarLayout';
import StatCard from '@/components/StatCard';
import { useAuthStore } from '@/store/authStore';
import { formatINR, formatDate } from '@/lib/credit-utils';
import { mockTransactions } from '@/lib/mock-data';

export default function CorporateDashboard() {
  const { user } = useAuthStore();
  const profile = user?.corporate_profile;

  if (!user || !profile) return null;

  return (
    <SidebarLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Corporate Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📊" label="Total Credits Acquired" value={profile.total_credits_acquired} borderColor="border-t-primary" />
        <StatCard icon="₹" label="Total Spent" value={formatINR(profile.total_spent)} borderColor="border-t-accent" />
        <StatCard icon="🏘️" label="Villages Supported" value={1} borderColor="border-t-success" />
        <StatCard icon="🌿" label="CO₂ Offset" value={`${Math.round(profile.total_credits_acquired * 0.82 * 10 / 1000 * 10) / 10}t`} borderColor="border-t-earth-mid" />
      </div>

      {/* Purchase history */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-5 mb-8">
        <h2 className="font-heading font-bold text-lg mb-4">Purchase History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[660px]">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Village</th>
                <th className="pb-3 font-medium">Credits</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">BRSR Doc</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.filter(t => t.corporate_id === user.id).map((t, i) => (
                <tr key={t.id} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                  <td className="py-3">{formatDate(t.purchased_at)}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.credit_type === 'water' ? 'bg-sky/15 text-sky' : 'bg-primary/10 text-primary'}`}>
                      {t.credit_type === 'water' ? 'Water' : t.credit_type === 'solar' ? 'Solar' : '—'}
                    </span>
                  </td>
                  <td className="py-3">{t.village_name}</td>
                  <td className="py-3">{t.credits_purchased}</td>
                  <td className="py-3">{formatINR(t.total_amount)}</td>
                  <td className="py-3">
                    <button className="text-primary text-xs hover:underline">Download</button>
                  </td>
                  <td className="py-3">
                    <span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full capitalize">{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Impact summary */}
      <div className="bg-primary text-primary-foreground rounded-lg p-6">
        <h2 className="font-heading font-bold text-lg mb-4">Your ESG Impact This Year</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="opacity-70">Credits Purchased</p>
            <p className="text-xl font-bold">{profile.total_credits_acquired}</p>
          </div>
          <div>
            <p className="opacity-70">Households Benefited</p>
            <p className="text-xl font-bold">47</p>
          </div>
          <div>
            <p className="opacity-70">CO₂ Avoided</p>
            <p className="text-xl font-bold">{Math.round(profile.total_credits_acquired * 8.2)} kg</p>
          </div>
          <div>
            <p className="opacity-70">BRSR Status</p>
            <p className="text-xl font-bold">Ready ✓</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
