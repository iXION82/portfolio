import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SpaceshipProps {
    shipPositionRef: React.MutableRefObject<THREE.Vector3>;
}

/* Tiny voxel-style spaceship built from box geometries */
export default function Spaceship({ shipPositionRef }: SpaceshipProps) {
    const groupRef = useRef<THREE.Group>(null);
    const targetRef = useRef(new THREE.Vector3(0, 0, 0));
    const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
    const { camera, size } = useThree();

    const mouseRef = useRef(new THREE.Vector2());
    const targetPosition = useRef(new THREE.Vector3());

    // Use a global window event listener to bypass any CSS/Canvas pointer-events issues
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize mouse coordinates to -1 to +1
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('pointermove', handleMouseMove);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('pointermove', handleMouseMove);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Engine trail particles
    const trailParticles = useMemo(() => {
        return Array.from({ length: 12 }, () => ({
            position: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            life: 0,
            maxLife: 0.3 + Math.random() * 0.4,
        }));
    }, []);

    const trailMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        // Convert normalized mouse coordinates to 3D world space
        targetPosition.current.set(mouseRef.current.x, mouseRef.current.y, 0.5);
        targetPosition.current.unproject(camera);

        // We want the ship to stay on the z=0 plane, so we calculate the intersection
        const dir = targetPosition.current.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));

        targetRef.current.set(worldPos.x, worldPos.y, 0);

        // Smooth follow with lerp
        const current = groupRef.current.position;
        const lerpFactor = 1 - Math.pow(0.001, delta);
        current.lerp(targetRef.current, lerpFactor * 0.8);

        // Update shared position ref for collision detection
        shipPositionRef.current.copy(current);

        // Calculate velocity for tilt
        const vel = targetRef.current.clone().sub(current);
        velocityRef.current.lerp(vel, lerpFactor * 0.5);

        // Tilt toward direction of movement
        const tiltX = THREE.MathUtils.clamp(velocityRef.current.y * 0.15, -0.4, 0.4);
        const tiltZ = THREE.MathUtils.clamp(-velocityRef.current.x * 0.15, -0.5, 0.5);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tiltX, lerpFactor * 0.5);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, tiltZ, lerpFactor * 0.5);

        // Point roughly in the direction of travel
        const angle = Math.atan2(velocityRef.current.y, velocityRef.current.x);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            -angle * 0.3,
            lerpFactor * 0.3
        );

        // Update engine trail
        trailParticles.forEach((p, i) => {
            p.life -= delta;
            if (p.life <= 0) {
                // Reset particle
                p.position.set(
                    current.x + (Math.random() - 0.5) * 0.05,
                    current.y + (Math.random() - 0.5) * 0.05,
                    current.z + 0.15
                );
                p.velocity.set(
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3,
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
                const s = 0.03 * lifeRatio;
                mesh.scale.set(s, s, s);
                const mat = mesh.material as THREE.MeshBasicMaterial;
                mat.opacity = lifeRatio * 0.8;
            }
        });
    });

    const pixelSize = useMemo(() => {
        // Scale ship based on viewport size
        const aspect = size.width / size.height;
        return aspect > 1 ? 0.07 : 0.05;
    }, [size]);

    const s = pixelSize;

    return (
        <>
            <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
                {/* Main body - center */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[s * 2, s, s]} />
                    <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={0.5} flatShading />
                </mesh>
                {/* Nose */}
                <mesh position={[s * 1.5, 0, 0]}>
                    <boxGeometry args={[s, s * 0.7, s * 0.7]} />
                    <meshStandardMaterial color="#81d4fa" emissive="#81d4fa" emissiveIntensity={0.6} flatShading />
                </mesh>
                {/* Cockpit */}
                <mesh position={[s * 0.5, s * 0.3, 0]}>
                    <boxGeometry args={[s * 0.6, s * 0.4, s * 0.6]} />
                    <meshStandardMaterial color="#e0f7fa" emissive="#ffffff" emissiveIntensity={0.8} flatShading />
                </mesh>
                {/* Left wing */}
                <mesh position={[-s * 0.3, 0, s * 1]}>
                    <boxGeometry args={[s * 1.5, s * 0.3, s * 0.8]} />
                    <meshStandardMaterial color="#0288d1" emissive="#0288d1" emissiveIntensity={0.3} flatShading />
                </mesh>
                {/* Right wing */}
                <mesh position={[-s * 0.3, 0, -s * 1]}>
                    <boxGeometry args={[s * 1.5, s * 0.3, s * 0.8]} />
                    <meshStandardMaterial color="#0288d1" emissive="#0288d1" emissiveIntensity={0.3} flatShading />
                </mesh>
                {/* Engine left */}
                <mesh position={[-s * 1.2, 0, s * 0.4]}>
                    <boxGeometry args={[s * 0.5, s * 0.5, s * 0.5]} />
                    <meshStandardMaterial color="#ff6f00" emissive="#ff6f00" emissiveIntensity={1.5} flatShading />
                </mesh>
                {/* Engine right */}
                <mesh position={[-s * 1.2, 0, -s * 0.4]}>
                    <boxGeometry args={[s * 0.5, s * 0.5, s * 0.5]} />
                    <meshStandardMaterial color="#ff6f00" emissive="#ff6f00" emissiveIntensity={1.5} flatShading />
                </mesh>
                {/* Engine glow center */}
                <mesh position={[-s * 1.4, 0, 0]}>
                    <boxGeometry args={[s * 0.3, s * 0.4, s * 1.2]} />
                    <meshStandardMaterial color="#ffab00" emissive="#ffab00" emissiveIntensity={2} flatShading />
                </mesh>
            </group>

            {/* Engine trail particles */}
            {trailParticles.map((_, i) => (
                <mesh
                    key={`trail - ${i} `}
                    ref={(el) => { trailMeshRefs.current[i] = el; }}
                >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color="#ffab40" transparent opacity={0.5} />
                </mesh>
            ))}
        </>
    );
}
