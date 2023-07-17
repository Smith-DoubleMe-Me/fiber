"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

import Viewer3D from "@/components/Viewer3D";

const ModelCanvas = () => {
  return (
    <Suspense fallback={"loading"}>
      <div className="w-480 h-360 mt-20 border-2">
        <Canvas camera={{ position: [0, 10, 20], fov: 75 }}>
          <Environment preset="sunset" />
          <Viewer3D />
          <OrbitControls />
        </Canvas>
      </div>
    </Suspense>
  );
};

export default ModelCanvas;
