import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateSolar, calculateWater, formatINR, formatIndianNumber } from '@/lib/credit-utils';

export default function CreditCalculator() {
  const [tab, setTab] = useState<'solar' | 'water'>('solar');

  // Solar inputs
  const [panelKW, setPanelKW] = useState(1.5);
  const [sunlightHours, setSunlightHours] = useState(5.5);
  const [solarMonths, setSolarMonths] = useState(6);

  // Water inputs
  const [householdSize, setHouseholdSize] = useState(4);
  const [currentUsage, setCurrentUsage] = useState(120);
  const [waterMonths, setWaterMonths] = useState(6);

  const solar = useMemo(() => calculateSolar(panelKW, sunlightHours, solarMonths), [panelKW, sunlightHours, solarMonths]);
  const water = useMemo(() => calculateWater(householdSize, currentUsage, waterMonths), [householdSize, currentUsage, waterMonths]);
  const totalWaterSaved = water.monthlyConservation * waterMonths;

  const combinedMonthly = solar.villagerShare + water.villagerShare;

  return (
    <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setTab('solar')}
          className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === 'solar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
        >
          ☀️ Solar
        </button>
        <button
          onClick={() => setTab('water')}
          className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === 'water' ? 'bg-sky text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
        >
          💧 Water
        </button>
      </div>

      <div className="p-6">
        {tab === 'solar' ? (
          <div className="space-y-5">
            <SliderInput label="Panel Capacity" value={panelKW} min={0.5} max={5} step={0.5} unit="kW" onChange={setPanelKW} />
            <SliderInput label="Sunlight Hours/Day" value={sunlightHours} min={3} max={7} step={0.5} unit="hrs" onChange={setSunlightHours} />
            <SliderInput label="Number of Months" value={solarMonths} min={1} max={12} step={1} unit="months" onChange={setSolarMonths} />
            <div className="text-sm text-muted-foreground">Credit price: <span className="font-semibold text-foreground">₹45/credit</span> (fixed)</div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <ResultBox label="Monthly kWh" value={`${solar.monthlyKWh}`} />
              <ResultBox label="Monthly Credits" value={`${solar.monthlyCredits}`} />
              <ResultBox label="Monthly Gross" value={formatINR(solar.monthlyGross)} />
              <ResultBox label="Your Share (70%)" value={formatINR(solar.villagerShare)} highlight />
              <ResultBox label="Annual Projection" value={formatINR(solar.annualProjection)} />
              <ResultBox label="CO₂ Avoided" value={`${solar.co2AvoidedKg} kg (≈ ${solar.treesEquivalent} trees)`} />
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Monthly Earnings Projection</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={solar.monthlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: number) => formatINR(val)} />
                  <Bar dataKey="gross" fill="hsl(var(--earth-mid))" name="Gross" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="payout" fill="hsl(var(--sun))" name="Your Payout" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <SliderInput label="Household Size" value={householdSize} min={1} max={10} step={1} unit="people" onChange={setHouseholdSize} />
            <SliderInput label="Current Usage (L/day/person)" value={currentUsage} min={80} max={135} step={1} unit="L" onChange={setCurrentUsage} />
            <SliderInput label="Number of Months" value={waterMonths} min={1} max={12} step={1} unit="months" onChange={setWaterMonths} />
            <div className="text-sm text-muted-foreground">BIS baseline: <span className="font-semibold text-foreground">135 L/day</span> | Credit price: <span className="font-semibold text-foreground">₹15/credit</span></div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <ResultBox label="Daily Conservation/Person" value={`${water.dailyConservationPerPerson} L`} />
              <ResultBox label="Daily Household" value={`${water.dailyHouseholdConservation} L`} />
              <ResultBox label="Monthly Conservation" value={`${formatIndianNumber(water.monthlyConservation)} L`} />
              <ResultBox label="Monthly Credits" value={`${water.monthlyCredits}`} />
              <ResultBox label="Monthly Gross" value={formatINR(water.monthlyGross)} />
              <ResultBox label="Your Share (70%)" value={formatINR(water.villagerShare)} highlight />
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Savings Counter</p>
              <p className="text-lg font-heading font-bold text-primary">
                {formatIndianNumber(totalWaterSaved)} L saved in {waterMonths} month{waterMonths > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Equivalent to {formatIndianNumber(Math.round(totalWaterSaved / 1000))} kL of water conserved by your household.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Monthly Earnings Projection</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={water.monthlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: number) => formatINR(val)} />
                  <Bar dataKey="gross" fill="hsl(210, 53%, 23%)" name="Gross" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="payout" fill="hsl(var(--sun))" name="Your Payout" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Combined callout */}
        <div className="mt-5 bg-sun-pale/40 border border-accent/30 rounded-lg p-4">
          <p className="font-heading font-bold text-sm text-foreground mb-1">Combined (Solar + Water) Potential</p>
          <p className="text-sm text-muted-foreground">
            Monthly combined earnings: <span className="font-bold text-foreground">{formatINR(combinedMonthly)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function SliderInput({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value} {unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
      />
    </div>
  );
}

function ResultBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? 'bg-accent/10 border border-accent/30' : 'bg-muted'}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-accent' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}
