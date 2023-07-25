"use client";

import { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree, Canvas } from "@react-three/fiber";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const Viewer3D = () => {
  const path = "/models/deer.glb";

  const result = useGLTF(path);
  result.scene.updateMatrixWorld();

  return <primitive object={result.scene} />;
};

export default forwardRef(Viewer3D);
