export interface GalleryImage {
  id: number
  src: string
  alt: string
  category: string
}

export const galleryImages: GalleryImage[] = [
  { id: 1,  src: '/gallery/masaje-aceites.jpg',        alt: 'Masaje relajante con aceites esenciales',     category: 'Masajes'  },
  { id: 2,  src: '/gallery/masaje-piedras.jpg',         alt: 'Masaje con piedras calientes basálticas',     category: 'Masajes'  },
  { id: 3,  src: '/gallery/masaje-descontracturante.jpg', alt: 'Masaje descontracturante',                  category: 'Masajes'  },
  { id: 4,  src: '/gallery/facial-hidratacion.jpg',     alt: 'Facial de hidratación profunda',              category: 'Faciales' },
  { id: 5,  src: '/gallery/ritual-barro.jpg',           alt: 'Ritual de barro — exfoliación y bienestar',   category: 'Rituales' },
  { id: 6,  src: '/gallery/ritual-pareja.png',          alt: 'Ritual de pareja — experiencia privada',      category: 'Rituales' },
]
