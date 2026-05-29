'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const METAL = { metalness: 0.93, roughness: 0.07, color: '#D2D2D2' } as const
const BRIGHT = { metalness: 1.0, roughness: 0.0, color: '#EFEFEF' } as const
const GOLD_MAT = { metalness: 0.88, roughness: 0.12, color: '#C9A84C' } as const

function ScissorsArm() {
  return (
    <group>
      {/* Blade — tapered cylinder */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.009, 0.033, 1.6, 8]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Cutting edge highlight */}
      <mesh position={[0.02, 0.8, 0]}>
        <boxGeometry args={[0.013, 1.6, 0.007]} />
        <meshStandardMaterial {...BRIGHT} />
      </mesh>
      {/* Lower arm */}
      <mesh position={[0, -0.27, 0]}>
        <cylinderGeometry args={[0.022, 0.028, 0.54, 8]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      {/* Handle ring */}
      <mesh position={[0, -0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.034, 12, 48]} />
        <meshStandardMaterial metalness={0.84} roughness={0.16} color="#B4B4B4" />
      </mesh>
    </group>
  )
}

export default function ScissorsMesh() {
  const groupRef = useRef<THREE.Group | null>(null)
  const arm1Ref = useRef<THREE.Group | null>(null)
  const arm2Ref = useRef<THREE.Group | null>(null)
  const currentRotY = useRef(0)

  useFrame((state) => {
    if (!groupRef.current || !arm1Ref.current || !arm2Ref.current) return
    const t = state.clock.elapsedTime

    // Scissors arm cut animation
    const angle = 0.27 + Math.sin(t * 1.05) * 0.22
    arm1Ref.current.rotation.z = angle
    arm2Ref.current.rotation.z = -angle

    // Y rotation driven by page scroll — smooth lerp towards scroll position
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
    const targetRotY = scrollY * 0.005
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetRotY, 0.07)
    groupRef.current.rotation.y = currentRotY.current

    // Gentle floating
    groupRef.current.position.y = Math.sin(t * 0.72) * 0.14
  })

  return (
    <group ref={groupRef} scale={1.6}>
      {/* Front arm */}
      <group ref={arm1Ref} position={[0, 0, 0.04]}>
        <ScissorsArm />
      </group>
      {/* Back arm */}
      <group ref={arm2Ref} position={[0, 0, -0.04]}>
        <ScissorsArm />
      </group>
      {/* Pivot screw body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.1, 16]} />
        <meshStandardMaterial {...GOLD_MAT} />
      </mesh>
      {/* Screw rim */}
      <mesh>
        <torusGeometry args={[0.052, 0.013, 8, 16]} />
        <meshStandardMaterial {...GOLD_MAT} />
      </mesh>
    </group>
  )
}
