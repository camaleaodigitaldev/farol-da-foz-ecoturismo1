import { useContent } from '../lib/useContent'
import { waLink } from '../lib/wa'
import { WhatsApp } from '../components/Icons'
import { BookingProvider } from '../lib/BookingContext'
import BookingModal from '../components/site/BookingModal'
import Header from '../components/site/Header'
import Hero from '../components/site/Hero'
import Tours from '../components/site/Tours'
import About from '../components/site/About'
import Features from '../components/site/Features'
import Fleet from '../components/site/Fleet'
import Reviews from '../components/site/Reviews'
import Gallery from '../components/site/Gallery'
import BaseSection from '../components/site/BaseSection'
import FinalCta from '../components/site/FinalCta'
import Footer from '../components/site/Footer'

export default function SitePage() {
  const content = useContent()

  return (
    <BookingProvider content={content}>
      <div className="min-h-screen overflow-x-hidden">
        <Header content={content} />
        <main>
          <Hero content={content} />
          <Tours content={content} />
          <About content={content} />
          <Features content={content} />
          <Fleet content={content} />
          <Reviews content={content} />
          <Gallery content={content} />
          <BaseSection content={content} />
          <FinalCta />
        </main>
        <Footer content={content} />

        <BookingModal />

        {/* Floating WhatsApp */}
        <a
          href={waLink(content.settings.whatsapp)}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar no WhatsApp"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-wa text-white shadow-lg transition-transform hover:scale-105"
          style={{ boxShadow: '0 12px 30px -8px rgba(37,211,102,.7)' }}
        >
          <WhatsApp size={28} />
        </a>
      </div>
    </BookingProvider>
  )
}
