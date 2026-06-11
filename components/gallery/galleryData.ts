export interface GalleryImage {
  id: number
  src: string
  alt: string
  category: string
}

export const galleryImages: GalleryImage[] = [
  { id: 1,  src: '/gallery/masaje-relajante.jpg',    alt: 'Masaje relajante con aceites esenciales',     category: 'Masajes'  },
  { id: 2,  src: '/gallery/masaje-piedras.jpg',       alt: 'Masaje con piedras calientes basálticas',     category: 'Masajes'  },
  { id: 3,  src: '/gallery/facial-hidratante.jpg',    alt: 'Facial de hidratación profunda',              category: 'Faciales' },
  { id: 4,  src: '/gallery/facial-rejuvenecedor.jpg', alt: 'Tratamiento facial rejuvenecedor',            category: 'Faciales' },
  { id: 5,  src: '/gallery/ritual-luna.jpg',          alt: 'Ritual Luna — experiencia holística',         category: 'Rituales' },
  { id: 6,  src: '/gallery/ritual-equilibrio.jpg',    alt: 'Ritual Equilibrio — armonía total',           category: 'Rituales' },
  { id: 7,  src: '/gallery/pareja-spa.jpg',           alt: 'Experiencia privada en pareja',               category: 'Wellness' },
  { id: 8,  src: '/gallery/meditacion.jpg',           alt: 'Sesión de meditación guiada',                 category: 'Wellness' },
  { id: 9,  src: '/gallery/aromaterapia.jpg',         alt: 'Aromaterapia con aceites premium',            category: 'Rituales' },
]
