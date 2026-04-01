// Credit calculation logic — shared between calculator and display components

export const BIS_BASELINE = 135; // liters per day per person
/** Villager water rewards: each full 100 L saved counts as one block; ₹1 per block (gross) before GramCredit fee. */
export const LITERS_PER_WATER_BLOCK = 100;
/** ₹1 per 100 L of water saved (gross pool per block, before 70% villager share). */
export const WATER_VILLAGER_INR_PER_100L = 15;
/** @deprecated use LITERS_PER_WATER_BLOCK */
export const LITERS_PER_WATER_CREDIT = LITERS_PER_WATER_BLOCK;

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

/**
 * Household water conservation estimate for villagers: ₹{@link WATER_VILLAGER_INR_PER_100L} per 100 L saved (gross), 70% to household.
 * (Corporate marketplace bundles use separate listing prices — see marketplace.)
 */
export function calculateWater(householdSize: number, currentUsage: number, months: number) {
  const dailyConservationPerPerson = BIS_BASELINE - currentUsage;
  const dailyHouseholdConservation = dailyConservationPerPerson * householdSize;
  const monthlyConservation = dailyHouseholdConservation * 30;
  const dailyWaterBlocks = Math.floor(dailyHouseholdConservation / LITERS_PER_WATER_BLOCK);
  const monthlyWaterBlocks = Math.floor(monthlyConservation / LITERS_PER_WATER_BLOCK);
  const monthlyGross = monthlyWaterBlocks * WATER_VILLAGER_INR_PER_100L;
  const villagerShare = monthlyGross * 0.70;

  const monthlyBreakdown = Array.from({ length: months }, (_, i) => ({
    month: `Month ${i + 1}`,
    gross: monthlyGross,
    payout: villagerShare,
    credits: monthlyWaterBlocks,
  }));

  return {
    dailyConservationPerPerson,
    dailyHouseholdConservation,
    /** Full 100 L blocks saved per day (floor). */
    dailyWaterCredits: dailyWaterBlocks,
    monthlyConservation,
    /** Full 100 L blocks saved per month — same as "water credits" for villagers. */
    monthlyCredits: monthlyWaterBlocks,
    monthlyGross,
    villagerShare,
    totalCredits: monthlyWaterBlocks * months,
    totalPayout: villagerShare * months,
    monthlyBreakdown,
  };
}

/** Villager payout (70%) from IoT-measured litres saved in a period. */
export function waterVillagerPayoutFromLitresSaved(liters: number): number {
  const blocks = Math.floor(liters / LITERS_PER_WATER_BLOCK);
  return blocks * WATER_VILLAGER_INR_PER_100L * 0.7;
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
