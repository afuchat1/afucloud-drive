import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedAppRoute from "@/components/ProtectedAppRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ApiPage from "./pages/ApiPage";
import AdminPage from "./pages/AdminPage";
import PublicFile from "./pages/PublicFile";
import NotFound from "./pages/NotFound";
import FileDetailPage from "./pages/FileDetailPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/app" element={<ProtectedAppRoute><Dashboard /></ProtectedAppRoute>} />
            <Route path="/app/file/:fileId" element={<ProtectedAppRoute><FileDetailPage /></ProtectedAppRoute>} />
            <Route path="/app/profile" element={<ProtectedAppRoute><ProfilePage /></ProtectedAppRoute>} />
            <Route path="/app/settings" element={<ProtectedAppRoute><SettingsPage /></ProtectedAppRoute>} />
            <Route path="/app/api" element={<ProtectedAppRoute><ApiPage /></ProtectedAppRoute>} />
            <Route path="/app/admin" element={<ProtectedAppRoute><AdminPage /></ProtectedAppRoute>} />
            <Route path="/f/:fileId" element={<PublicFile />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
