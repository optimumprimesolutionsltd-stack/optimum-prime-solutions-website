import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

type View = 'site' | 'login' | 'admin';

function Inner() {
  const [view, setView] = useState<View>('site');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (view === 'site') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, view]);

  useEffect(() => {
    const check = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('admin')) {
        const isAuthenticated = sessionStorage.getItem('ops_admin') === '1' || localStorage.getItem('ops_admin') === '1';
        setView(isAuthenticated ? 'admin' : 'login');
      } else {
        setView('site');
      }
    };

    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  if (view === 'login')
    return (
      <AdminLogin
        onLogin={() => {
          sessionStorage.setItem('ops_admin', '1');
          localStorage.setItem('ops_admin', '1');
          setView('admin');
        }}
      />
    );

  if (view === 'admin')
    return (
      <AdminLayout
        onLogout={() => {
          sessionStorage.removeItem('ops_admin');
          localStorage.removeItem('ops_admin');
          window.location.hash = '';
          setView('site');
        }}
      />
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
      <StickyDownloadBar />
      <Navbar />
      <main className="flex-grow pt-18">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SiteProvider>
        <Inner />
        <OfflineBanner />
      </SiteProvider>
    </ErrorBoundary>
  );
}
