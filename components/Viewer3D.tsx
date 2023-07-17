"use client";

import { useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Viewer3D = () => {
  const modelRef = useRef<any>(null);
  const path = "/models/test1.glb";

  const result = useGLTF(path);

  const scaleModelToFit = () => {
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const modelSize = new THREE.Vector3();
    box.getSize(modelSize);

    // 원하는 크기로 스케일링합니다.
    const desiredSize = 5; // 원하는 크기로 설정하세요
    const scaleFactor =
      desiredSize / Math.max(modelSize.x, modelSize.y, modelSize.z);

    modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
  };

  useEffect(() => {
    if (result.scene) {
      modelRef.current = result.scene;
      scaleModelToFit();
    }
  }, [result]);

  return <primitive object={result.scene} />;
};

export default Viewer3D;
