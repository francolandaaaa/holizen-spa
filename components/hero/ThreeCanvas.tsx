'use client'

import { Canvas } from '@react-three/fiber'
import { Fog } from 'three'
import LotusFlower from './LotusFlower'
import CameraController from './CameraController'

function AmbientParticles() {
  return null // kept as extension point
}

export default function ThreeCanvas() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.15, 5], fov: 44 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.8]}
        onCreated={({ scene }) => {
          scene.fog = new Fog('#0D0A06', 9, 28)
        }}
      >
        {/* Warm spa lighting — no cold blues */}
        <ambientLight intensity={0.70} color="#FFF3E0" />

        {/* Key light — warm golden */}
        <directionalLight position={[3, 6, 4]}  intensity={3.8} color="#FFE8C0" />

        {/* Fill light — soft rose */}
        <directionalLight position={[-4, 3, 2]} intensity={1.8} color="#FFD4C0" />

        {/* Back rim light — warm amber */}
        <directionalLight position={[0, -3, -4]} intensity={1.2} color="#FF9C60" />

        {/* Champagne accent point */}
        <pointLight position={[-3, 2, -2]} intensity={10} color="#C9A84C" />

        {/* Soft upward fill — pearl */}
        <pointLight position={[0, -1, 2]} intensity={5} color="#FFF0E8" />

        {/* Top spot for stamens glow */}
        <spotLight
          position={[0, 8, 1]}
          intensity={12}
          color="#FFE4A0"
          angle={0.30}
          penumbra={0.8}
        />

        <AmbientParticles />
        <CameraController />
        <LotusFlower />
      </Canvas>
    </div>
  )
}
