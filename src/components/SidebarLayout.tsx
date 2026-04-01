import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, BarChart3, User, LogOut, ChevronLeft, ChevronRight, BookOpen, Building2, Users, Receipt, Settings, ShoppingCart, History } from 'lucide-react';

interface SidebarLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  let navItems: NavItem[] = [];

  if (user.role === 'user') {
    navItems = [
      { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
      { label: 'My Readings', path: '/dashboard/readings', icon: <BarChart3 size={18} /> },
      { label: 'Earnings', path: '/dashboard/earnings', icon: <BookOpen size={18} /> },
      { label: 'Profile', path: '/dashboard/profile', icon: <User size={18} /> },
    ];
  } else if (user.role === 'corporate') {
    navItems = [
      { label: 'Marketplace', path: '/marketplace', icon: <ShoppingCart size={18} /> },
      { label: 'Dashboard', path: '/corporate/dashboard', icon: <LayoutDashboard size={18} /> },
      { label: 'Purchases', path: '/corporate/purchases', icon: <History size={18} /> },
      { label: 'Profile', path: '/corporate/profile', icon: <User size={18} /> },
    ];
  } else if (user.role === 'admin') {
    navItems = [
      { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} /> },
      { label: 'Villages', path: '/admin/villages', icon: <Building2 size={18} /> },
      { label: 'Users', path: '/admin/users', icon: <Users size={18} /> },
      { label: 'Corporates', path: '/admin/corporates', icon: <Building2 size={18} /> },
      { label: 'Transactions', path: '/admin/transactions', icon: <Receipt size={18} /> },
      { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
    ];
  }

  const subtitle = user.role === 'user' ? user.villager_profile?.village_name : user.role === 'corporate' ? user.corporate_profile?.company_name : 'Administrator';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'} shrink-0`}>
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-bold shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs opacity-70 truncate">{subtitle}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-3">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${active ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'}`}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
