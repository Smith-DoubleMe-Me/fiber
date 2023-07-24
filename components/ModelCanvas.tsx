"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stage } from "@react-three/drei";
import { Suspense } from "react";

import Viewer3D from "@/components/Viewer3D";
import Center3D from "@/components/Center3D";
import Viewer from "@/components/Viewer";

const ModelCanvas = () => {
  const canvasRef = useRef<any>();

  return (
    <Suspense fallback={"loading"}>
      <div className="w-480 h-360 mt-20 border-2">
        <Canvas ref={canvasRef}>
          <Environment preset="sunset" />
          <Stage>
            <Viewer3D />
          </Stage>
          {/* <Viewer /> */}
          <OrbitControls />
          {/* <Center3D /> */}
        </Canvas>
      </div>
    </Suspense>
  );
};

export default ModelCanvas;
