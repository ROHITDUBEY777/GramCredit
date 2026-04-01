import { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { useAuthStore } from '@/store/authStore';
import { LITERS_PER_WATER_BLOCK, WATER_VILLAGER_INR_PER_100L } from '@/lib/credit-utils';

export default function AdminSettings() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [notifyEmail, setNotifyEmail] = useState('ops@gramcredit.in');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <SidebarLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Settings</h1>
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 max-w-lg">
        {saved && <div className="bg-success/10 text-success text-sm rounded-lg p-3 mb-4">Settings saved!</div>}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={phone || ''}
              onChange={e => setPhone(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Operations alerts</label>
            <input
              type="email"
              value={notifyEmail}
              onChange={e => setNotifyEmail(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">Low inventory, payout failures, etc.</p>
          </div>

          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <p className="font-medium text-foreground">Platform rates (reference)</p>
            <p className="text-muted-foreground">
              Villager water: <span className="text-foreground font-medium">₹{WATER_VILLAGER_INR_PER_100L} per {LITERS_PER_WATER_BLOCK} L</span> saved (gross; 70% to household).
            </p>
            <p className="text-muted-foreground">
              Solar: <span className="text-foreground font-medium">₹45 / credit</span> (10 kWh = 1 credit). Corporate water bundles: <span className="text-foreground font-medium">₹15 / credit</span> on marketplace.
            </p>
          </div>

          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 font-semibold hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </form>
      </div>
    </SidebarLayout>
  );
}
