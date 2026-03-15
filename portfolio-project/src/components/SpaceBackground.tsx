import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import Spaceship from './Spaceship';
import Meteorites from './Meteorites';
import type { ThemeType, ShipModelType, WeaponType } from '../App';

interface SpaceBackgroundProps {
    theme: ThemeType;
    shipModel: ShipModelType;
    weaponType: WeaponType;
}

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

        groupRef.current.position.x = position[0] + Math.cos(t) * orbitRadius;
        groupRef.current.position.y = position[1] + Math.sin(t) * orbitRadius * 0.4;

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

function Scene({ theme, shipModel, weaponType }: SpaceBackgroundProps) {
    const shipPositionRef = useRef(new THREE.Vector3(0, 0, 0));
    const shipDirectionRef = useRef(new THREE.Vector3(0, 1, 0));
    const laserStateRef = useRef({ active: false, timestamp: 0 });
    const screenShakeRef = useRef(0);

    useFrame((state, delta) => {
        if (screenShakeRef.current > 0.01) {
            const magnitude = screenShakeRef.current;
            state.camera.position.x = (Math.random() - 0.5) * magnitude;
            state.camera.position.y = (Math.random() - 0.5) * magnitude;
            screenShakeRef.current = THREE.MathUtils.lerp(screenShakeRef.current, 0, delta * 5);
        } else {
            screenShakeRef.current = 0;
            state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, delta * 5);
            state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, delta * 5);
        }
    });

    const themeColors = useMemo(() => {
        switch (theme) {
            case 'dark':
                return {
                    bg: '#0a0005',
                    light1: '#ff3d00',
                    light2: '#cc0000',
                    light3: '#ffab40',
                    nebula1: '#b71c1c',
                    nebula2: '#e65100',
                    nebula3: '#bf360c',
                    planet1: { c: '#ff5252', e: '#d50000' },
                    planet2: { c: '#8d6e63', e: '#5d4037' },
                    planet3: { c: '#ff9100', e: '#ff6d00', rc: '#ffcc80', re: '#e65100' },
                };
            case 'synthwave':
                return {
                    bg: '#090014',
                    light1: '#f50057',
                    light2: '#00e5ff',
                    light3: '#ffea00',
                    nebula1: '#c51162',
                    nebula2: '#00b8d4',
                    nebula3: '#6200ea',
                    planet1: { c: '#ff4081', e: '#f50057' },
                    planet2: { c: '#ffff00', e: '#ffea00' },
                    planet3: { c: '#18ffff', e: '#00e5ff', rc: '#84ffff', re: '#00b8d4' },
                };
            case 'neon':
            default:
                return {
                    bg: '#05050f',
                    light1: '#b388ff',
                    light2: '#7c4dff',
                    light3: '#00bcd4',
                    nebula1: '#7c4dff',
                    nebula2: '#e040fb',
                    nebula3: '#00bcd4',
                    planet1: { c: '#b388ff', e: '#7c4dff' },
                    planet2: { c: '#ffb300', e: '#ff6f00' },
                    planet3: { c: '#1de9b6', e: '#00bfa5', rc: '#b2dfdb', re: '#004d40' },
                };
        }
    }, [theme]);

    return (
        <>
            <ambientLight intensity={theme === 'dark' ? 0.3 : 0.15} />
            <directionalLight position={[5, 5, 5]} intensity={0.4} color={themeColors.light1} />
            <pointLight position={[-8, 3, -5]} intensity={1.5} color={themeColors.light2} distance={30} />
            <pointLight position={[6, -4, 3]} intensity={1} color={themeColors.light3} distance={25} />
            <pointLight position={[0, 8, -3]} intensity={0.8} color={themeColors.nebula2} distance={20} />

            <Stars
                radius={80}
                depth={60}
                count={1500}
                factor={3}
                saturation={0.1}
                fade
                speed={0.5}
            />

            <NebulaPlane position={[-5, 3, -15]} rotation={[0.2, 0.3, 0]} color={themeColors.nebula1} scale={20} />
            <NebulaPlane position={[6, -2, -18]} rotation={[-0.1, -0.2, 0.1]} color={themeColors.nebula2} scale={18} />
            <NebulaPlane position={[0, 0, -20]} rotation={[0, 0, 0]} color={themeColors.nebula3} scale={25} />

            <Planet
                radius={2.0}
                color={themeColors.planet1.c}
                emissive={themeColors.planet1.e}
                position={[-7, 5, -12]}
                orbitSpeed={0.08}
                orbitRadius={1.5}
            />
            <Planet
                radius={1.6}
                color={themeColors.planet2.c}
                emissive={themeColors.planet2.e}
                position={[8, -4, -14]}
                orbitSpeed={0.12}
                orbitRadius={1.2}
            />
            <Planet
                radius={2.8}
                color={themeColors.planet3.c}
                emissive={themeColors.planet3.e}
                position={[4, 7, -18]}
                orbitSpeed={0.05}
                orbitRadius={2.5}
                hasRing={true}
                ringColor={themeColors.planet3.rc!}
                ringEmissive={themeColors.planet3.re!}
            />

            <Spaceship
                shipPositionRef={shipPositionRef}
                shipDirectionRef={shipDirectionRef}
                laserStateRef={laserStateRef}
                screenShakeRef={screenShakeRef}
                shipModel={shipModel}
                weaponType={weaponType}
            />
            <Meteorites
                shipPositionRef={shipPositionRef}
                shipDirectionRef={shipDirectionRef}
                laserStateRef={laserStateRef}
                weaponType={weaponType}
            />
        </>
    );
}

export default function SpaceBackground({ theme, shipModel, weaponType }: SpaceBackgroundProps) {
    const bgCol = theme === 'dark' ? '#0a0005' : theme === 'synthwave' ? '#090014' : '#05050f';

    return (
        <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <Canvas
                eventSource={document.getElementById('root')!}
                eventPrefix="client"
                camera={{ position: [0, 0, 8], fov: 60 }}
                gl={{
                    antialias: false,
                    alpha: false,
                    powerPreference: 'high-performance',
                }}
                style={{ background: bgCol }}
                dpr={[1, 1.5]}
            >
                <Scene theme={theme} shipModel={shipModel} weaponType={weaponType} />
            </Canvas>
        </div>
    );
}
