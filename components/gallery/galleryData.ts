export interface GalleryImage {
  id: number
  src: string
  alt: string
  category: string
}

// To add your own images:
// 1. Place your photos inside /public/gallery/
// 2. Update the `src` field with the filename: '/gallery/mi-foto.jpg'
// 3. Update `alt` (description) and `category` (shown in the filter tabs)
export const galleryImages: GalleryImage[] = [
  { id: 1, src: '/gallery/corte-1.jpg', alt: 'Corte clásico con textura', category: 'Corte' },
  { id: 2, src: '/gallery/tinte-1.jpg', alt: 'Balayage dorado natural', category: 'Tinte' },
  { id: 3, src: '/gallery/peinado-1.jpg', alt: 'Peinado elegante para evento', category: 'Peinado' },
  { id: 4, src: '/gallery/tratamiento-1.jpg', alt: 'Tratamiento con keratina', category: 'Tratamiento' },
  { id: 5, src: '/gallery/corte-2.jpg', alt: 'Corte con degradado moderno', category: 'Corte' },
  { id: 6, src: '/gallery/tinte-2.jpg', alt: 'Mechas platinadas', category: 'Tinte' },
]
