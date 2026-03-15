import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { ShipModelType, WeaponType } from '../App';

interface SpaceshipProps {
    shipPositionRef: React.MutableRefObject<THREE.Vector3>;
    shipDirectionRef: React.MutableRefObject<THREE.Vector3>;
    laserStateRef: React.MutableRefObject<{ active: boolean; timestamp: number }>;
    screenShakeRef: React.MutableRefObject<number>;
    shipModel: ShipModelType;
    weaponType: WeaponType;
}

export default function Spaceship({
    shipPositionRef,
    shipDirectionRef,
    laserStateRef,
    screenShakeRef,
    shipModel,
    weaponType
}: SpaceshipProps) {
    const parentRef = useRef<THREE.Group>(null);
    const modelRef = useRef<THREE.Group>(null);
    const targetRef = useRef(new THREE.Vector3(0, 0, 0));
    const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
    const previousZ = useRef(0);
    const { camera, size } = useThree();

    const mouseRef = useRef(new THREE.Vector2());
    const targetPosition = useRef(new THREE.Vector3());

    const isChargingRef = useRef(false);
    const chargeLevelRef = useRef(0);
    const laserVisualRef = useRef<THREE.Group>(null);
    const laserGlowRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'KeyF') {
                isChargingRef.current = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'KeyF') {
                isChargingRef.current = false;
                chargeLevelRef.current = 0; 
            }
        };

        window.addEventListener('pointermove', handleMouseMove);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('pointermove', handleMouseMove);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const trailParticles = useMemo(() => {
        return Array.from({ length: 20 }, () => ({
            position: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            life: 0,
            maxLife: 0.2 + Math.random() * 0.3,
        }));
    }, []);
    const trailMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

    useFrame((_, delta) => {
        const parent = parentRef.current;
        const model = modelRef.current;
        if (!parent || !model) return;

        targetPosition.current.set(mouseRef.current.x, mouseRef.current.y, 0.5);
        targetPosition.current.unproject(camera);

        const dir = targetPosition.current.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));

        targetRef.current.set(worldPos.x, worldPos.y, 0);

        const current = parent.position;
        const lerpFactor = 1 - Math.pow(0.001, delta);
        current.lerp(targetRef.current, lerpFactor * 0.8);

        shipPositionRef.current.copy(current);

        const vel = targetRef.current.clone().sub(current);
        velocityRef.current.lerp(vel, lerpFactor * 0.6);

        let diff = 0;
        if (velocityRef.current.lengthSq() > 0.0001) {
            const targetAngle = Math.atan2(velocityRef.current.y, velocityRef.current.x) - Math.PI / 2;
            diff = targetAngle - parent.rotation.z;

            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            parent.rotation.z += diff * lerpFactor * 0.4;
        }

        const speed = velocityRef.current.length();
        const targetPitch = THREE.MathUtils.clamp(-speed * 1.5, -0.6, 0.6); 
        const targetRoll = THREE.MathUtils.clamp(diff * 2.5, -0.8, 0.8); 

        model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, targetPitch, lerpFactor * 0.7);
        model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, targetRoll, lerpFactor * 0.7);

        previousZ.current = parent.rotation.z;

        const forward = new THREE.Vector3(0, 1, 0).applyQuaternion(parent.quaternion).normalize();
        shipDirectionRef.current.copy(forward);

        if (isChargingRef.current) {

            const chargeSpeed = weaponType === 'sniper' ? 0.6 : 2;
            chargeLevelRef.current += delta * chargeSpeed;

            if (chargeLevelRef.current >= 1.0) {

                laserStateRef.current = { active: true, timestamp: performance.now() };
                screenShakeRef.current = 0.5; 
                chargeLevelRef.current = 0; 
            }
        } else {
            chargeLevelRef.current = Math.max(0, chargeLevelRef.current - delta * 3);
        }

        if (laserVisualRef.current && laserGlowRef.current) {

            const glowMat = laserGlowRef.current.material as THREE.MeshStandardMaterial;
            laserGlowRef.current.scale.setScalar(chargeLevelRef.current || 0.01);
            glowMat.opacity = chargeLevelRef.current * 0.8;

            const timeSinceFire = (performance.now() - laserStateRef.current.timestamp) / 1000;

            if (laserStateRef.current.active && timeSinceFire < 0.15) {
                const lifeRatio = 1 - (timeSinceFire / 0.15);
                laserVisualRef.current.children.forEach(child => {
                    const meshChild = child as THREE.Mesh;
                    if (meshChild && meshChild.material) {
                        const m = meshChild.material as THREE.MeshBasicMaterial;
                        m.opacity = lifeRatio;
                    }
                });
                laserVisualRef.current.scale.x = lifeRatio; 
                laserVisualRef.current.scale.z = lifeRatio;
                laserVisualRef.current.visible = true;
            } else {
                laserStateRef.current.active = false;
                laserVisualRef.current.visible = false;
            }
        }

        trailParticles.forEach((p, i) => {
            p.life -= delta;
            if (p.life <= 0) {
                const offset = new THREE.Vector3(0, -0.15, 0);
                offset.applyQuaternion(parent.quaternion);

                p.position.set(
                    current.x + offset.x + (Math.random() - 0.5) * 0.05,
                    current.y + offset.y + (Math.random() - 0.5) * 0.05,
                    current.z + offset.z + 0.1
                );
                p.velocity.set(
                    -velocityRef.current.x * 2 + (Math.random() - 0.5) * 0.5,
                    -velocityRef.current.y * 2 + (Math.random() - 0.5) * 0.5,
                    0.5 + Math.random() * 0.5
                );
                p.life = p.maxLife;
            } else {
                p.position.add(p.velocity.clone().multiplyScalar(delta));
            }

            const mesh = trailMeshRefs.current[i];
            if (mesh) {
                mesh.position.copy(p.position);
                const lifeRatio = p.life / p.maxLife;
                const s = 0.04 * lifeRatio;
                mesh.scale.set(s, s, s);
                const mat = mesh.material as THREE.MeshBasicMaterial;
                mat.opacity = lifeRatio * 0.8;
            }
        });
    });

    const pixelSize = useMemo(() => {
        const aspect = size.width / size.height;
        return aspect > 1 ? 0.07 : 0.05;
    }, [size]);

    const s = pixelSize;

    return (
        <>
            <group ref={parentRef}>
                <group ref={modelRef} scale={[1.2, 1.2, 1.2]}>


                    {shipModel === 'fighter' && (
                        <group>
                            <mesh position={[0, s * 0.5, 0]}>
                                <boxGeometry args={[s * 1.5, s * 4, s * 1.2]} />
                                <meshStandardMaterial color="#e0e0e0" emissive="#bbbbbb" emissiveIntensity={0.2} flatShading />
                            </mesh>
                            <mesh position={[0, s * 3, 0]}>
                                <boxGeometry args={[s * 0.8, s * 1.5, s * 0.8]} />
                                <meshStandardMaterial color="#4fc3f7" emissive="#0288d1" emissiveIntensity={0.4} flatShading />
                            </mesh>
                            <mesh position={[0, s * 1.2, s * 0.5]}>
                                <boxGeometry args={[s * 1.2, s * 1.5, s * 0.6]} />
                                <meshStandardMaterial color="#00bcd4" emissive="#00bcd4" emissiveIntensity={0.8} transparent opacity={0.9} flatShading />
                            </mesh>
                            <mesh position={[-s * 1.8, -s * 0.5, -s * 0.2]}>
                                <boxGeometry args={[s * 3.5, s * 1.5, s * 0.4]} />
                                <meshStandardMaterial color="#0288d1" emissive="#01579b" emissiveIntensity={0.3} flatShading />
                            </mesh>
                            <mesh position={[s * 1.8, -s * 0.5, -s * 0.2]}>
                                <boxGeometry args={[s * 3.5, s * 1.5, s * 0.4]} />
                                <meshStandardMaterial color="#0288d1" emissive="#01579b" emissiveIntensity={0.3} flatShading />
                            </mesh>
                            <mesh position={[-s * 1.2, -s * 1.8, 0]}>
                                <boxGeometry args={[s, s * 1.5, s]} />
                                <meshStandardMaterial color="#424242" emissive="#212121" emissiveIntensity={0.5} flatShading />
                            </mesh>
                            <mesh position={[s * 1.2, -s * 1.8, 0]}>
                                <boxGeometry args={[s, s * 1.5, s]} />
                                <meshStandardMaterial color="#424242" emissive="#212121" emissiveIntensity={0.5} flatShading />
                            </mesh>
                            <mesh position={[0, -s * 1.8, 0]}>
                                <boxGeometry args={[s * 2, s * 0.8, s * 0.8]} />
                                <meshStandardMaterial color="#ff9100" emissive="#ff6d00" emissiveIntensity={2} flatShading />
                            </mesh>
                            <mesh position={[-s * 3.4, s * 0.2, -s * 0.2]}>
                                <boxGeometry args={[s * 0.4, s * 2, s * 0.4]} />
                                <meshStandardMaterial color="#ff1744" emissive="#d50000" emissiveIntensity={0.8} flatShading />
                            </mesh>
                            <mesh position={[s * 3.4, s * 0.2, -s * 0.2]}>
                                <boxGeometry args={[s * 0.4, s * 2, s * 0.4]} />
                                <meshStandardMaterial color="#ff1744" emissive="#d50000" emissiveIntensity={0.8} flatShading />
                            </mesh>
                        </group>
                    )}

                    {shipModel === 'saucer' && (
                        <group>
                            <mesh position={[0, 0, 0]}>
                                <cylinderGeometry args={[s * 4, s * 4, s * 0.8, 16]} />
                                <meshStandardMaterial color="#9e9e9e" emissive="#424242" emissiveIntensity={0.2} flatShading />
                            </mesh>
                            <mesh position={[0, 0, 0]}>
                                <torusGeometry args={[s * 4, s * 0.4, 8, 16]} />
                                <meshStandardMaterial color="#757575" flatShading />
                            </mesh>
                            <mesh position={[0, 0, s * 0.8]}>
                                <sphereGeometry args={[s * 2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
                                <meshStandardMaterial color="#64ffda" emissive="#1de9b6" emissiveIntensity={0.5} transparent opacity={0.6} flatShading />
                            </mesh>
                            <mesh position={[0, 0, -s * 0.5]}>
                                <cylinderGeometry args={[s * 1.5, s * 1, s * 0.5, 8]} />
                                <meshStandardMaterial color="#ff9100" emissive="#ff6d00" emissiveIntensity={2} flatShading />
                            </mesh>
                            <mesh position={[0, s * 3.8, 0]}>
                                <boxGeometry args={[s, s, s]} />
                                <meshStandardMaterial color="#212121" flatShading />
                            </mesh>
                        </group>
                    )}

                    {shipModel === 'blocky' && (
                        <group>

                            <mesh position={[0, s, 0]}>
                                <boxGeometry args={[s * 3, s * 5, s * 3]} />
                                <meshStandardMaterial color="#ffffff" emissive="#eeeeee" emissiveIntensity={0.1} flatShading />
                            </mesh>

                            <mesh position={[0, s * 2, s * 1.5]}>
                                <boxGeometry args={[s * 2.5, s * 1.5, s * 0.2]} />
                                <meshStandardMaterial color="#ffeb3b" emissive="#fbc02d" emissiveIntensity={0.8} flatShading />
                            </mesh>

                            <mesh position={[-s * 2.5, s * 0.5, 0]}>
                                <boxGeometry args={[s * 2, s * 3, s * 1]} />
                                <meshStandardMaterial color="#f44336" emissive="#d32f2f" emissiveIntensity={0.2} flatShading />
                            </mesh>

                            <mesh position={[s * 2.5, s * 0.5, 0]}>
                                <boxGeometry args={[s * 2, s * 3, s * 1]} />
                                <meshStandardMaterial color="#f44336" emissive="#d32f2f" emissiveIntensity={0.2} flatShading />
                            </mesh>

                            <mesh position={[0, -s * 2, 0]}>
                                <boxGeometry args={[s * 2.5, s * 1, s * 2.5]} />
                                <meshStandardMaterial color="#bdbdbd" flatShading />
                            </mesh>

                            <mesh position={[0, -s * 3, 0]}>
                                <boxGeometry args={[s * 2, s * 1.5, s * 2]} />
                                <meshStandardMaterial color="#ff3d00" emissive="#dd2c00" emissiveIntensity={1.5} flatShading />
                            </mesh>
                        </group>
                    )}

                    <mesh ref={laserGlowRef} position={[0, s * 4, 0]}>
                        <sphereGeometry args={[s * 1.5, 8, 8]} />
                        <meshStandardMaterial
                            color={weaponType === 'sniper' ? '#2979ff' : weaponType === 'shotgun' ? '#ffea00' : '#00e676'}
                            emissive={weaponType === 'sniper' ? '#2979ff' : weaponType === 'shotgun' ? '#ffea00' : '#00e676'}
                            emissiveIntensity={4}
                            transparent
                            opacity={0}
                        />
                    </mesh>

                    <group ref={laserVisualRef} visible={false}>
                        {weaponType === 'default' && (
                            <mesh position={[0, s * 20 + s * 3.5, 0]}>
                                <boxGeometry args={[s * 1.2, s * 40, s * 1.2]} />
                                <meshBasicMaterial color="#00e676" transparent opacity={0.8} />
                            </mesh>
                        )}

                        {weaponType === 'shotgun' && (
                            <>
                                <mesh position={[0, s * 8 + s * 3.5, 0]}>
                                    <boxGeometry args={[s * 3, s * 16, s * 1.2]} />
                                    <meshBasicMaterial color="#ffea00" transparent opacity={0.8} />
                                </mesh>
                                <mesh position={[-s * 8, s * 6 + s * 3.5, 0]} rotation={[0, 0, 0.6]}>
                                    <boxGeometry args={[s * 2, s * 12, s * 1.2]} />
                                    <meshBasicMaterial color="#ffea00" transparent opacity={0.8} />
                                </mesh>
                                <mesh position={[s * 8, s * 6 + s * 3.5, 0]} rotation={[0, 0, -0.6]}>
                                    <boxGeometry args={[s * 2, s * 12, s * 1.2]} />
                                    <meshBasicMaterial color="#ffea00" transparent opacity={0.8} />
                                </mesh>
                            </>
                        )}

                        {weaponType === 'sniper' && (
                            <mesh position={[0, s * 60 + s * 3.5, 0]}>
                                <boxGeometry args={[s * 3.0, s * 120, s * 3.0]} />
                                <meshBasicMaterial color="#2979ff" transparent opacity={0.9} />
                            </mesh>
                        )}
                    </group>
                </group>
            </group>

            {/* Engine trail particles */}
            {trailParticles.map((_, i) => (
                <mesh
                    key={`trail-${i}`}
                    ref={(el) => { trailMeshRefs.current[i] = el; }}
                >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color="#ffab40" transparent opacity={0.6} />
                </mesh>
            ))}
        </>
    );
}
