import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await login(email, password);
      // Redirect based on role
      if (email.includes('admin')) navigate('/admin');
      else if (email.includes('corp')) navigate('/marketplace');
      else navigate('/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="bg-card rounded-xl shadow-md border border-border p-8 w-full max-w-md">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-6">Log in to your GramCredit account</p>

          {error && <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={isLoading}
              className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="mb-2">Demo accounts:</p>
            <div className="space-y-1 text-xs font-mono">
              <p>user1@alluru.in / User@123 (Villager)</p>
              <p>infosys@corp.in / Corp@123 (Corporate)</p>
              <p>admin@gramcredit.in / Admin@123 (Admin)</p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
