"use client";

import { useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stage } from "@react-three/drei";
import { Suspense } from "react";

import Viewer3D from "@/components/Viewer3D";

const ModelCanvas = () => {
  const canvasRef = useRef<any>();

  const handleSnapshot = useCallback(async () => {
    let imgData;

    try {
      const strMime = "image/jpg";
      const strDownloadMime = "image/octet-stream";

      imgData = canvasRef.current
        .toDataURL(strMime)
        .replace(strMime, strDownloadMime);
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.download = "test.jpg";
      link.href = imgData;
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      return;
    }
  }, [canvasRef.current]);

  return (
    <>
      <button
        onClick={handleSnapshot}
        className="w-fit h-50 bg-slate-700 px-2 text-white"
      >
        snapshot
      </button>
      <div className="w-1200 h-600 mt-20 border-2">
        <Suspense fallback={"loading"}>
          <Canvas ref={canvasRef} gl={{ preserveDrawingBuffer: true }}>
            <Environment preset="sunset" />
            <Stage>
              <Viewer3D />
            </Stage>
            <OrbitControls />
          </Canvas>
        </Suspense>
      </div>
    </>
  );
};

export default ModelCanvas;
