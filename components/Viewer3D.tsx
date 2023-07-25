"use client";

import { useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Viewer3D = ({
  capturing,
  setCapturing,
  capture,
  isRotating,
  setIsRotating,
}: {
  capturing: boolean;
  setCapturing: (capture: boolean) => void;
  capture: () => void;
  isRotating: boolean;
  setIsRotating: (rotate: boolean) => void;
}) => {
  const path = "/models/deer.glb";

  const result = useGLTF(path);
  result.scene.updateMatrixWorld();

  const modelRef = useRef<any>();

  const [currentAngle, setCurrentAngle] = useState<number>(0);

  const rotationSpeed = 0.01;
  const snapshotAngleInterval = (24 * Math.PI) / 180; // 24도

  console.log(isRotating, capturing);

  useFrame(() => {
    if (modelRef.current && capturing && isRotating) {
      if (modelRef.current.rotation.y === 0) capture();

      modelRef.current.rotation.y += rotationSpeed;

      if (modelRef.current.rotation.y >= currentAngle + snapshotAngleInterval) {
        setCurrentAngle(modelRef.current.rotation.y);
        capture();
      }

      if (currentAngle >= Math.PI * 2) {
        setIsRotating(false);
        setCapturing(false);
        setCurrentAngle(0);
        modelRef.current.rotation.y = 0;
      }
    }
  });

  return <primitive object={result.scene} ref={modelRef} />;
};

export default Viewer3D;
