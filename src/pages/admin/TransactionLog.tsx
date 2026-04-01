import SidebarLayout from '@/components/SidebarLayout';
import { formatINR, formatDate } from '@/lib/credit-utils';
import { mockTransactions } from '@/lib/mock-data';

export default function TransactionLog() {
  const handleExport = () => {
    alert('Export ready — CSV file will download shortly.');
  };

  return (
    <SidebarLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Transaction Log</h1>
        <button onClick={handleExport} className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          Export CSV
        </button>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Invoice</th>
                <th className="pb-3 font-medium">Corporate</th>
                <th className="pb-3 font-medium">Village</th>
                <th className="pb-3 font-medium">Credits</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Fee (30%)</th>
                <th className="pb-3 font-medium">Village Share</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((t, i) => (
                <tr key={t.id} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                  <td className="py-3 font-mono text-xs">{t.invoice_id}</td>
                  <td className="py-3">{t.corporate_name}</td>
                  <td className="py-3">{t.village_name}</td>
                  <td className="py-3">{t.credits_purchased}</td>
                  <td className="py-3">{formatINR(t.total_amount)}</td>
                  <td className="py-3">{formatINR(t.gramcredit_fee)}</td>
                  <td className="py-3">{formatINR(t.village_share)}</td>
                  <td className="py-3">
                    <span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full capitalize">{t.status}</span>
                  </td>
                  <td className="py-3">{formatDate(t.purchased_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
