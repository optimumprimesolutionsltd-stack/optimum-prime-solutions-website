import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import ErrorBoundary from './components/ErrorBoundary';
import { OfflineBanner } from './components/OfflineBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import StickyDownloadBar from './components/StickyDownloadBar';
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
    <StickyDownloadBar />
      <main className="flex-grow">
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
    const unsubscribe = fbOnAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user === null) {
      const authInstance = fbAuth();
      signInAnonymously(authInstance).catch(() => {
        // If anon sign-in fails, site may still work with public DB access.
      });
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-950">
        <p className="text-sm text-slate-600">Checking admin access…</p>
      </div>
    );
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
