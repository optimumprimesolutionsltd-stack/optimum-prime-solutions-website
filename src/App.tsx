import { useState, useEffect } from 'react';
import { SiteProvider } from './context/SiteContext';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import TrustBanner from './components/TrustBanner';
import About from './components/About';
import FeatureShowcase from './components/FeatureShowcase';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import ImplementationDetail from './components/ImplementationDetail';
import Products from './components/Products';
import Industries from './components/Industries';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import WhatsAppButton from './components/WhatsAppButton';
import StickyDownloadBar from './components/StickyDownloadBar';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';

type View = 'site' | 'login' | 'admin';

function Inner() {
  const [view, setView] = useState<View>('site');

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

  if (view === 'login') return <AdminLogin onLogin={() => { sessionStorage.setItem('ops_admin', '1'); localStorage.setItem('ops_admin', '1'); setView('admin'); }} />;
  if (view === 'admin') return <AdminLayout onLogout={() => { sessionStorage.removeItem('ops_admin'); localStorage.removeItem('ops_admin'); window.location.hash = ''; setView('site'); }} />;

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <StickyDownloadBar />
      <Navbar />
      <Hero3D />
      <TrustBanner />
      <About />
      <FeatureShowcase />
      <Features />
      <HowItWorks />
      <ImplementationDetail />
      <Products />
      <Industries />
      <Testimonials />
      <Blog />
      <FAQ />
      <Contact />
      <Footer />
      <Chatbot />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <Inner />
    </SiteProvider>
  );
}
