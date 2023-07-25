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

  const path = "/models/deer.glb";

  const result = useGLTF(path);
  result.scene.updateMatrixWorld();

  const [capturing, setCapturing] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const captureImage = () => {
    if (!capturing && !isRotating) {
      setCapturing(true);
      setIsRotating(true);
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

  // const Viewer = () => {
  //   const { camera } = useThree();

  //   cameraRef.current = camera;

  //   return <primitive object={result.scene} />;
  // };

  // const handleSnapshot = useCallback(async () => {
  //   const angles = [];

  //   for (let i = 0; i < 13; i++) {
  //     angles.push((Math.PI / 180) * (i * 30));
  //   }

  //   if (currentAngleRef.current >= angles.length) return;

  //   const angle = angles[currentAngleRef.current];
  //   // controlsRef.current.target.set(0, 0, 0);
  //   controlsRef.current.enabled = false;

  //   cameraRef.current.position.x = Math.cos(angle) * 10;
  //   cameraRef.current.position.z = Math.sin(angle) * 10;
  //   cameraRef.current.lookAt(0, 0, 0);

  //   setTimeout(() => {
  //     const strMime = "image/jpg";
  //     const strDownloadMime = "image/octet-stream";

  //     const imgData = canvasRef.current
  //       .toDataURL(strMime)
  //       .replace(strMime, strDownloadMime);
  //     const link = document.createElement("a");
  //     document.body.appendChild(link);
  //     link.download = "test.jpg";
  //     link.href = imgData;
  //     link.click();
  //     document.body.removeChild(link);
  //     currentAngleRef.current += 1;
  //     controlsRef.current.enabled = true;
  //     handleSnapshot();
  //   }, 100);
  // }, [canvasRef.current, controlsRef.current]);

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
                isRotating={isRotating}
                setIsRotating={setIsRotating}
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
