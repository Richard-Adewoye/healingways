import Navbar from '../components/Navbar';
import ContactHero from './_components/ContactHero';
import ContactQuickFAQ from './_components/ContactQuickFaq';
import ContactFormSection from './_components/ContactFormSection';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <ContactHero />
      <ContactQuickFAQ />
      <ContactFormSection />
      <Footer />
    </main>
  );
}