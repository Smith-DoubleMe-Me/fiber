"use client";

import { useCallback, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

import Viewer3D from "@/components/Viewer3D";

const ModelCanvas = () => {
  const canvasRef = useRef<any>();
  const controlsRef = useRef<any>();
  const cameraRef = useRef<any>();
  const currentAngleRef = useRef<number>(0);

  const path = "/models/deer.glb";

  const result = useGLTF(path);
  result.scene.updateMatrixWorld();

  const Viewer = () => {
    const { camera } = useThree();

    cameraRef.current = camera;

    return <primitive object={result.scene} />;
  };

  const handleSnapshot = useCallback(() => {
    const angles = [];

    for (let i = 0; i < 12; i++) {
      angles.push((i * 30 * Math.PI) / 180);
    }

    if (currentAngleRef.current >= angles.length) return;

    const angle = angles[currentAngleRef.current];
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.enabled = false;

    cameraRef.current.position.x = Math.cos(angle) * 10;
    cameraRef.current.position.z = Math.sin(angle) * 10;
    cameraRef.current.lookAt(0, 0, 0);

    setTimeout(() => {
      currentAngleRef.current += 1;
      controlsRef.current.enabled = true;

      const strMime = "image/jpg";
      const strDownloadMime = "image/octet-stream";

      const imgData = canvasRef.current
        .toDataURL(strMime)
        .replace(strMime, strDownloadMime);
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.download = "test.jpg";
      link.href = imgData;
      link.click();
      document.body.removeChild(link);
      handleSnapshot();
    }, 100);
  }, [canvasRef.current, controlsRef.current]);

  return (
    <div>
      <button
        onClick={handleSnapshot}
        className="w-fit h-50 bg-slate-700 px-2 text-white"
      >
        snapshot
      </button>
      <div className="w-1200 h-600 mt-20 border-2">
        <Suspense fallback={"loading"}>
          <Canvas
            ref={canvasRef}
            gl={{ preserveDrawingBuffer: true }}
            camera={{ position: [0, 0, 10] }}
          >
            <Environment preset="sunset" />
            <Stage>
              <Viewer />
            </Stage>
            <OrbitControls ref={controlsRef} />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default ModelCanvas;
