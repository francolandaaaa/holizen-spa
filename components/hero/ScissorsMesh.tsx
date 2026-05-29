'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BLADE = { metalness: 0.95, roughness: 0.05, color: '#E4E4E4' } as const
const EDGE  = { metalness: 1.00, roughness: 0.00, color: '#FFFFFF' } as const
const SHANK = { metalness: 0.91, roughness: 0.09, color: '#D2D2D2' } as const
const RED   = { metalness: 0.88, roughness: 0.10, color: '#C41800' } as const
const GOLD  = { metalness: 0.90, roughness: 0.10, color: '#C9A84C' } as const

/** Lámina plana y ancha — escala X:2.6 / Z:0.28 */
function Blade() {
  return (
    <group>
      <mesh position={[0, 0.70, 0]} scale={[2.6, 1, 0.28]}>
        <cylinderGeometry args={[0.008, 0.042, 1.40, 8]} />
        <meshStandardMaterial {...BLADE} emissive="#999999" emissiveIntensity={0.08} />
      </mesh>
      {/* Filo brillante */}
      <mesh position={[0.113, 0.70, 0]}>
        <boxGeometry args={[0.012, 1.40, 0.012]} />
        <meshStandardMaterial {...EDGE} emissive="#BBBBBB" emissiveIntensity={0.15} />
      </mesh>
    </group>
  )
}

/**
 * Brazo del dedo (recto).
 *
 * Shank: centro (0, -0.22), altura 0.46 → fondo en y = -0.45
 * Anillo: centro y = -0.45 - R(0.128) = -0.578
 *   → borde superior del anillo = -0.578 + 0.128 = -0.450 ← toca exacto el shank
 *
 * Sin rotación en el torus → yace en plano XY, agujero mira hacia la cámara (Z).
 * Así los dedos entran de frente, igual que tijeras reales.
 */
function FingerArm() {
  return (
    <group>
      <Blade />
      {/* Shank */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.021, 0.026, 0.46, 10]} />
        <meshStandardMaterial {...SHANK} />
      </mesh>
      {/* Tope rojo (finger rest) */}
      <mesh position={[0.042, -0.10, 0]}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshStandardMaterial {...RED} />
      </mesh>
      {/* Anillo del dedo — sin rotación, agujero hacia cámara */}
      <mesh position={[0, -0.578, 0]}>
        <torusGeometry args={[0.128, 0.025, 16, 52]} />
        <meshStandardMaterial {...RED} emissive="#440000" emissiveIntensity={0.15} />
      </mesh>
    </group>
  )
}

/**
 * Brazo del pulgar (ergo offset).
 *
 * Shank: centro (0.038, -0.24), rot z=-0.11, altura 0.48
 *   → fondo aprox. (0.064, -0.479)
 * Anillo: centro (0.09, -0.62)
 *   → borde superior = -0.62 + 0.138 = -0.482 ≈ -0.479 ← conecta con shank
 *
 * Sin rotación → agujero hacia cámara, igual que el brazo del dedo.
 */
function ThumbArm() {
  return (
    <group>
      <Blade />
      {/* Shank con offset ergonómico */}
      <mesh position={[0.038, -0.24, 0]} rotation={[0, 0, -0.11]}>
        <cylinderGeometry args={[0.019, 0.025, 0.48, 10]} />
        <meshStandardMaterial {...SHANK} />
      </mesh>
      {/* Anillo exterior del pulgar — sin rotación, agujero hacia cámara */}
      <mesh position={[0.09, -0.62, 0]}>
        <torusGeometry args={[0.138, 0.025, 16, 52]} />
        <meshStandardMaterial {...RED} emissive="#440000" emissiveIntensity={0.15} />
      </mesh>
      {/* Aro interior 360° swivel */}
      <mesh position={[0.09, -0.62, 0]}>
        <torusGeometry args={[0.110, 0.010, 10, 52]} />
        <meshStandardMaterial
          metalness={1.0}
          roughness={0.0}
          color="#EE2200"
          emissive="#550000"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  )
}

export default function ScissorsMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const arm1Ref  = useRef<THREE.Group>(null)
  const arm2Ref  = useRef<THREE.Group>(null)
  const rotYRef  = useRef(0)

  useFrame((state) => {
    if (!groupRef.current || !arm1Ref.current || !arm2Ref.current) return
    const t      = state.clock.elapsedTime
    const scroll = typeof window !== 'undefined' ? window.scrollY : 0

    // Apertura y cierre
    const angle = 0.26 + Math.sin(t * 1.05) * 0.22
    arm1Ref.current.rotation.z =  angle
    arm2Ref.current.rotation.z = -angle

    // Rotación Y suave con scroll
    rotYRef.current = THREE.MathUtils.lerp(rotYRef.current, scroll * 0.005, 0.07)
    groupRef.current.rotation.y = rotYRef.current

    // Siempre centradas, flotación suave
    groupRef.current.position.x = 0
    groupRef.current.position.y = Math.sin(t * 0.70) * 0.10
  })

  return (
    <group ref={groupRef} scale={1.45}>
      {/* Brazo delantero — dedo */}
      <group ref={arm1Ref} position={[0, 0, 0.06]}>
        <FingerArm />
      </group>
      {/* Brazo trasero — pulgar ergo */}
      <group ref={arm2Ref} position={[0, 0, -0.06]}>
        <ThumbArm />
      </group>

      {/* Pivote dorado */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.050, 0.050, 0.14, 16]} />
        <meshStandardMaterial {...GOLD} emissive="#443300" emissiveIntensity={0.12} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.050, 0.012, 8, 16]} />
        <meshStandardMaterial metalness={1.0} roughness={0.0} color="#D4AA50" emissive="#553300" emissiveIntensity={0.15} />
      </mesh>
      {/* Ranura tornillo */}
      <mesh position={[0, 0, 0.078]}>
        <boxGeometry args={[0.060, 0.008, 0.005]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} color="#A8863A" />
      </mesh>
    </group>
  )
}
