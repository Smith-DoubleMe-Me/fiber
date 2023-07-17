"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, lazy } from "react";

const Viewer3D = lazy(() => import("@/components/Viewer3D"));

export default function Home() {
  return (
    <Suspense fallback={"loading"}>
      <main>
        <div className="w-screen h-screen">
          <Canvas camera={{ position: [0, 10, 20], fov: 75 }}>
            <Environment preset="sunset" />
            <Viewer3D />
            <OrbitControls />
          </Canvas>
        </div>
      </main>
    </Suspense>
  );
}
