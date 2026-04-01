import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { mockCurrentUser, mockCorporateUser } from '@/lib/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: UserRole; phone?: string; companyName?: string; gstin?: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));

    let user: User;
    if (email.includes('admin')) {
      user = { id: 'admin1', name: 'Admin', email, role: 'admin', phone: null, created_at: '2025-01-01' };
    } else if (email.includes('corp')) {
      user = mockCorporateUser;
    } else {
      user = mockCurrentUser;
    }
    set({ user, isAuthenticated: true, isLoading: false });
  },

  register: async (data) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 800));
    const user: User = {
      id: 'new-user',
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone || null,
      created_at: new Date().toISOString(),
      ...(data.role === 'user' ? {
        villager_profile: {
          village_id: '',
          household_size: 1,
          has_panel: false,
          panel_capacity_kw: 0,
          panel_installed_date: null,
          bank_account_linked: false,
          upi_id: null,
          total_credits_earned: 0,
          total_payout_received: 0,
        }
      } : {}),
      ...(data.role === 'corporate' ? {
        corporate_profile: {
          company_name: data.companyName || '',
          gstin: data.gstin || '',
          brsr_reporting: false,
          total_credits_acquired: 0,
          total_spent: 0,
        }
      } : {}),
    };
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => set({ user: null, isAuthenticated: false }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
