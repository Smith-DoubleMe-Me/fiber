"use client";

import { useEffect, useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const Viewer3D = ({
  capturing,
  setCapturing,
  capture,
}: {
  capturing: boolean;
  setCapturing: (capture: boolean) => void;
  capture: () => void;
}) => {
  const path = "/models/deer.glb";

  const result = useGLTF(path);
  result.scene.updateMatrixWorld();

  const modelRef = useRef<any>();

  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const rotationSpeed = 0.01;
  const snapshotAngleInterval = Math.PI / 6;

  useFrame(() => {
    if (modelRef.current && capturing && isRotating) {
      if (modelRef.current.rotation.y === 0) capture();

      modelRef.current.rotation.y += rotationSpeed;

      if (modelRef.current.rotation.y >= currentAngle + snapshotAngleInterval) {
        setCurrentAngle(modelRef.current.rotation.y);
        // console.log("sdfsf");
        capture();
      }

      if (currentAngle >= Math.PI * 2) {
        setIsRotating(false);
        setCapturing(false);
        modelRef.current.rotation.y = 0;
      }
    }
  });

  // useFrame(() => {
  //   if (capturing) {
  //     modelRef.current.rotation.y += (Math.PI / 180) * 30;
  //     setCurrentAngle(prevState => prevState + 30);
  //   }
  // });

  // useEffect(() => {
  //   if (capturing) {
  //     capture();

  //     if (currentAngle >= 360) {
  //       setCapturing(false);
  //       setCurrentAngle(0);
  //       // window.location.reload();
  //     }
  //   }
  // }, [capturing, currentAngle]);

  return <primitive object={result.scene} ref={modelRef} />;
};

export default Viewer3D;
