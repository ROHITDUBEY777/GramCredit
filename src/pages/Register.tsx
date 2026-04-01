import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import type { UserRole } from '@/types';

export default function Register() {
  const [role, setRole] = useState<UserRole>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      await register({ name, email, password, role, phone, companyName, gstin });
      if (role === 'corporate') navigate('/marketplace');
      else navigate('/dashboard');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4 py-12">
        <div className="bg-card rounded-xl shadow-md border border-border p-8 w-full max-w-md">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-sm text-muted-foreground mb-6">Join GramCredit as a villager or corporate</p>

          {error && <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button" onClick={() => setRole('user')}
                  className={`border rounded-lg py-3 text-sm font-medium transition-colors ${role === 'user' ? 'border-primary bg-primary/5 text-primary' : 'border-input text-muted-foreground'}`}
                >
                  ☀️ Villager
                </button>
                <button
                  type="button" onClick={() => setRole('corporate')}
                  className={`border rounded-lg py-3 text-sm font-medium transition-colors ${role === 'corporate' ? 'border-primary bg-primary/5 text-primary' : 'border-input text-muted-foreground'}`}
                >
                  🏢 Corporate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password *</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            {role === 'corporate' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company Name *</label>
                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                    className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">GSTIN</label>
                  <input type="text" value={gstin} onChange={e => setGstin(e.target.value)}
                    className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
