import Navbar from '../components/Navbar';
import ServicesHero from './_components/ServicesHero';
import ServicesBannerImage from './_components/ServicesBannerImage';
import ServicesGrid from './_components/ServicesGrid';
import ServicesActivation from './_components/ServicesActivation';
import ServicesCTA from './_components/ServicesCTA';
import Footer from '../components/Footer';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ServicesHero />
      <ServicesBannerImage />
      <ServicesGrid />
      <ServicesActivation />
      <ServicesCTA />
      <Footer />
    </main>
  );
}