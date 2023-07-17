"use client";

import { useGLTF } from "@react-three/drei";

const Viewer3D = () => {
  const path = "/models/deer.glb";

  const result = useGLTF(path);

  return <primitive object={result.scene} />;
};

export default Viewer3D;