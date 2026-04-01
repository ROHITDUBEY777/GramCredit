import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'corporate') return '/marketplace';
    return '/dashboard';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="font-heading font-bold text-xl text-primary flex items-center gap-1">
          GramCredit <span className="text-accent">●</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="/#calculator" className="text-muted-foreground hover:text-foreground transition-colors">Calculator</a>
          {isAuthenticated && user ? (
            <>
              <Link to={getDashboardLink()} className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link>
              <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 py-4 space-y-3 text-sm font-medium">
          <a href="/#how-it-works" className="block text-muted-foreground" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="/#calculator" className="block text-muted-foreground" onClick={() => setMobileOpen(false)}>Calculator</a>
          {isAuthenticated && user ? (
            <>
              <Link to={getDashboardLink()} className="block text-muted-foreground" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block text-muted-foreground">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-muted-foreground" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="block text-primary font-semibold" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
