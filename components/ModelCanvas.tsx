"use client";

import { ChangeEvent, memo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Stage,
  useGLTF,
  Html,
} from "@react-three/drei";
import { Suspense } from "react";

import Viewer3D from "@/components/Viewer3D";

function Animate({ controls, lerping, to, target }: any) {
  useFrame(({ camera }, delta) => {
    if (lerping) {
      camera.position.lerp(to, delta * 2);
      controls.current.target.lerp(target, delta * 2);
    }
  });

  return <></>;
}

const Annotations = memo(({ selected, gotoAnnotation, annotations }: any) => {
  return (
    <>
      {annotations.length > 0 &&
        annotations.map((a: any, i: number) => {
          return (
            <Html key={i} position={[a.lookAt.x, a.lookAt.y, a.lookAt.z]}>
              <svg
                height="34"
                width="34"
                transform="translate(-16 -16)"
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx="17"
                  cy="17"
                  r="16"
                  stroke="white"
                  strokeWidth="2"
                  fill="rgba(0,0,0,.66)"
                  onClick={() => gotoAnnotation(i)}
                />
                <text
                  x="12"
                  y="22"
                  fill="white"
                  fontSize={17}
                  fontFamily="monospace"
                  style={{ pointerEvents: "none" }}
                >
                  {i + 1}
                </text>
              </svg>
              {a.description && i === selected && (
                <div
                  id={"desc_" + i}
                  className="annotationDescription"
                  dangerouslySetInnerHTML={{ __html: a.description }}
                />
              )}
            </Html>
          );
        })}
    </>
  );
});

const Item = ({
  anno,
  i,
  gotoAnnotations,
  annotationList,
  setAnnotations,
}: {
  anno: any;
  i: number;
  gotoAnnotations: (idx: number) => void;
  annotationList: any[];
  setAnnotations: (arr: any[]) => void;
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(
    anno.description ?? "",
  );

  const handleEditAnnotation = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = () => {
    const newAnnotationList = annotationList.map(item => ({
      ...item,
      description: item.id === anno.id ? description : anno.description,
    }));
    setAnnotations(newAnnotationList);
    setEdit(false);
  };

  return (
    <li
      key={`${anno.title}${i}`}
      className="flex flex-row items-center justify-center w-full"
    >
      <div>{i + 1}</div>
      {!edit ? (
        <div className="ml-auto w-100">{anno.description}</div>
      ) : (
        <input
          type="text"
          className="w-100 border-2 border-black ml-auto"
          onChange={handleEditAnnotation}
          defaultValue={anno.description}
        />
      )}

      {!edit ? (
        <button
          key={i}
          onClick={() => setEdit(true)}
          className="bg-black w-30 h-50 text-white ml-auto"
        >
          Edit
        </button>
      ) : (
        <button
          key={i}
          onClick={handleSubmit}
          className="bg-black w-30 h-50 text-white ml-auto"
        >
          Ok
        </button>
      )}
      <button
        key={i + anno.description}
        onClick={() => gotoAnnotations(i)}
        className="bg-black w-30 h-50 text-white ml-auto"
      >
        camera
      </button>
    </li>
  );
};

const Buttons = ({
  gotoAnnotations,
  annotations,
  setAnnotations,
}: {
  gotoAnnotations: (idx: number) => void;
  annotations: any[];
  setAnnotations: (arr: any[]) => void;
}) => {
  return (
    <div className="w-300 h-auto flex flex-column border-red-200 border-2">
      <ul className="w-full">
        {annotations.map((anno: any, i: number) => {
          return (
            <Item
              anno={anno}
              i={i}
              gotoAnnotations={gotoAnnotations}
              key={i}
              annotationList={annotations}
              setAnnotations={setAnnotations}
            />
          );
        })}
      </ul>
    </div>
  );
};

const ModelCanvas = () => {
  const canvasRef = useRef<any>();
  const controlsRef = useRef<any>();
  const annotationRef = useRef<any>(0);

  const path = "/models/deer.glb";

  const result = useGLTF(path);
  result.scene.updateMatrixWorld();

  const [capturing, setCapturing] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [selected, setSelected] = useState<number>(-1);
  const [lerping, setLerping] = useState<boolean>(false);
  const [to, setTo] = useState<any>();
  const [target, setTarget] = useState<any>();

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

  const onClickGroup = (e: any) => {
    const { point, pointer, intersections, camera } = e;
    setAnnotations(prevState => [
      ...prevState,
      {
        id: annotations.length,
        cameraPos: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        },
        lookAt: {
          x: point.x,
          y: point.y,
          z: point.z,
        },
        title: "",
        description: "",
      },
    ]);
  };

  const gotoAnnotation = (idx: number) => {
    setLerping(true);
    setTo(annotations[idx].cameraPos);
    setTarget(annotations[idx].lookAt);
    setSelected(idx);
  };

  return (
    <div>
      <button
        onClick={captureImage}
        className="w-fit h-50 bg-slate-700 px-2 text-white"
      >
        snapshot
      </button>
      <div className="w-1500 h-600 mt-20 border-2 flex">
        <Suspense fallback={"loading"}>
          <Canvas
            ref={canvasRef}
            gl={{ preserveDrawingBuffer: true }}
            onWheel={() => {
              setLerping(false);
            }}
            onPointerDown={() => {
              setLerping(false);
            }}
          >
            <Environment preset="sunset" />
            <Stage adjustCamera={selected > -1 ? false : true}>
              <Viewer3D
                capturing={capturing}
                setCapturing={setCapturing}
                capture={capture}
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                onClickGroup={onClickGroup}
              />
            </Stage>

            <OrbitControls ref={controlsRef} />
            <Annotations
              selected={selected}
              gotoAnnotation={gotoAnnotation}
              annotations={annotations}
            />
            <Animate
              controls={controlsRef}
              target={target}
              to={to}
              lerping={lerping}
            />
          </Canvas>
        </Suspense>
        <Buttons
          gotoAnnotations={gotoAnnotation}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
      </div>
    </div>
  );
};

export default ModelCanvas;
