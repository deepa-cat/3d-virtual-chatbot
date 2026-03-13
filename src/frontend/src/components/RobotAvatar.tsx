import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface RobotAvatarProps {
  isTalking: boolean;
}

export function RobotAvatar({ isTalking }: RobotAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const antennaRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftEyeLightRef = useRef<THREE.PointLight>(null);
  const rightEyeLightRef = useRef<THREE.PointLight>(null);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x1a2a4a),
    metalness: 0.9,
    roughness: 0.15,
    envMapIntensity: 1.0,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x00d4ff),
    metalness: 0.6,
    roughness: 0.1,
    emissive: new THREE.Color(0x00aacc),
    emissiveIntensity: isTalking ? 1.5 : 0.8,
  });

  const eyeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x00ffff),
    metalness: 0.1,
    roughness: 0.05,
    emissive: new THREE.Color(0x00ffff),
    emissiveIntensity: isTalking ? 3.0 : 1.5,
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x0a1525),
    metalness: 0.95,
    roughness: 0.05,
  });

  const glowMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x7b4fff),
    emissive: new THREE.Color(0x7b4fff),
    emissiveIntensity: isTalking ? 1.2 : 0.5,
    metalness: 0.1,
    roughness: 0.2,
  });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;

    groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;

    if (headRef.current) {
      headRef.current.rotation.x = isTalking ? Math.sin(t * 4) * 0.08 : 0;
      headRef.current.rotation.z = isTalking ? Math.sin(t * 2.5) * 0.04 : 0;
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeIntensity = isTalking
        ? 2.5 + Math.sin(t * 6) * 0.8
        : 1.2 + Math.sin(t * 1.5) * 0.4;
      (
        leftEyeRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = eyeIntensity;
      (
        rightEyeRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = eyeIntensity;
    }

    if (leftEyeLightRef.current && rightEyeLightRef.current) {
      const lightIntensity = isTalking
        ? 1.5 + Math.sin(t * 6) * 0.5
        : 0.6 + Math.sin(t * 1.5) * 0.2;
      leftEyeLightRef.current.intensity = lightIntensity;
      rightEyeLightRef.current.intensity = lightIntensity;
    }

    if (antennaRef.current) {
      antennaRef.current.position.y = 0.88 + Math.sin(t * 2) * 0.01;
    }

    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = 0.3 + Math.sin(t * 0.8) * 0.08;
      rightArmRef.current.rotation.z =
        -0.3 + Math.sin(t * 0.8 + Math.PI) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <pointLight
        ref={leftEyeLightRef}
        position={[-0.16, 0.48, 0.32]}
        color={0x00ffff}
        intensity={0.6}
        distance={1.5}
      />
      <pointLight
        ref={rightEyeLightRef}
        position={[0.16, 0.48, 0.32]}
        color={0x00ffff}
        intensity={0.6}
        distance={1.5}
      />

      {/* HEAD */}
      <group ref={headRef} position={[0, 0.46, 0]}>
        <mesh material={bodyMat}>
          <boxGeometry args={[0.52, 0.46, 0.48]} />
        </mesh>
        <mesh position={[0, 0, 0.22]} material={darkMat}>
          <boxGeometry args={[0.42, 0.36, 0.06]} />
        </mesh>
        <mesh ref={leftEyeRef} position={[-0.1, 0.04, 0.26]} material={eyeMat}>
          <sphereGeometry args={[0.06, 16, 16]} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.1, 0.04, 0.26]} material={eyeMat}>
          <sphereGeometry args={[0.06, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.1, 0.25]} material={accentMat}>
          <boxGeometry args={[0.22, 0.025, 0.04]} />
        </mesh>
        <mesh position={[-0.07, -0.1, 0.265]} material={accentMat}>
          <sphereGeometry args={[0.018, 8, 8]} />
        </mesh>
        <mesh position={[0, -0.1, 0.265]} material={accentMat}>
          <sphereGeometry args={[0.018, 8, 8]} />
        </mesh>
        <mesh position={[0.07, -0.1, 0.265]} material={accentMat}>
          <sphereGeometry args={[0.018, 8, 8]} />
        </mesh>
        <mesh position={[0, 0.23, 0]} material={accentMat}>
          <boxGeometry args={[0.54, 0.03, 0.5]} />
        </mesh>
        <mesh position={[0, -0.23, 0]} material={accentMat}>
          <boxGeometry args={[0.54, 0.03, 0.5]} />
        </mesh>
        <mesh position={[-0.28, 0, 0]} material={darkMat}>
          <boxGeometry args={[0.06, 0.3, 0.3]} />
        </mesh>
        <mesh position={[0.28, 0, 0]} material={darkMat}>
          <boxGeometry args={[0.06, 0.3, 0.3]} />
        </mesh>
        <mesh position={[0, 0.26, 0]} material={accentMat}>
          <cylinderGeometry args={[0.04, 0.06, 0.08, 8]} />
        </mesh>
        <mesh ref={antennaRef} position={[0, 0.88, 0]} material={bodyMat}>
          <cylinderGeometry args={[0.025, 0.025, 1.28, 8]} />
        </mesh>
        <mesh position={[0, 1.53, 0]} material={glowMat}>
          <sphereGeometry args={[0.06, 16, 16]} />
        </mesh>
      </group>

      {/* NECK */}
      <mesh position={[0, 0.2, 0]} material={darkMat}>
        <cylinderGeometry args={[0.1, 0.12, 0.14, 12]} />
      </mesh>

      {/* TORSO */}
      <mesh position={[0, -0.18, 0]} material={bodyMat}>
        <boxGeometry args={[0.7, 0.72, 0.46]} />
      </mesh>
      <mesh position={[0, -0.1, 0.2]} material={darkMat}>
        <boxGeometry args={[0.5, 0.44, 0.08]} />
      </mesh>
      <mesh position={[0, -0.06, 0.25]} material={accentMat}>
        <torusGeometry args={[0.08, 0.018, 8, 32]} />
      </mesh>
      <mesh position={[0, -0.06, 0.26]} material={eyeMat}>
        <circleGeometry args={[0.04, 16]} />
      </mesh>
      <mesh position={[0, -0.1, 0.25]} material={glowMat}>
        <boxGeometry args={[0.36, 0.018, 0.04]} />
      </mesh>
      <mesh position={[0, -0.2, 0.25]} material={glowMat}>
        <boxGeometry args={[0.36, 0.018, 0.04]} />
      </mesh>
      <mesh position={[0, 0.19, 0]} material={accentMat}>
        <boxGeometry args={[0.72, 0.025, 0.48]} />
      </mesh>
      <mesh position={[0, -0.56, 0]} material={accentMat}>
        <boxGeometry args={[0.72, 0.025, 0.48]} />
      </mesh>

      {/* LEFT ARM */}
      <group ref={leftArmRef} position={[-0.44, -0.08, 0]}>
        <mesh position={[0, -0.2, 0]} material={bodyMat}>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
        </mesh>
        <mesh position={[0, -0.44, 0]} material={darkMat}>
          <sphereGeometry args={[0.09, 12, 12]} />
        </mesh>
        <mesh position={[0, -0.64, 0]} material={bodyMat}>
          <boxGeometry args={[0.17, 0.38, 0.17]} />
        </mesh>
        <mesh position={[0, -0.88, 0]} material={darkMat}>
          <sphereGeometry args={[0.1, 12, 12]} />
        </mesh>
        <mesh position={[0, -0.22, 0.1]} material={glowMat}>
          <boxGeometry args={[0.18, 0.06, 0.02]} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArmRef} position={[0.44, -0.08, 0]}>
        <mesh position={[0, -0.2, 0]} material={bodyMat}>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
        </mesh>
        <mesh position={[0, -0.44, 0]} material={darkMat}>
          <sphereGeometry args={[0.09, 12, 12]} />
        </mesh>
        <mesh position={[0, -0.64, 0]} material={bodyMat}>
          <boxGeometry args={[0.17, 0.38, 0.17]} />
        </mesh>
        <mesh position={[0, -0.88, 0]} material={darkMat}>
          <sphereGeometry args={[0.1, 12, 12]} />
        </mesh>
        <mesh position={[0, -0.22, 0.1]} material={glowMat}>
          <boxGeometry args={[0.18, 0.06, 0.02]} />
        </mesh>
      </group>

      {/* PELVIS */}
      <mesh position={[0, -0.65, 0]} material={darkMat}>
        <boxGeometry args={[0.6, 0.14, 0.4]} />
      </mesh>

      {/* LEFT LEG */}
      <group position={[-0.18, -0.88, 0]}>
        <mesh position={[0, -0.2, 0]} material={bodyMat}>
          <boxGeometry args={[0.24, 0.4, 0.24]} />
        </mesh>
        <mesh position={[0, -0.44, 0]} material={darkMat}>
          <sphereGeometry args={[0.1, 12, 12]} />
        </mesh>
        <mesh position={[0, -0.64, 0]} material={bodyMat}>
          <boxGeometry args={[0.2, 0.38, 0.2]} />
        </mesh>
        <mesh position={[0, -0.88, 0.06]} material={darkMat}>
          <boxGeometry args={[0.22, 0.14, 0.34]} />
        </mesh>
      </group>

      {/* RIGHT LEG */}
      <group position={[0.18, -0.88, 0]}>
        <mesh position={[0, -0.2, 0]} material={bodyMat}>
          <boxGeometry args={[0.24, 0.4, 0.24]} />
        </mesh>
        <mesh position={[0, -0.44, 0]} material={darkMat}>
          <sphereGeometry args={[0.1, 12, 12]} />
        </mesh>
        <mesh position={[0, -0.64, 0]} material={bodyMat}>
          <boxGeometry args={[0.2, 0.38, 0.2]} />
        </mesh>
        <mesh position={[0, -0.88, 0.06]} material={darkMat}>
          <boxGeometry args={[0.22, 0.14, 0.34]} />
        </mesh>
      </group>
    </group>
  );
}
