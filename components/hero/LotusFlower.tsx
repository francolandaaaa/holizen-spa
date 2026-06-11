'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Petal color per ring layer (inner → outer)
const PETAL_COLORS = ['#FFF8F3', '#FFEDE4', '#F5D4C0', '#EAB8A8', '#DFA090']

// Layer config: inner (index 0) to outer (index 4)
// delay: outer opens first (0.0), inner opens last (0.55)
const LAYERS = [
  { count: 5,  radius: 0.060, length: 0.32, width: 0.105, closedRot: -0.22, openRot: 0.88, delay: 0.55, yOff: 0.030 },
  { count: 8,  radius: 0.115, length: 0.46, width: 0.148, closedRot: -0.16, openRot: 1.13, delay: 0.40, yOff: 0.015 },
  { count: 11, radius: 0.175, length: 0.60, width: 0.188, closedRot: -0.10, openRot: 1.38, delay: 0.25, yOff: 0.000 },
  { count: 13, radius: 0.235, length: 0.75, width: 0.224, closedRot: -0.05, openRot: 1.57, delay: 0.12, yOff: -0.015 },
  { count: 8,  radius: 0.295, length: 0.90, width: 0.260, closedRot:  0.00, openRot: 1.72, delay: 0.00, yOff: -0.030 },
] as const

function smoothstep(x: number) { return x * x * (3 - 2 * x) }

function createPetalGeo(length: number, width: number): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(width * 0.42, length * 0.10, width * 0.66, length * 0.42, width * 0.14, length * 0.93)
  shape.quadraticCurveTo(0, length * 1.03, -width * 0.14, length * 0.93)
  shape.bezierCurveTo(-width * 0.66, length * 0.42, -width * 0.42, length * 0.10, 0, 0)

  const geo = new THREE.ShapeGeometry(shape, 10)

  // Add natural concave curvature along petal length
  const pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const t = Math.max(0, Math.min(y / length, 1))
    const bowZ  = Math.sin(t * Math.PI) * 0.042
    const edgeZ = -((x / (width * 0.5)) ** 2) * Math.sin(t * Math.PI) * 0.018
    pos.setZ(i, bowZ + edgeZ)
  }
  geo.computeVertexNormals()
  return geo
}

function LotusCenter() {
  return (
    <group>
      {/* Main seedpod */}
      <mesh>
        <sphereGeometry args={[0.088, 18, 14]} />
        <meshPhysicalMaterial color="#D4A840" roughness={0.42} metalness={0.18} />
      </mesh>

      {/* Inner dome highlight */}
      <mesh scale={[1, 0.5, 1]} position={[0, 0.03, 0]}>
        <sphereGeometry args={[0.058, 14, 10]} />
        <meshStandardMaterial color="#B88C38" roughness={0.65} metalness={0.05} />
      </mesh>

      {/* Stamens ring */}
      {Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2
        const r = 0.092 + (i % 3) * 0.008
        const tilt = 0.14 + (i % 4) * 0.05
        return (
          <group key={i} rotation={[0, a, 0]}>
            <group position={[0, 0, r]} rotation={[-tilt, 0, 0]}>
              <mesh position={[0, 0.044, 0]}>
                <cylinderGeometry args={[0.0022, 0.0022, 0.066, 4]} />
                <meshStandardMaterial color="#E8D868" />
              </mesh>
              <mesh position={[0, 0.082, 0]}>
                <sphereGeometry args={[0.0052, 5, 5]} />
                <meshStandardMaterial color="#F5E870" emissive="#FFD820" emissiveIntensity={0.40} />
              </mesh>
            </group>
          </group>
        )
      })}
    </group>
  )
}

interface FallingPetal {
  id: number; startTime: number; maxLife: number
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  rx: number; ry: number; rz: number
  vrx: number; vry: number; vrz: number
}

let _fid = 0

