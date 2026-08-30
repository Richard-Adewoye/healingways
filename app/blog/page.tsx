import Navbar from '../components/Navbar';
import BlogHero from './_components/BlogHero';
import BlogGrid from './_components/BlogGrid';
import NewsletterSubscribe from './_components/NewsletterSubscribe';
import Footer from '../components/Footer';

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <BlogHero />
      <BlogGrid />
      <NewsletterSubscribe />
      <Footer />
    </main>
  );
}