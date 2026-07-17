import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import ErrorBoundary from './components/ErrorBoundary';
import { OfflineBanner } from './components/OfflineBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import MobileStickyCTA from './components/MobileStickyCTA';
import { fbLogin, fbLogout, fbOnAuthStateChanged, fbAuth } from './firebase/config';
import type { User } from 'firebase/auth';
import { signInAnonymously } from 'firebase/auth';

// ── Critical: loaded eagerly (homepage only) ────────────────────────────────
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ComingSoonPage from './pages/ComingSoonPage';
// ── Admin panel — lazy loaded (only downloads when /admin is visited) ──────────
const AdminLogin  = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));

// ── Core pages — lazy loaded ───────────────────────────────────────────────
const AboutPage         = lazy(() => import('./pages/AboutPage'));
const FeaturesPage      = lazy(() => import('./pages/FeaturesPage'));
const ProductsPage      = lazy(() => import('./pages/ProductsPage'));
const TestimonialsPage  = lazy(() => import('./pages/TestimonialsPage'));
const BlogPage          = lazy(() => import('./pages/BlogPage'));
const BlogPostPage      = lazy(() => import('./pages/BlogPostPage'));
const FAQPage           = lazy(() => import('./pages/FAQPage'));
const ContactPage       = lazy(() => import('./pages/ContactPage'));
const PricingPage       = lazy(() => import('./pages/PricingPage'));
const WebinarPage       = lazy(() => import('./pages/WebinarPage'));
const WorkshopPage      = lazy(() => import('./pages/WorkshopPage'));
const WorkshopAttendeesPage = lazy(() => import('./pages/WorkshopAttendeesPage'));
const BizAnalystPage    = lazy(() => import('./pages/BizAnalystPage'));
const KnowledgeHubPage  = lazy(() => import('./pages/KnowledgeHubPage'));
const VideoTutorialsPage = lazy(() => import('./pages/VideoTutorialsPage'));
const IndustriesPage    = lazy(() => import('./pages/IndustriesPage'));

// ── TallyPrime pages — lazy loaded ────────────────────────────────────────
const TallyPrimePage      = lazy(() => import('./pages/TallyPrimePage'));
const TallyPrimeKenyaPage = lazy(() => import('./pages/TallyPrimeKenyaPage'));

// ── Service pages — lazy loaded ───────────────────────────────────────────
const ImplementationPage  = lazy(() => import('./pages/services/ImplementationPage'));
const LicensingPage       = lazy(() => import('./pages/services/LicensingPage'));
const CloudHostingPage    = lazy(() => import('./pages/services/CloudHostingPage'));
const TrainingPage        = lazy(() => import('./pages/services/TrainingPage'));
const SupportPage         = lazy(() => import('./pages/services/SupportPage'));
const CustomizationPage   = lazy(() => import('./pages/services/CustomizationPage'));
const DataMigrationPage   = lazy(() => import('./pages/services/DataMigrationPage'));
const ConsultingPage      = lazy(() => import('./pages/services/ConsultingPage'));
const PrivacyPolicyPage   = lazy(() => import('./pages/PrivacyPolicyPage'));

// ── Industry pages — lazy loaded ──────────────────────────────────────────
const ManufacturingPage = lazy(() => import('./pages/industries/ManufacturingPage'));
const DistributionPage  = lazy(() => import('./pages/industries/DistributionPage'));
const RetailPage        = lazy(() => import('./pages/industries/RetailPage'));
const ConstructionPage  = lazy(() => import('./pages/industries/ConstructionPage'));
const HardwarePage      = lazy(() => import('./pages/industries/HardwarePage'));
const NGOPage           = lazy(() => import('./pages/industries/NGOPage'));
const SchoolsPage       = lazy(() => import('./pages/industries/SchoolsPage'));
const SACCOPage         = lazy(() => import('./pages/industries/SACCOPage'));

// ── Page loading fallback ─────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}

function SiteRoutes() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col pb-16 sm:pb-0">
      <Navbar />
      <main className="flex-grow pt-[72px]" id="main-content">
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/tally-prime-kenya" element={<TallyPrimeKenyaPage />} />
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
            {/* ── Industry short URL aliases ── */}
            <Route path="/manufacturing" element={<Navigate to="/industries/manufacturing" replace />} />
            <Route path="/distribution" element={<Navigate to="/industries/distribution" replace />} />
            <Route path="/retail" element={<Navigate to="/industries/retail" replace />} />
            <Route path="/construction" element={<Navigate to="/industries/construction" replace />} />
            <Route path="/hardware" element={<Navigate to="/industries/hardware" replace />} />
            <Route path="/ngo" element={<Navigate to="/industries/ngo" replace />} />
            <Route path="/schools" element={<Navigate to="/industries/schools" replace />} />
            <Route path="/sacco" element={<Navigate to="/industries/sacco" replace />} />

            {/* ── Knowledge Hub ── */}
            <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
            <Route path="/knowledge-hub/guides" element={<ComingSoonPage />} />
            <Route path="/knowledge-hub/case-studies" element={<ComingSoonPage />} />
            <Route path="/knowledge-hub/videos" element={<VideoTutorialsPage />} />
            <Route path="/webinar" element={<WebinarPage />} />
            <Route path="/workshop-rsvp" element={<WorkshopPage />} />
            <Route path="/knowledge-hub/webinars" element={<ComingSoonPage />} />

            {/* ── Biz Analyst ── */}
            <Route path="/biz-analyst" element={<BizAnalystPage />} />

            {/* ── Pricing ── */}
            <Route path="/pricing" element={<PricingPage />} />

            {/* ── Why Choose Us ── */}
            <Route path="/why-choose-us" element={<ComingSoonPage />} />

            {/* ── Legal ── */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

            {/* ── Catch-all (404) ── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Chatbot />
      <MobileStickyCTA />
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
          <Route path="/workshop-attendees" element={<Suspense fallback={<PageLoader />}><WorkshopAttendeesPage /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminLogin onLogin={handleLogin} /></Suspense>} />
          <Route
            path="/admin/*"
            element={
              isAuthenticated
                ? <Suspense fallback={<PageLoader />}><AdminLayout onLogout={handleLogout} /></Suspense>
                : <Navigate to="/admin" replace />
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
