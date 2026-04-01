import { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import VillageCard from '@/components/VillageCard';
import { mockVillages } from '@/lib/mock-data';
import type { Village } from '@/types';

export default function VillageManager() {
  const [showForm, setShowForm] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  return (
    <SidebarLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Villages</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          + Add Village
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockVillages.map(v => (
          <VillageCard key={v.id} village={v} onClick={() => setSelectedVillage(v)} />
        ))}
      </div>

      {/* Village detail modal */}
      {selectedVillage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setSelectedVillage(null)}>
          <div className="bg-card rounded-xl shadow-lg border border-border p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-heading text-xl font-bold mb-4">{selectedVillage.name}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div><p className="text-muted-foreground">District</p><p className="font-semibold">{selectedVillage.district}</p></div>
              <div><p className="text-muted-foreground">State</p><p className="font-semibold">{selectedVillage.state}</p></div>
              <div><p className="text-muted-foreground">Status</p><p className="font-semibold capitalize">{selectedVillage.status}</p></div>
              <div><p className="text-muted-foreground">Population</p><p className="font-semibold">{selectedVillage.population}</p></div>
              <div><p className="text-muted-foreground">Enrolled HH</p><p className="font-semibold">{selectedVillage.enrolled_households}</p></div>
              <div><p className="text-muted-foreground">Solar kW</p><p className="font-semibold">{selectedVillage.total_solar_capacity_kw}</p></div>
              <div><p className="text-muted-foreground">Sunlight hrs</p><p className="font-semibold">{selectedVillage.daily_sunlight_hours}</p></div>
              <div><p className="text-muted-foreground">Water Stress</p><p className="font-semibold">{selectedVillage.has_water_stress ? 'Yes' : 'No'}</p></div>
              <div><p className="text-muted-foreground">Credits Generated</p><p className="font-semibold">{selectedVillage.total_credits_generated}</p></div>
              <div><p className="text-muted-foreground">CO₂ Avoided</p><p className="font-semibold">{selectedVillage.co2_avoided_tonnes}t</p></div>
            </div>
            {selectedVillage.monitor_name && (
              <div className="bg-muted rounded-lg p-3 text-sm">
                <p className="text-muted-foreground">Community Monitor</p>
                <p className="font-semibold">{selectedVillage.monitor_name} · {selectedVillage.monitor_phone}</p>
              </div>
            )}
            <button onClick={() => setSelectedVillage(null)} className="mt-4 w-full border border-input rounded-lg py-2 text-sm hover:bg-muted transition-colors">Close</button>
          </div>
        </div>
      )}

      {/* Add village modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl shadow-lg border border-border p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="font-heading text-xl font-bold mb-4">Add Village</h2>
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); setShowForm(false); }}>
              <input placeholder="Village name" className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background" />
              <input placeholder="District" className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background" />
              <input placeholder="State" className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Population" type="number" className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background" />
                <input placeholder="Total Households" type="number" className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background" />
              </div>
              <select className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background">
                <option>Pipeline</option>
                <option>Onboarding</option>
                <option>Active</option>
              </select>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-input rounded-lg py-2.5 text-sm hover:bg-muted">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:opacity-90">Add Village</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
