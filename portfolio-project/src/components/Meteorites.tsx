import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Explosion from './Explosion';
import type { WeaponType } from '../App';

interface MeteoritesProps {
    shipPositionRef: React.MutableRefObject<THREE.Vector3>;
    shipDirectionRef: React.MutableRefObject<THREE.Vector3>;
    laserStateRef: React.MutableRefObject<{ active: boolean; timestamp: number }>;
    weaponType: WeaponType;
}

interface Meteorite {
    id: number;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    rotation: THREE.Euler;
    rotationSpeed: THREE.Vector3;
    scale: number;
    distortion: [number, number, number];
    geometryType: number;
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
        distortion: [
            1 + (Math.random() - 0.5) * 0.5,
            1 + (Math.random() - 0.5) * 0.5,
            1 + (Math.random() - 0.5) * 0.5
        ] as [number, number, number],
        geometryType: Math.floor(Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        active: true,
    };
}

export default function Meteorites({ shipPositionRef, shipDirectionRef, laserStateRef, weaponType }: MeteoritesProps) {
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
        const shipDir = shipDirectionRef.current;
        const laserActive = laserStateRef.current.active;
        let needsRerender = false;

        // Laser mathematical bounds setup
        const laserStart = shipPos;
        const laserLines: THREE.Line3[] = [];

        if (laserActive) {
            if (weaponType === 'sniper') {
                // Sniper is buffed to be much longer across the screen
                const laserEnd = shipPos.clone().add(shipDir.clone().multiplyScalar(60));
                laserLines.push(new THREE.Line3(laserStart, laserEnd));
            } else if (weaponType === 'shotgun') {
                // Shotgun has shorter range (20% screen size roughly), wider spread
                const centerEnd = shipPos.clone().add(shipDir.clone().multiplyScalar(3.0));
                laserLines.push(new THREE.Line3(laserStart, centerEnd));

                // Right angle spread (wider)
                const rightDir = shipDir.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), -0.6);
                const rightEnd = shipPos.clone().add(rightDir.multiplyScalar(2.5));
                laserLines.push(new THREE.Line3(laserStart, rightEnd));

                // Left angle spread (wider)
                const leftDir = shipDir.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.6);
                const leftEnd = shipPos.clone().add(leftDir.multiplyScalar(2.5));
                laserLines.push(new THREE.Line3(laserStart, leftEnd));
            } else {
                // Default laser
                const laserEnd = shipPos.clone().add(shipDir.clone().multiplyScalar(7.5));
                laserLines.push(new THREE.Line3(laserStart, laserEnd));
            }
        }

        const closestPoint = new THREE.Vector3();

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

            let hit = false;

            // 1. Collision detection with spaceship (ignore Z depth for hit test)
            const dx = m.position.x - shipPos.x;
            const dy = m.position.y - shipPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < COLLISION_DISTANCE + m.scale * 0.5) {
                hit = true;
            }

            // 2. Collision detection with laser
            if (!hit && laserActive) {
                for (const line of laserLines) {
                    line.closestPointToPoint(m.position, true, closestPoint);
                    const ldx = m.position.x - closestPoint.x;
                    const ldy = m.position.y - closestPoint.y;
                    const ldist = Math.sqrt(ldx * ldx + ldy * ldy);

                    // Sniper is newly buffed and very thick, default is standard
                    const tolerance = weaponType === 'sniper' ? 1.2 : 0.4;
                    if (ldist < m.scale * 0.5 + tolerance) {
                        hit = true;
                        break;
                    }
                }
            }

            if (hit) {
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
                        scale={[m.scale * m.distortion[0], m.scale * m.distortion[1], m.scale * m.distortion[2]]}
                    >
                        {m.geometryType === 0 && <icosahedronGeometry args={[1, 0]} />}
                        {m.geometryType === 1 && <dodecahedronGeometry args={[1, 0]} />}
                        {m.geometryType === 2 && <octahedronGeometry args={[1, 0]} />}
                        {m.geometryType === 3 && <tetrahedronGeometry args={[1, 0]} />}
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
