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
  // const [capturing, setCapturing] = useState<boolean>(false);
  const [currentAngle, setCurrentAngle] = useState<number>(0);

  // const captureImage = () => {
  //   if (!capturing) {
  //     setCapturing(true);
  //   }
  // };

  useFrame(() => {
    if (capturing) {
      modelRef.current.rotation.y += (Math.PI / 180) * 30;
      setCurrentAngle(prevState => prevState + 30);
    }
  });

  useEffect(() => {
    if (capturing) {
      capture();

      if (currentAngle >= 360) {
        setCapturing(false);
        setCurrentAngle(0);
      }
    }
  }, [capturing, currentAngle]);

  return <primitive object={result.scene} ref={modelRef} />;
};

export default Viewer3D;
