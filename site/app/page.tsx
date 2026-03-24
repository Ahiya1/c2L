import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeContent } from './components/HomeContent';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen main-with-header">
        <HomeContent />
      </main>
      <Footer />
    </>
  );
}
