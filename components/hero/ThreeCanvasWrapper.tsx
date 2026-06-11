'use client'

import dynamic from 'next/dynamic'

const ThreeCanvas = dynamic(() => import('./ThreeCanvas'), {
  ssr: false,
  loading: () => null,
})

export default function ThreeCanvasWrapper() {
  return <ThreeCanvas />
}
