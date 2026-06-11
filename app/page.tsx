import ThreeCanvasWrapper from '@/components/hero/ThreeCanvasWrapper'
import HeroSection from '@/components/hero/HeroSection'
import ServicesSection from '@/components/services/ServicesSection'
import GallerySection from '@/components/gallery/GallerySection'
import TestimonialsSection from '@/components/testimonials/TestimonialsSection'
import BookingSection from '@/components/booking/BookingSection'
import MapSection from '@/components/map/MapSection'
import Footer from '@/components/footer/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import IntroReveal from '@/components/IntroReveal'

// ThreeCanvasWrapper renders the 3D lotus OUTSIDE IntroReveal so it's never
// hidden by the opacity-0 mask. CSS opacity on a parent hides fixed children
// too, so the 3D canvas must live in its own stacking context.

export default function Home() {
  return (
    <>
      <ThreeCanvasWrapper />

      <IntroReveal>
        <main style={{ position: 'relative', zIndex: 1 }}>
          <HeroSection />
          <ServicesSection />
          <GallerySection />
          <TestimonialsSection />
          <BookingSection />
          <MapSection />
          <Footer />
          <WhatsAppButton />
        </main>
      </IntroReveal>
    </>
  )
}
