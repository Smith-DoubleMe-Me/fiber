"use client";

import {
  ChangeEvent,
  DragEvent,
  DragEventHandler,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Stage,
  useGLTF,
  Html,
} from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

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
  const [description, setDescription] = useState<string>(anno.description);
  const [target, setTarget] = useState<any>();

  const handleEditAnnotation = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = () => {
    const newAnnotationList = annotationList.map(item => ({
      ...item,
      description: item.id === anno.id ? description : item.description,
    }));
    setAnnotations(newAnnotationList);
    setEdit(false);
  };

  const handleDeleteAnnotation = () => {
    const newAnnotationList = annotationList.filter(item => {
      return item.id !== anno.id;
    });
    setAnnotations(newAnnotationList);
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
          value={description}
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
        key={i + "delete"}
        onClick={handleDeleteAnnotation}
        className="bg-black w-30 h-50 text-white ml-auto"
      >
        delete
      </button>
      <button
        key={i + "camera"}
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
  const groupRef = useRef<any>();

  const path = "/models/test1.glb";

  const result = useGLTF(path);

  const raycaster = new THREE.Raycaster();
  const moveMouse = new THREE.Vector2();

  const [capturing, setCapturing] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [selected, setSelected] = useState<number>(-1);
  const [lerping, setLerping] = useState<boolean>(false);
  const [to, setTo] = useState<any>();
  const [target, setTarget] = useState<any>();
  const [draggable, setDraggable] = useState<boolean>(false);

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

  const onClickGroup = (e: ThreeEvent<MouseEvent>) => {
    const { point, camera } = e;
    console.log(point);
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

  const dragEnter = (event: any) => {
    controlsRef.current.enabled = false;
    console.log(event);
  };

  const dragLeave = (event: any) => {
    console.log(event);
  };

  const drag = (event: any) => {
    console.log(event);
    setTarget(Number(event.target.innerText));
  };

  const drop = (event: DragEvent<HTMLDivElement>) => {
    moveMouse.x = (event.clientX / (canvasRef.current.width / 2)) * 2 - 1;
    moveMouse.y = -(event.clientY / canvasRef.current.height) * 2 + 1;
    //NOTE: drop 시 좌표 계산 이상하게 됨.

    raycaster.setFromCamera(moveMouse, controlsRef.current.object);
    const found = raycaster.intersectObject(result.scene);

    console.log(found[0].point);

    if (found.length > 0) {
      const updateState = annotations.map(annotation => {
        if (annotation.id + 1 === target) {
          return {
            ...annotation,
            lookAt: {
              x: found[0].point.x,
              y: found[0].point.y,
              z: found[0].point.z,
            },
          };
        } else {
          return annotation;
        }
      });
      setAnnotations(updateState);
    }
  };

  const allowDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log(event);
  };

  const dragStart = (event: any) => {
    console.log(event);
  };

  const dragEnd = (event: any) => {
    console.log(event);
  };

  useEffect(() => {
    document.addEventListener("dragstart", dragStart);
    document.addEventListener("dragend", dragEnd);

    return () => {
      document.removeEventListener("dragstart", dragStart);
      document.removeEventListener("dragend", dragEnd);
    };
  }, []);

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
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDragOver={allowDrop}
            onDrop={drop}
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
                result={result}
                annotations={annotations}
                groupRef={groupRef}
              />
            </Stage>

            <OrbitControls ref={controlsRef} />
            {/* <CycleRaycast
              onChanged={(objects, cycle) => console.log(objects, cycle)}
            /> */}
            {annotations.length > 0 &&
              annotations.map((a, i) => {
                return (
                  <Html
                    as="div"
                    key={i}
                    position={[a.lookAt.x, a.lookAt.y, a.lookAt.z]}
                  >
                    <div
                      className="w-34 h-34 cursor-pointer border-2 border-red-400 flex items-center justify-center text-white bg-black"
                      draggable
                      onDragStart={drag}
                    >
                      {i + 1}
                    </div>
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
