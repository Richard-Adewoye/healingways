import Navbar from '../components/Navbar';
import HospitalsHero from './_components/HospitalsHero';
import HospitalsGrid from './_components/HospitalsGrid';
import HospitalsInfoSection from './_components/HospitalsInfoSection';
import HospitalsCTA from './_components/HospitalsCTA';
import Footer from '../components/Footer';

export default function PartnerHospitalsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HospitalsHero />
      <HospitalsGrid />
      <HospitalsInfoSection />
      <HospitalsCTA />
      <Footer />
    </main>
  );
}