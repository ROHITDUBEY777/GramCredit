// Credit calculation logic — shared between calculator and display components

export const BIS_BASELINE = 135; // liters per day per person

export function calculateSolar(panelKW: number, sunlightHours: number, months: number, pricePerCredit = 45) {
  const monthlyKWh = panelKW * sunlightHours * 30;
  const monthlyCredits = Math.floor(monthlyKWh / 10);
  const monthlyGross = monthlyCredits * pricePerCredit;
  const villagerShare = monthlyGross * 0.70;
  const gramcreditFee = monthlyGross * 0.30;
  const annualProjection = villagerShare * 12;
  const co2AvoidedKg = monthlyKWh * 0.82;
  const treesEquivalent = Math.round(co2AvoidedKg / 21.7);

  const monthlyBreakdown = Array.from({ length: months }, (_, i) => ({
    month: `Month ${i + 1}`,
    gross: monthlyGross,
    payout: villagerShare,
    credits: monthlyCredits,
  }));

  return {
    monthlyKWh: Math.round(monthlyKWh * 10) / 10,
    monthlyCredits,
    monthlyGross,
    villagerShare,
    gramcreditFee,
    annualProjection,
    co2AvoidedKg: Math.round(co2AvoidedKg * 10) / 10,
    treesEquivalent,
    totalCredits: monthlyCredits * months,
    totalPayout: villagerShare * months,
    monthlyBreakdown,
  };
}

export function calculateWater(householdSize: number, currentUsage: number, months: number, pricePerCredit = 15) {
  const dailyConservationPerPerson = BIS_BASELINE - currentUsage;
  const dailyHouseholdConservation = dailyConservationPerPerson * householdSize;
  const monthlyConservation = dailyHouseholdConservation * 30;
  const monthlyCredits = Math.floor(monthlyConservation / 100);
  const monthlyGross = monthlyCredits * pricePerCredit;
  const villagerShare = monthlyGross * 0.70;

  const monthlyBreakdown = Array.from({ length: months }, (_, i) => ({
    month: `Month ${i + 1}`,
    gross: monthlyGross,
    payout: villagerShare,
    credits: monthlyCredits,
  }));

  return {
    dailyConservationPerPerson,
    dailyHouseholdConservation,
    monthlyConservation,
    monthlyCredits,
    monthlyGross,
    villagerShare,
    totalCredits: monthlyCredits * months,
    totalPayout: villagerShare * months,
    monthlyBreakdown,
  };
}

// Format numbers in Indian numbering system (e.g. 1,23,456)
export function formatINR(num: number): string {
  const str = Math.round(num).toString();
  if (str.length <= 3) return '₹' + str;
  let lastThree = str.substring(str.length - 3);
  const rest = str.substring(0, str.length - 3);
  if (rest !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return '₹' + formatted;
}

export function formatIndianNumber(num: number): string {
  const str = Math.round(num).toString();
  if (str.length <= 3) return str;
  let lastThree = str.substring(str.length - 3);
  const rest = str.substring(0, str.length - 3);
  if (rest !== '') {
    lastThree = ',' + lastThree;
  }
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