export default function LotusFlower() {
  const groupRef   = useRef<THREE.Group>(null)
  const bloomRef   = useRef(0)
  const startRef   = useRef<number | null>(null)
  const rotYRef    = useRef(0)
  const prevTRef   = useRef(0)
  const prevScrollRef = useRef(0)
  const lastDropRef   = useRef(0)
  const fallingRef = useRef<FallingPetal[]>([])

  const petalGeos = useMemo(() => LAYERS.map(l => createPetalGeo(l.length, l.width)), [])
  const petalMats = useMemo(() =>
    PETAL_COLORS.map(color => new THREE.MeshPhysicalMaterial({
      color, roughness: 0.28, metalness: 0.0,
      transmission: 0.12, thickness: 0.022,
      side: THREE.DoubleSide,
      emissive: color, emissiveIntensity: 0.035,
    })), [])

  // Tilt group refs indexed by [layerIdx][petalIdx]
  const tiltRefs = useRef<(THREE.Group | null)[][]>(LAYERS.map(l => Array(l.count).fill(null)))

  // Falling petal pool (max 8 visible at once)
  const fallingGeo = useMemo(() => createPetalGeo(0.72, 0.22), [])
  const fallingMeshRefs = useRef<(THREE.Mesh | null)[]>(Array(8).fill(null))
  const fallingMatRefs  = useRef<(THREE.MeshPhysicalMaterial | null)[]>(Array(8).fill(null))

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const delta = Math.min(t - prevTRef.current, 0.05)
    prevTRef.current = t

    // Bloom animation (0 → 1 over 4.8s)
    if (startRef.current === null) startRef.current = t
    const raw    = Math.min((t - startRef.current) / 4.8, 1)
    const bloom  = smoothstep(raw)
    bloomRef.current = bloom

    // Animate each layer's petal tilt
    LAYERS.forEach((cfg, li) => {
      const lRaw  = Math.max(0, (bloom - cfg.delay) / Math.max(1 - cfg.delay, 0.01))
      const lBloom = smoothstep(Math.min(lRaw, 1))
      const angle  = cfg.closedRot + (cfg.openRot - cfg.closedRot) * lBloom
      tiltRefs.current[li].forEach(ref => { if (ref) ref.rotation.x = angle })
    })

    // Float + scroll rotation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.38) * 0.05

      if (bloom > 0.78) {
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
        rotYRef.current = THREE.MathUtils.lerp(rotYRef.current, scrollY * 0.0022, 0.032)
        groupRef.current.rotation.y = rotYRef.current
      }
    }

    // Falling petals trigger on scroll
    if (bloom > 0.86) {
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
      const scrollDelta = Math.abs(scrollY - prevScrollRef.current)
      prevScrollRef.current = scrollY

      if (scrollDelta > 3 && t - lastDropRef.current > 2.0 && fallingRef.current.length < 6) {
        lastDropRef.current = t
        const li = 3 + Math.floor(Math.random() * 2)
        const cfg = LAYERS[li]
        const ang = Math.random() * Math.PI * 2
        fallingRef.current.push({
          id: _fid++,
          startTime: t, maxLife: 3.8 + Math.random() * 1.8,
          x: Math.sin(ang) * (cfg.radius * 3.2 + Math.random() * 0.2),
          y: 0.35 + Math.random() * 0.18,
          z: Math.cos(ang) * (cfg.radius * 3.2 + Math.random() * 0.2),
          vx: (Math.random() - 0.5) * 0.006,
          vy: -(0.004 + Math.random() * 0.004),
          vz: (Math.random() - 0.5) * 0.006,
          rx: Math.random() * Math.PI,
          ry: Math.random() * Math.PI * 2,
          rz: Math.random() * Math.PI,
          vrx: (Math.random() - 0.5) * 0.055,
          vry: (Math.random() - 0.5) * 0.030,
          vrz: (Math.random() - 0.5) * 0.055,
        })
      }

      // Prune expired petals
      fallingRef.current = fallingRef.current.filter(p => (t - p.startTime) < p.maxLife)

      // Update each falling petal's Three.js mesh imperatively
      fallingRef.current.forEach((p, i) => {
        if (i >= 8) return
        p.x += p.vx * delta * 60
        p.y += p.vy * delta * 60
        p.z += p.vz * delta * 60
        p.vy -= 0.000065 * delta * 60
        p.rx += p.vrx * delta * 60
        p.ry += p.vry * delta * 60
        p.rz += p.vrz * delta * 60

        const mesh = fallingMeshRefs.current[i]
        const mat  = fallingMatRefs.current[i]
        if (!mesh || !mat) return
        mesh.position.set(p.x, p.y, p.z)
        mesh.rotation.set(p.rx, p.ry, p.rz)
        mesh.visible = true
        const age     = t - p.startTime
        const fadeOut = Math.max(0, 1 - Math.max(0, age - p.maxLife * 0.65) / (p.maxLife * 0.35))
        mat.opacity   = fadeOut
      })

      // Hide unused pool slots
      for (let i = fallingRef.current.length; i < 8; i++) {
        const mesh = fallingMeshRefs.current[i]
        if (mesh) mesh.visible = false
      }
    }
  })

  return (
    <group ref={groupRef} scale={1.65}>
      {/* Petal rings */}
      {LAYERS.map((cfg, li) =>
        Array.from({ length: cfg.count }).map((_, pi) => {
          const angOffset = (pi / cfg.count) * Math.PI * 2 + (li * Math.PI / (cfg.count + 1))
          return (
            <group key={`${li}-${pi}`} rotation={[0, angOffset, 0]}>
              <group
                ref={r => { tiltRefs.current[li][pi] = r }}
                position={[0, cfg.yOff, cfg.radius]}
                rotation={[cfg.closedRot, 0, 0]}
              >
                <mesh geometry={petalGeos[li]} material={petalMats[li]} />
              </group>
            </group>
          )
        })
      )}

      {/* Flower center */}
      <LotusCenter />

      {/* Lily pad */}
      <mesh rotation={[-Math.PI / 2, 0.6, 0]} position={[0, -0.10, 0]}>
        <circleGeometry args={[0.82, 40]} />
        <meshPhysicalMaterial
          color="#3E6B46"
          roughness={0.80}
          metalness={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Falling petals pool (8 slots, hidden until triggered) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`fp-${i}`}
          ref={r => { fallingMeshRefs.current[i] = r }}
          geometry={fallingGeo}
          visible={false}
        >
          <meshPhysicalMaterial
            ref={r => { fallingMatRefs.current[i] = r as THREE.MeshPhysicalMaterial }}
            color="#EAB8A8"
            roughness={0.28}
            transparent
            opacity={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
