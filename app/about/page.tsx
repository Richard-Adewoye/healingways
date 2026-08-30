import Navbar from '../components/Navbar';
import AboutHero from './_components/AboutHero';
import AboutStory from './_components/AboutStory';
import AboutMissionVision from './_components/AboutMissionVision';
import AboutCoreValues from './_components/AboutCoreValues';
import AboutApproach from './_components/AboutApproach';
import AboutJourneyCTA from './_components/AboutJourneyCTA';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <AboutHero />
      <AboutStory />
      <AboutMissionVision />
      <AboutCoreValues />
      <AboutApproach />
      <AboutJourneyCTA />
      <Footer />
    </main>
  );
}