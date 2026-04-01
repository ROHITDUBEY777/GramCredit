import SidebarLayout from '@/components/SidebarLayout';
import { mockCurrentUser, mockCorporateUser } from '@/lib/mock-data';
import { formatINR, formatDate } from '@/lib/credit-utils';
import { useState } from 'react';

const allUsers = [
  mockCurrentUser,
  { ...mockCurrentUser, id: 'u2', name: 'Ravi Kumar', email: 'user2@alluru.in', villager_profile: { ...mockCurrentUser.villager_profile!, total_credits_earned: 148, total_payout_received: 4662 } },
  { ...mockCurrentUser, id: 'u3', name: 'Anita Devi', email: 'user3@alluru.in', villager_profile: { ...mockCurrentUser.villager_profile!, total_credits_earned: 162, total_payout_received: 5103 } },
  mockCorporateUser,
  { ...mockCorporateUser, id: 'corp2', name: 'Suresh Patel', email: 'bosch@corp.in', corporate_profile: { ...mockCorporateUser.corporate_profile!, company_name: 'Bosch India', total_credits_acquired: 200, total_spent: 9000 } },
];

export default function UserManager() {
  const [roleFilter, setRoleFilter] = useState('all');
  
  const filtered = allUsers.filter(u => roleFilter === 'all' || u.role === roleFilter);

  return (
    <SidebarLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Users</h1>

      <div className="flex gap-3 mb-6">
        {['all', 'user', 'corporate'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${roleFilter === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {r === 'all' ? 'All' : r === 'user' ? 'Villagers' : 'Corporates'}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Village / Company</th>
                <th className="pb-3 font-medium">Credits</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className={`border-b border-border ${i % 2 === 1 ? 'bg-muted/30' : ''}`}>
                  <td className="py-3 font-medium">{u.name}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${u.role === 'user' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                      {u.role === 'user' ? 'villager' : u.role}
                    </span>
                  </td>
                  <td className="py-3">{u.villager_profile?.village_name || u.corporate_profile?.company_name || '—'}</td>
                  <td className="py-3">{u.villager_profile?.total_credits_earned || u.corporate_profile?.total_credits_acquired || 0}</td>
                  <td className="py-3">{formatDate(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
