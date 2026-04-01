import { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { useAuthStore } from '@/store/authStore';

export default function UserProfile() {
  const { user } = useAuthStore();
  const profile = user?.villager_profile;
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [upi, setUpi] = useState(profile?.upi_id || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SidebarLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Profile</h1>
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 max-w-lg">
        {saved && <div className="bg-success/10 text-success text-sm rounded-lg p-3 mb-4">Profile updated!</div>}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">UPI ID</label>
            <input type="text" value={upi} onChange={e => setUpi(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Panel Capacity</p>
              <p className="font-semibold">{profile?.panel_capacity_kw || 0} kW</p>
            </div>
            <div>
              <p className="text-muted-foreground">Household Size</p>
              <p className="font-semibold">{profile?.household_size || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Bank Linked</p>
              <p className="font-semibold">{profile?.bank_account_linked ? 'Yes ✓' : 'No'}</p>
            </div>
          </div>
          <button type="submit" className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 font-semibold hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </form>
      </div>
    </SidebarLayout>
  );
}
