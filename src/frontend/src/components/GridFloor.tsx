import { useMemo } from "react";
import * as THREE from "three";

export function GridFloor() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 20, 20);
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x00d4ff),
        wireframe: true,
        transparent: true,
        opacity: 0.08,
        emissive: new THREE.Color(0x00aacc),
        emissiveIntensity: 0.3,
      }),
    [],
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.5, 0]}
    />
  );
}
