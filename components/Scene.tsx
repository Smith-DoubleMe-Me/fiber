import { useState, useRef } from "react";
import { Environment, OrbitControls, Stage } from "@react-three/drei";

import Viewer3D from "@/components/Viewer3D";

const Scene = () => {
  const [capturing, setCapturing] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const canvasRef = useRef<any>();
  const controlsRef = useRef<any>();

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
    <>
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
    </>
  );
};

export default Scene;
