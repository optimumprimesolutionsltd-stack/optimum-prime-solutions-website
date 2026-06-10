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
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import ProductsPage from './pages/ProductsPage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import { fbLogin, fbLogout, fbOnAuthStateChanged, fbAuth } from './firebase/config';
import type { User } from 'firebase/auth';
import { signInAnonymously } from 'firebase/auth';

function SiteRoutes() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-[72px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
    // Timeout fallback: if Firebase auth takes too long or is unavailable, proceed anyway
    // Use a very short timeout so regular visitors never see a loading screen
    const timeout = setTimeout(() => {
      setAuthReady(true);
    }, 200);

    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = fbOnAuthStateChanged((currentUser) => {
        clearTimeout(timeout);
        setUser(currentUser);
        setAuthReady(true);
      });
      // If fbOnAuthStateChanged returned a no-op (Firebase not ready), set ready immediately
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
        signInAnonymously(authInstance).catch(() => {
          // If anon sign-in fails, site may still work with public DB access.
        });
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

  if (!authReady) {
    // Show a blank screen instead of "Checking admin access" so visitors
    // never see an admin-related message while Firebase initialises.
    return <div className="min-h-screen bg-slate-50" />;
  }

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
