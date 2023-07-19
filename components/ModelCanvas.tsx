"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

import Viewer3D from "@/components/Viewer3D";
import Center3D from "@/components/Center3D";
import Viewer from "@/components/Viewer";

const ModelCanvas = () => {
  return (
    <Suspense fallback={"loading"}>
      <div className="w-screen h-screen mt-20 border-2">
        <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
          <Environment preset="sunset" />
          <Viewer3D />
          {/* <Viewer /> */}
          <OrbitControls />
          {/* <Center3D /> */}
        </Canvas>
      </div>
    </Suspense>
  );
};

export default ModelCanvas;
