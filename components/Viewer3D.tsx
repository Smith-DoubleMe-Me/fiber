"use client";

import { useGLTF, Bounds, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Viewer3D = () => {
  const modelRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  const path = "/models/test2.glb";

  const result = useGLTF(path);

  const scaleModelToFit = () => {
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const modelSize = new THREE.Vector3();

    box.getSize(modelSize);

    // 원하는 크기로 스케일링
    const desiredSize = 5;
    const scaleFactor =
      desiredSize / Math.max(modelSize.x, modelSize.y, modelSize.z);

    const getScaleSize = () => {
      if (scaleFactor > 50) {
        return scaleFactor * 0.02;
      }

      if (scaleFactor > 5) {
        return scaleFactor * 0.33;
      }

      return scaleFactor;
    };

    const scaleNumber = getScaleSize();

    modelRef.current.scale.set(scaleNumber, scaleNumber, scaleNumber);
  };

  useEffect(() => {
    if (result.scene) {
      modelRef.current = result.scene;
      scaleModelToFit();
    }
  }, []);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      fov={60}
      aspect={1200 / 600}
      near={0.1}
      far={1000}
    >
      {/* <Bounds fit clip observe damping={6} margin={1.2}> */}
      <group position={[0, 0, 0]}>
        <primitive object={result.scene} ref={modelRef} />
      </group>
      {/* </Bounds> */}
    </PerspectiveCamera>
  );
};

export default Viewer3D;
