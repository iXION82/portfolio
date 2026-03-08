import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import Spaceship from './Spaceship';
import Meteorites from './Meteorites';

/* Slowly orbiting low-poly planet */
function Planet({
    radius,
    color,
    emissive,
    position,
    orbitSpeed,
    orbitRadius,
    hasRing,
    ringColor,
    ringEmissive,
}: {
    radius: number;
    color: string;
    emissive: string;
    position: [number, number, number];
    orbitSpeed: number;
    orbitRadius: number;
    hasRing?: boolean;
    ringColor?: string;
    ringEmissive?: string;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const planetRef = useRef<THREE.Mesh>(null);
    const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (!groupRef.current || !planetRef.current) return;
        const t = state.clock.elapsedTime * orbitSpeed + initialAngle;

        // Move the entire group (planet + ring)
        groupRef.current.position.x = position[0] + Math.cos(t) * orbitRadius;
        groupRef.current.position.y = position[1] + Math.sin(t) * orbitRadius * 0.4;

        // Self-rotation of the planet
        planetRef.current.rotation.y = t * 0.5;
    });

    return (
        <group ref={groupRef} position={position}>
            <mesh ref={planetRef}>
                <icosahedronGeometry args={[radius, 1]} />
                <meshStandardMaterial
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={0.3}
                    flatShading
                    roughness={0.7}
                />
            </mesh>
            {hasRing && (
                <mesh rotation={[1.2, 0.3, 0]}>
                    <torusGeometry args={[4.2, 0.2, 8, 24]} />
                    <meshStandardMaterial
                        color={ringColor}
                        emissive={ringEmissive}
                        emissiveIntensity={0.8}
                        flatShading
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            )}
        </group>
    );
}

/* Nebula-like background glow plane */
function NebulaPlane({
    position,
    rotation,
    color,
    scale,
}: {
    position: [number, number, number];
    rotation: [number, number, number];
    color: string;
    scale: number;
}) {
    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={[scale, scale]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.06}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

/* Scene contents */
function Scene() {
    const shipPositionRef = useRef(new THREE.Vector3(0, 0, 0));
    const shipDirectionRef = useRef(new THREE.Vector3(0, 1, 0));
    const laserStateRef = useRef({ active: false, timestamp: 0 });
    const screenShakeRef = useRef(0);

    // Apply screen shake to camera
    useFrame((state, delta) => {
        if (screenShakeRef.current > 0.01) {
            const magnitude = screenShakeRef.current;
            state.camera.position.x = (Math.random() - 0.5) * magnitude;
            state.camera.position.y = (Math.random() - 0.5) * magnitude;
            screenShakeRef.current = THREE.MathUtils.lerp(screenShakeRef.current, 0, delta * 5); // decay
        } else {
            // Smoothly return to center
            screenShakeRef.current = 0;
            state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, delta * 5);
            state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, delta * 5);
        }
    });

    return (
        <>
            {/* Ambient + colored lighting */}
            <ambientLight intensity={0.15} />
            <directionalLight position={[5, 5, 5]} intensity={0.4} color="#b388ff" />
            <pointLight position={[-8, 3, -5]} intensity={1.5} color="#7c4dff" distance={30} />
            <pointLight position={[6, -4, 3]} intensity={1} color="#00bcd4" distance={25} />
            <pointLight position={[0, 8, -3]} intensity={0.8} color="#e040fb" distance={20} />

            {/* Starfield */}
            <Stars
                radius={80}
                depth={60}
                count={1500}
                factor={3}
                saturation={0.1}
                fade
                speed={0.5}
            />

            {/* Nebula glow planes */}
            <NebulaPlane position={[-5, 3, -15]} rotation={[0.2, 0.3, 0]} color="#7c4dff" scale={20} />
            <NebulaPlane position={[6, -2, -18]} rotation={[-0.1, -0.2, 0.1]} color="#e040fb" scale={18} />
            <NebulaPlane position={[0, 0, -20]} rotation={[0, 0, 0]} color="#00bcd4" scale={25} />

            {/* Planets */}
            <Planet
                radius={2.0}
                color="#b388ff"
                emissive="#7c4dff"
                position={[-7, 5, -12]}
                orbitSpeed={0.08}
                orbitRadius={1.5}
            />
            <Planet
                radius={1.6}
                color="#ffb300"
                emissive="#ff6f00"
                position={[8, -4, -14]}
                orbitSpeed={0.12}
                orbitRadius={1.2}
            />
            <Planet
                radius={2.8}
                color="#1de9b6"
                emissive="#00bfa5"
                position={[4, 7, -18]}
                orbitSpeed={0.05}
                orbitRadius={2.5}
                hasRing={true}
                ringColor="#b2dfdb"
                ringEmissive="#004d40"
            />

            {/* Interactive elements */}
            <Spaceship
                shipPositionRef={shipPositionRef}
                shipDirectionRef={shipDirectionRef}
                laserStateRef={laserStateRef}
                screenShakeRef={screenShakeRef}
            />
            <Meteorites
                shipPositionRef={shipPositionRef}
                shipDirectionRef={shipDirectionRef}
                laserStateRef={laserStateRef}
            />
        </>
    );
}

export default function SpaceBackground() {
    return (
        <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <Canvas
                eventSource={document.getElementById('root')!}
                eventPrefix="client"
                camera={{ position: [0, 0, 8], fov: 60 }}
                gl={{
                    antialias: false, // pixelated feel
                    alpha: false,
                    powerPreference: 'high-performance',
                }}
                style={{ background: '#05050f' }}
                dpr={[1, 1.5]}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
