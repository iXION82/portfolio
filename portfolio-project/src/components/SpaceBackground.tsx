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
}: {
    radius: number;
    color: string;
    emissive: string;
    position: [number, number, number];
    orbitSpeed: number;
    orbitRadius: number;
}) {
    const ref = useRef<THREE.Mesh>(null);
    const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime * orbitSpeed + initialAngle;
        ref.current.position.x = position[0] + Math.cos(t) * orbitRadius;
        ref.current.position.y = position[1] + Math.sin(t) * orbitRadius * 0.4;
        ref.current.rotation.y = t * 0.5;
    });

    return (
        <mesh ref={ref} position={position}>
            <icosahedronGeometry args={[radius, 1]} />
            <meshStandardMaterial
                color={color}
                emissive={emissive}
                emissiveIntensity={0.3}
                flatShading
                roughness={0.7}
            />
        </mesh>
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
                radius={1.2}
                color="#7c4dff"
                emissive="#4a148c"
                position={[-7, 4, -10]}
                orbitSpeed={0.08}
                orbitRadius={1.5}
            />
            <Planet
                radius={0.8}
                color="#ff6f00"
                emissive="#e65100"
                position={[8, -3, -12]}
                orbitSpeed={0.12}
                orbitRadius={1}
            />
            <Planet
                radius={1.5}
                color="#00897b"
                emissive="#004d40"
                position={[3, 6, -15]}
                orbitSpeed={0.05}
                orbitRadius={2}
            />

            {/* Ring for the big planet */}
            <mesh position={[3, 6, -15]} rotation={[1.2, 0.3, 0]}>
                <torusGeometry args={[2.2, 0.15, 6, 16]} />
                <meshStandardMaterial
                    color="#26a69a"
                    emissive="#26a69a"
                    emissiveIntensity={0.3}
                    flatShading
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Interactive elements */}
            <Spaceship shipPositionRef={shipPositionRef} />
            <Meteorites shipPositionRef={shipPositionRef} />
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
