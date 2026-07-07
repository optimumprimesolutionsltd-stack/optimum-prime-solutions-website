import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import ErrorBoundary from './components/ErrorBoundary';
import { OfflineBanner } from './components/OfflineBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';

// Existing pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import ProductsPage from './pages/ProductsPage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';

// Phase 0 — Parent landing pages
import TallyPrimePage from './pages/TallyPrimePage';
import IndustriesPage from './pages/IndustriesPage';
import KnowledgeHubPage from './pages/KnowledgeHubPage';
import PricingPage from './pages/PricingPage';
import ComingSoonPage from './pages/ComingSoonPage';
import WebinarPage from './pages/WebinarPage';

// Phase 2 — Service pages
import ImplementationPage from './pages/services/ImplementationPage';
import LicensingPage from './pages/services/LicensingPage';
import CloudHostingPage from './pages/services/CloudHostingPage';
import TrainingPage from './pages/services/TrainingPage';
import SupportPage from './pages/services/SupportPage';
import CustomizationPage from './pages/services/CustomizationPage';
import DataMigrationPage from './pages/services/DataMigrationPage';
import ConsultingPage from './pages/services/ConsultingPage';

// Phase 2 — Industry pages
import ManufacturingPage from './pages/industries/ManufacturingPage';
import DistributionPage from './pages/industries/DistributionPage';
import RetailPage from './pages/industries/RetailPage';
import ConstructionPage from './pages/industries/ConstructionPage';
import HardwarePage from './pages/industries/HardwarePage';
import NGOPage from './pages/industries/NGOPage';
import SchoolsPage from './pages/industries/SchoolsPage';
import SACCOPage from './pages/industries/SACCOPage';

import { fbLogin, fbLogout, fbOnAuthStateChanged, fbAuth } from './firebase/config';
import type { User } from 'firebase/auth';
import { signInAnonymously } from 'firebase/auth';

function SiteRoutes() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        <Routes>
          {/* ── Core pages ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ── Legacy URLs preserved ── */}
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/products" element={<ProductsPage />} />

          {/* ── TallyPrime Solutions ── */}
          <Route path="/tallyprime" element={<TallyPrimePage />} />
          <Route path="/tallyprime/implementation" element={<ImplementationPage />} />
          <Route path="/tallyprime/licensing" element={<LicensingPage />} />
          <Route path="/tallyprime/cloud-hosting" element={<CloudHostingPage />} />
          <Route path="/tallyprime/training" element={<TrainingPage />} />
          <Route path="/tallyprime/support" element={<SupportPage />} />
          <Route path="/tallyprime/customization" element={<CustomizationPage />} />
          <Route path="/tallyprime/data-migration" element={<DataMigrationPage />} />
          <Route path="/tallyprime/consulting" element={<ConsultingPage />} />

          {/* ── Industries ── */}
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/industries/manufacturing" element={<ManufacturingPage />} />
          <Route path="/industries/distribution" element={<DistributionPage />} />
          <Route path="/industries/retail" element={<RetailPage />} />
          <Route path="/industries/construction" element={<ConstructionPage />} />
          <Route path="/industries/hardware" element={<HardwarePage />} />
          <Route path="/industries/ngo" element={<NGOPage />} />
          <Route path="/industries/ngos" element={<NGOPage />} />
          <Route path="/industries/schools" element={<SchoolsPage />} />
          <Route path="/industries/sacco" element={<SACCOPage />} />
          <Route path="/industries/saccos" element={<SACCOPage />} />

          {/* ── Knowledge Hub ── */}
          <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
          <Route path="/knowledge-hub/guides" element={<ComingSoonPage />} />
          <Route path="/knowledge-hub/downloads" element={<ComingSoonPage />} />
          <Route path="/knowledge-hub/case-studies" element={<ComingSoonPage />} />
          <Route path="/knowledge-hub/videos" element={<ComingSoonPage />} />
          <Route path="/webinar" element={<WebinarPage />} />
          <Route path="/knowledge-hub/webinars" element={<ComingSoonPage />} />
          <Route path="/knowledge-hub/templates" element={<ComingSoonPage />} />

          {/* ── Pricing ── */}
          <Route path="/pricing" element={<PricingPage />} />

          {/* ── Why Choose Us ── */}
          <Route path="/why-choose-us" element={<ComingSoonPage />} />

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAuthReady(true);
    }, 2000);

    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = fbOnAuthStateChanged((currentUser) => {
        clearTimeout(timeout);
        setUser(currentUser);
        setAuthReady(true);
      });
      if (!unsubscribe || unsubscribe.toString() === '() => {}') {
        clearTimeout(timeout);
        setAuthReady(true);
      }
    } catch {
      clearTimeout(timeout);
      setAuthReady(true);
    }

    return () => {
      clearTimeout(timeout);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user === null) {
      try {
        const authInstance = fbAuth();
        signInAnonymously(authInstance).catch(() => {});
      } catch {
        // Firebase auth not available, continue without it
      }
    }
  }, [user]);

  const isAuthenticated = useMemo(
    () => Boolean(user && !user.isAnonymous),
    [user]
  );

  const handleLogin = async (email: string, password: string) => {
    await fbLogin(email, password);
    navigate('/admin/dashboard');
  };

  const handleLogout = async () => {
    await fbLogout();
    navigate('/');
  };

  return (
    <ErrorBoundary>
      <SiteProvider>
        <Routes>
          <Route path="/admin" element={<AdminLogin onLogin={handleLogin} />} />
          <Route
            path="/admin/*"
            element={
              isAuthenticated ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/admin" replace />
            }
          />
          <Route path="/*" element={<SiteRoutes />} />
        </Routes>
        <OfflineBanner />
      </SiteProvider>
    </ErrorBoundary>
  );
}

export default App;
