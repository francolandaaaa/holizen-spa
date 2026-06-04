'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Un único metal para toda la tijera ───────────────────────────────────────
const STEEL: React.ComponentProps<'meshStandardMaterial'> = {
  metalness: 0.98,
  roughness: 0.02,
  color: '#EAEAEA',
  envMapIntensity: 1,
}
const EDGE: React.ComponentProps<'meshStandardMaterial'> = {
  metalness: 1.0,
  roughness: 0.0,
  color: '#FFFFFF',
  emissive: '#DDDDDD' as unknown as THREE.Color,
  emissiveIntensity: 0.28,
}
const WINE: React.ComponentProps<'meshStandardMaterial'> = {
  metalness: 0.88,
  roughness: 0.12,
  color: '#6B1229',
  emissive: '#1A0008' as unknown as THREE.Color,
  emissiveIntensity: 0.15,
}
const GOLD: React.ComponentProps<'meshStandardMaterial'> = {
  metalness: 1.0,
  roughness: 0.0,
  color: '#D4AA50',
  emissive: '#553300' as unknown as THREE.Color,
  emissiveIntensity: 0.18,
}

// ─────────────────────────────────────────────────────────────────────────────
// ScissorsArm — un brazo completo y recto:
//   cuchilla arriba (y > 0)  →  pivote (y = 0)  →  mango abajo (y < 0)  →  aro
//
// Geometría continua: cuchilla y mango comparten exactamente el mismo radio
// en y = 0, así parecen una sola pieza de metal sin corte ni unión visible.
//
// Los aros quedan en los extremos de los brazos. Al abrirse las tijeras los
// brazos giran y los aros quedan naturalmente a los lados.
//
// Sin offset lateral: los brazos en Z distintos (+/−0.055) garantizan
// que los aros nunca se crucen físicamente.
// ─────────────────────────────────────────────────────────────────────────────
function ScissorsArm({ isThumb = false }: { isThumb?: boolean }) {
  // Radio base compartido (pivote) — blade y mango lo igualan para unión invisible
  const baseR   = 0.040
  const bladeH  = 1.38
  const handleH = 0.46
  // Mango termina en y = -handleH/2 - handleH/2 = -handleH
  const handleEndY = -handleH

  // Aro al final del mango, tocando su extremo
  const ringR  = isThumb ? 0.218 : 0.206
  const ringT  = 0.033
  // Centro del aro: handleEnd - ringR - ringT (toca el extremo del mango)
  const ringY  = handleEndY - ringR - ringT * 0.5

  return (
    <group>
      {/* ── CUCHILLA ─────────────────────────────────────────────────────── */}
      {/* Cuerpo principal: cónica plana — base coincide con y = 0 */}
      <mesh
        position={[0, bladeH / 2, 0]}
        scale={[2.15, 1, 0.17]}
      >
        <cylinderGeometry args={[0.001, baseR, bladeH, 8]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* Filo reflectante en el borde cortante */}
      <mesh position={[baseR * 2.15 * 0.92, bladeH / 2, 0]}>
        <boxGeometry args={[0.007, bladeH, 0.006]} />
        <meshStandardMaterial {...EDGE} />
      </mesh>

      {/* ── MANGO ────────────────────────────────────────────────────────── */}
      {/* Mismo material, mismo baseR en y = 0, se estrecha hacia el aro */}
      <mesh
        position={[0, -handleH / 2, 0]}
        scale={[2.15, 1, 0.17]}
      >
        {/* radiusTop = baseR (en y=0, idéntico a la base de la cuchilla) */}
        <cylinderGeometry args={[baseR, 0.018, handleH, 7]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>

      {/* ── ARO ──────────────────────────────────────────────────────────── */}
      {/* Sin rotación → agujero mira hacia la cámara, aros a los lados al abrir */}
      <mesh position={[0, ringY, 0]}>
        <torusGeometry args={[ringR, ringT, 18, 64]} />
        <meshStandardMaterial {...WINE} />
      </mesh>

      {/* ── TANG (solo brazo del dedo) ────────────────────────────────────── */}
      {!isThumb && (
        <mesh
          position={[-ringR * 0.55, ringY + ringR * 0.9, 0]}
          rotation={[0, 0, 0.62]}
        >
          <torusGeometry args={[ringR * 0.36, 0.019, 8, 26, Math.PI * 0.68]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
      )}
    </group>
  )
}

// ── Pivote — gema roja en montura dorada ─────────────────────────────────────
function Pivot() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.048, 0.048, 0.012, 20]} />
        <meshStandardMaterial metalness={0.90} roughness={0.10} color="#C9A84C" />
      </mesh>
      <mesh>
        <torusGeometry args={[0.046, 0.012, 8, 20]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
      <mesh position={[0, 0, 0.016]}>
        <sphereGeometry args={[0.030, 16, 16]} />
        <meshStandardMaterial
          color="#CC1000"
          metalness={0.65}
          roughness={0.15}
          emissive="#660000"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  )
}

// ── Componente principal — animación sin cambios ──────────────────────────────
export default function ScissorsMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const arm1Ref  = useRef<THREE.Group>(null)
  const arm2Ref  = useRef<THREE.Group>(null)
  const rotYRef  = useRef(0)

  useFrame((state) => {
    if (!groupRef.current || !arm1Ref.current || !arm2Ref.current) return
    const t      = state.clock.elapsedTime
    const scroll = typeof window !== 'undefined' ? window.scrollY : 0

    // Max 0.31 rad (≈18°) = abiertas · Min 0.05 rad (≈3°) = cerradas
    const angle = 0.18 + Math.sin(t * 0.9) * 0.13
    arm1Ref.current.rotation.z =  angle
    arm2Ref.current.rotation.z = -angle

    rotYRef.current = THREE.MathUtils.lerp(rotYRef.current, scroll * 0.005, 0.07)
    groupRef.current.rotation.y = rotYRef.current

    groupRef.current.position.x = 0
    groupRef.current.position.y = Math.sin(t * 0.70) * 0.10
  })

  return (
    <group ref={groupRef} scale={1.45}>
      {/* Brazo del dedo — frente (z +) */}
      <group ref={arm1Ref} position={[0, 0, 0.055]}>
        <ScissorsArm isThumb={false} />
      </group>
      {/* Brazo del pulgar — atrás (z −) */}
      <group ref={arm2Ref} position={[0, 0, -0.055]}>
        <ScissorsArm isThumb={true} />
      </group>
      <Pivot />
    </group>
  )
}
