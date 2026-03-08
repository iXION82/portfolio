import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Explosion from './Explosion';

interface MeteoritesProps {
    shipPositionRef: React.MutableRefObject<THREE.Vector3>;
}

interface Meteorite {
    id: number;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    rotation: THREE.Euler;
    rotationSpeed: THREE.Vector3;
    scale: number;
    color: THREE.Color;
    active: boolean;
}

interface ActiveExplosion {
    id: number;
    position: [number, number, number];
}

let nextId = 0;
const COLLISION_DISTANCE = 0.5;
const BOUNDS = 12;
const METEORITE_COUNT = 8;

function createMeteorite(): Meteorite {
    const side = Math.floor(Math.random() * 4);
    let x: number, y: number;
    const speed = 0.3 + Math.random() * 0.8;

    switch (side) {
        case 0: x = -BOUNDS; y = (Math.random() - 0.5) * BOUNDS * 2; break; // left
        case 1: x = BOUNDS; y = (Math.random() - 0.5) * BOUNDS * 2; break;  // right
        case 2: x = (Math.random() - 0.5) * BOUNDS * 2; y = BOUNDS; break;  // top
        default: x = (Math.random() - 0.5) * BOUNDS * 2; y = -BOUNDS; break; // bottom
    }

    const targetX = (Math.random() - 0.5) * BOUNDS;
    const targetY = (Math.random() - 0.5) * BOUNDS;
    const dir = new THREE.Vector2(targetX - x, targetY - y).normalize();

    const colors = [
        new THREE.Color('#8d6e63'),
        new THREE.Color('#6d4c41'),
        new THREE.Color('#795548'),
        new THREE.Color('#5d4037'),
        new THREE.Color('#a1887f'),
        new THREE.Color('#4e342e'),
    ];

    return {
        id: nextId++,
        position: new THREE.Vector3(x, y, (Math.random() - 0.5) * 2),
        velocity: new THREE.Vector3(dir.x * speed, dir.y * speed, (Math.random() - 0.5) * 0.1),
        rotation: new THREE.Euler(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ),
        scale: 0.2 + Math.random() * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        active: true,
    };
}

export default function Meteorites({ shipPositionRef }: MeteoritesProps) {
    const meteoritesRef = useRef<Meteorite[]>(
        Array.from({ length: METEORITE_COUNT }, () => createMeteorite())
    );
    const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
    const [explosions, setExplosions] = useState<ActiveExplosion[]>([]);
    const [, forceRerender] = useState(0);
    const respawnTimers = useRef<Map<number, number>>(new Map());

    const handleExplosionComplete = useCallback((id: number) => {
        setExplosions((prev) => prev.filter((e) => e.id !== id));
    }, []);

    useFrame((_, delta) => {
        const meteorites = meteoritesRef.current;
        const shipPos = shipPositionRef.current;
        let needsRerender = false;

        // Update respawn timers
        respawnTimers.current.forEach((timer, index) => {
            const newTimer = timer - delta;
            if (newTimer <= 0) {
                respawnTimers.current.delete(index);
                meteorites[index] = createMeteorite();
                needsRerender = true;
            } else {
                respawnTimers.current.set(index, newTimer);
            }
        });

        meteorites.forEach((m, i) => {
            if (!m.active) return;

            // Move
            m.position.add(m.velocity.clone().multiplyScalar(delta));
            m.rotation.x += m.rotationSpeed.x * delta;
            m.rotation.y += m.rotationSpeed.y * delta;
            m.rotation.z += m.rotationSpeed.z * delta;

            // Update mesh
            const mesh = meshRefs.current[i];
            if (mesh) {
                mesh.position.copy(m.position);
                mesh.rotation.copy(m.rotation);
            }

            // Check bounds - respawn if too far
            if (
                Math.abs(m.position.x) > BOUNDS * 1.5 ||
                Math.abs(m.position.y) > BOUNDS * 1.5
            ) {
                meteorites[i] = createMeteorite();
                needsRerender = true;
                return;
            }

            // Collision detection with spaceship
            const dist = m.position.distanceTo(shipPos);
            if (dist < COLLISION_DISTANCE + m.scale * 0.5) {
                // Explode!
                m.active = false;
                setExplosions((prev) => [
                    ...prev,
                    {
                        id: m.id,
                        position: [m.position.x, m.position.y, m.position.z] as [number, number, number],
                    },
                ]);

                // Schedule respawn
                respawnTimers.current.set(i, 1.5 + Math.random() * 2);
                needsRerender = true;
            }
        });

        if (needsRerender) {
            forceRerender((n) => n + 1);
        }
    });

    return (
        <>
            {meteoritesRef.current.map((m, i) =>
                m.active ? (
                    <mesh
                        key={`met-${m.id}`}
                        ref={(el) => { meshRefs.current[i] = el; }}
                        position={m.position.toArray() as [number, number, number]}
                        rotation={[m.rotation.x, m.rotation.y, m.rotation.z]}
                        scale={m.scale}
                    >
                        <icosahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial
                            color={m.color}
                            emissive={m.color}
                            emissiveIntensity={0.15}
                            flatShading
                            roughness={0.8}
                        />
                    </mesh>
                ) : null
            )}

            {explosions.map((exp) => (
                <Explosion
                    key={exp.id}
                    position={exp.position}
                    onComplete={() => handleExplosionComplete(exp.id)}
                />
            ))}
        </>
    );
}
