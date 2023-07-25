"use client";

import { useCallback, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

import Viewer3D from "@/components/Viewer3D";

const ModelCanvas = () => {
  const canvasRef = useRef<any>();
  const controlsRef = useRef<any>();
  const cameraRef = useRef<any>();
  const currentAngleRef = useRef<number>(0);

  // const path = "/models/deer.glb";

  // const result = useGLTF(path);
  // result.scene.updateMatrixWorld();

  const [capturing, setCapturing] = useState<boolean>(false);

  const captureImage = () => {
    if (!capturing) {
      setCapturing(true);
    }
  };

  const capture = () => {
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
  };

  return (
    <div>
      <button
        onClick={captureImage}
        className="w-fit h-50 bg-slate-700 px-2 text-white"
      >
        snapshot
      </button>
      <div className="w-1200 h-600 mt-20 border-2">
        <Suspense fallback={"loading"}>
          <Canvas ref={canvasRef} gl={{ preserveDrawingBuffer: true }}>
            <Environment preset="sunset" />
            <Stage>
              {/* <Viewer /> */}
              <Viewer3D
                capturing={capturing}
                setCapturing={setCapturing}
                capture={capture}
              />
            </Stage>
            <OrbitControls ref={controlsRef} />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default ModelCanvas;
