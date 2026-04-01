import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import Marketplace from "./pages/corporate/Marketplace";
import CorporateDashboard from "./pages/corporate/CorporateDashboard";
import PurchaseHistory from "./pages/corporate/PurchaseHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VillageManager from "./pages/admin/VillageManager";
import UserManager from "./pages/admin/UserManager";
import TransactionLog from "./pages/admin/TransactionLog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User routes */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/readings" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/earnings" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute allowedRoles={['user']}><UserProfile /></ProtectedRoute>} />

          {/* Corporate routes */}
          <Route path="/marketplace" element={<ProtectedRoute allowedRoles={['corporate']}><Marketplace /></ProtectedRoute>} />
          <Route path="/corporate/dashboard" element={<ProtectedRoute allowedRoles={['corporate']}><CorporateDashboard /></ProtectedRoute>} />
          <Route path="/corporate/purchases" element={<ProtectedRoute allowedRoles={['corporate']}><PurchaseHistory /></ProtectedRoute>} />
          <Route path="/corporate/profile" element={<ProtectedRoute allowedRoles={['corporate']}><UserProfile /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/villages" element={<ProtectedRoute allowedRoles={['admin']}><VillageManager /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManager /></ProtectedRoute>} />
          <Route path="/admin/corporates" element={<ProtectedRoute allowedRoles={['admin']}><UserManager /></ProtectedRoute>} />
          <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['admin']}><TransactionLog /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
