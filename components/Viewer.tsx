"use client";

import { useGLTF, Bounds } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Viewer = () => {
  const modelRef = useRef<any>(null);
  const path = "/models/simpson.glb";

  const result = useGLTF(path);

  useEffect(() => {
    result.scene.scale.multiplyScalar(1 / 10);
    // result.scene.position.x = 20;
    // result.scene.position.y = -20;
  }, []);

  return <primitive object={result.scene} ref={modelRef} />;
};

export default Viewer;
