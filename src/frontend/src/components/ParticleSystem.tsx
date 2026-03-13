import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null);
  const COUNT = 300;

  const { positions, speeds, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      speeds[i] = 0.01 + Math.random() * 0.02;

      // Alternate cyan/violet colors
      if (Math.random() > 0.4) {
        colors[i * 3] = 0.1;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 0.2;
        colors[i * 3 + 2] = 1.0;
      }
    }
    return { positions, speeds, colors };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
      }),
    [],
  );

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < COUNT; i++) {
      let y = pos.getY(i) + speeds[i];
      if (y > 8) y = -8;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    pointsRef.current.rotation.y += 0.0003;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
