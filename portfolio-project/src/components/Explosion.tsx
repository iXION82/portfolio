import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ExplosionProps {
  position: [number, number, number];
  onComplete: () => void;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  scale: number;
  color: THREE.Color;
  life: number;
}

export default function Explosion({ position, onComplete }: ExplosionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);
  const DURATION = 1.5;

  const particles = useMemo<Particle[]>(() => {
    const count = 16 + Math.floor(Math.random() * 8);
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      const speed = 1.5 + Math.random() * 3;
      const colors = [
        new THREE.Color('#ff6b35'),
        new THREE.Color('#ff9f1c'),
        new THREE.Color('#ffcc02'),
        new THREE.Color('#888888'),
        new THREE.Color('#aaaaaa'),
        new THREE.Color('#cc5500'),
      ];
      return {
        position: new THREE.Vector3(position[0], position[1], position[2]),
        velocity: new THREE.Vector3(
          Math.cos(angle) * Math.cos(elevation) * speed,
          Math.sin(elevation) * speed,
          Math.sin(angle) * Math.cos(elevation) * speed
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        scale: 0.06 + Math.random() * 0.12,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      };
    });
  }, [position]);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    const progress = elapsedRef.current / DURATION;

    if (progress >= 1) {
      onComplete();
      return;
    }

    if (!groupRef.current) return;

    const children = groupRef.current.children;
    particles.forEach((p, i) => {
      p.velocity.y -= delta * 1.5; // gravity
      p.position.add(p.velocity.clone().multiplyScalar(delta));
      p.rotation.x += p.rotationSpeed.x * delta;
      p.rotation.y += p.rotationSpeed.y * delta;
      p.rotation.z += p.rotationSpeed.z * delta;
      p.life = 1 - progress;

      const mesh = children[i] as THREE.Mesh;
      if (mesh) {
        mesh.position.copy(p.position);
        mesh.rotation.copy(p.rotation);
        const s = p.scale * p.life;
        mesh.scale.set(s, s, s);
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = p.life;
        mat.emissiveIntensity = p.life * 2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position.toArray() as [number, number, number]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={2}
            transparent
            opacity={1}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}
