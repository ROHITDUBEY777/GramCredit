export type UserRole = 'user' | 'corporate' | 'admin';
export type VillageStatus = 'pipeline' | 'onboarding' | 'active';
export type CreditType = 'solar' | 'water' | 'combined';
export type ListingStatus = 'available' | 'partial' | 'sold_out';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type ReadingType = 'solar' | 'water';

export interface VillagerProfile {
  village_id: string;
  village_name?: string;
  household_size: number;
  has_panel: boolean;
  panel_capacity_kw: number;
  panel_installed_date: string | null;
  bank_account_linked: boolean;
  upi_id: string | null;
  /** Combined solar + water credits (lifetime). */
  total_credits_earned: number;
  total_payout_received: number;
  /** Lifetime solar credits (10 kWh = 1 credit). */
  solar_credits_earned?: number;
  /** Lifetime water credits (1 credit = 100 L saved; villager earns ₹1/block gross before fee). */
  water_credits_earned?: number;
  /** Total litres of water conserved (IoT-measured), lifetime. */
  water_liters_saved_total?: number;
}

export interface CorporateProfile {
  company_name: string;
  gstin: string;
  brsr_reporting: boolean;
  total_credits_acquired: number;
  total_spent: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  created_at: string;
  villager_profile?: VillagerProfile;
  corporate_profile?: CorporateProfile;
}

export interface Village {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  total_households: number;
  enrolled_households: number;
  status: VillageStatus;
  has_water_stress: boolean;
  bis_baseline_liters: number;
  target_liters: number;
  water_credit_price: number;
  total_solar_capacity_kw: number;
  avg_panel_capacity_kw: number;
  solar_credit_price: number;
  daily_sunlight_hours: number;
  total_credits_generated: number;
  total_credits_sold: number;
  total_payout: number;
  co2_avoided_tonnes: number;
  monitor_name: string | null;
  monitor_phone: string | null;
  created_at: string;
}

export interface EnergyReading {
  id: string;
  village_id: string;
  user_id: string;
  reading_type: ReadingType;
  kwh_generated: number | null;
  panel_capacity_kw: number | null;
  sunlight_hours_benchmark: number | null;
  liters_conserved: number | null;
  credits_calculated: number;
  month: number;
  year: number;
  verified: boolean;
  submitted_at: string;
  user_name?: string;
  village_name?: string;
}

export interface CreditListing {
  id: string;
  village_id: string;
  village_name?: string;
  village_district?: string;
  village_state?: string;
  listing_type: CreditType;
  batch_code: string;
  total_credits: number;
  credits_remaining: number;
  price_per_credit: number;
  total_bundle_value: number;
  gps_verified: boolean;
  meter_certified: boolean;
  brsr_ready: boolean;
  sdg_tags: string[];
  status: ListingStatus;
  month: number;
  year: number;
  listed_at: string;
  expires_at: string;
  enrolled_households?: number;
  solar_capacity_kw?: number;
}

export interface Transaction {
  id: string;
  corporate_id: string;
  listing_id: string;
  village_id: string;
  corporate_name?: string;
  village_name?: string;
  /** Solar, water, or combined bundle. */
  credit_type?: CreditType;
  credits_purchased: number;
  price_per_credit: number;
  total_amount: number;
  gramcredit_fee: number;
  village_share: number;
  status: TransactionStatus;
  payment_method: string;
  invoice_id: string;
  brsr_document_url: string | null;
  purchased_at: string;
}

export interface DashboardStats {
  total_credits_earned: number;
  total_payout: number;
  credits_this_month: number;
  kwh_this_month: number;
}

export interface CorporateDashboardStats {
  total_credits_acquired: number;
  total_spent: number;
  villages_supported: number;
  co2_offset_tonnes: number;
}

export interface AdminOverview {
  total_villages: number;
  active_villages: number;
  onboarding_villages: number;
  pipeline_villages: number;
  total_enrolled_households: number;
  total_credits_generated: number;
  total_credits_sold: number;
  total_revenue: number;
  total_paid_to_villages: number;
}

export interface MonthlyData {
  month: string;
  credits_generated: number;
  credits_sold: number;
  revenue: number;
  payout: number;
}
