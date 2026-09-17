import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Importación de componentes modulares de la landing
import Navbar from '../../components/landing/Navbar';
import HeroSection from '../../components/landing/HeroSection';
import ValueProposition from '../../components/landing/ValueProposition';
import HowItWorks from '../../components/landing/HowItWorks';
import ZoningFeature from '../../components/landing/ZoningFeature';
import DashboardPreview from '../../components/landing/DashboardPreview';
import PeriodsFeature from '../../components/landing/PeriodsFeature';
import Nom035Feature from '../../components/landing/Nom035Feature';
import PrivacySection from '../../components/landing/PrivacySection';
import FeaturesGrid from '../../components/landing/FeaturesGrid';
import PricingSection from '../../components/landing/PricingSection';
import FinalCTA from '../../components/landing/FinalCTA';
import FAQSection from '../../components/landing/FAQSection';
import Footer from '../../components/landing/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoginClick = () => {
    if (user) {
      if (user.role === 'admin' || user.role === 'corporativo') navigate('/admin');
      else navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-slate-50 selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
      <Navbar onLoginClick={handleLoginClick} user={user} />
      
      <main>
        <HeroSection onDemoClick={handleLoginClick} />
        <ValueProposition />
        <HowItWorks />
        <ZoningFeature />
        <DashboardPreview />
        <PeriodsFeature />
        <Nom035Feature />
        <PrivacySection />
        <FeaturesGrid />
        <PricingSection />
        <FinalCTA onDemoClick={handleLoginClick} />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
