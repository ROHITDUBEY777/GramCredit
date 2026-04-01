import SidebarLayout from '@/components/SidebarLayout';
import { formatINR, formatDate } from '@/lib/credit-utils';
import { mockTransactions } from '@/lib/mock-data';
import { useAuthStore } from '@/store/authStore';

export default function PurchaseHistory() {
  const { user } = useAuthStore();

  return (
    <SidebarLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Purchase History</h1>
      <div className="bg-card rounded-lg shadow-sm border border-border p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Village</th>
                <th className="pb-3 font-medium">Credits</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Invoice</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.filter(t => !user || t.corporate_id === user.id || user.role === 'corporate').map((t, i) => (
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
                  <td className="py-3 font-mono text-xs">{t.invoice_id}</td>
                  <td className="py-3">
                    <span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full capitalize">{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
