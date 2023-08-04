"use client";

import { useState, useRef, forwardRef, Dispatch, SetStateAction } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const Viewer3D = ({
  capturing,
  setCapturing,
  capture,
  isRotating,
  setIsRotating,
  onClickGroup,
  result,
  groupRef,
  setAnnotations,
  annotations,
  isDraggable,
  setIsDraggable,
  selected,
}: {
  capturing: boolean;
  setCapturing: (capture: boolean) => void;
  capture: () => void;
  isRotating: boolean;
  setIsRotating: (rotate: boolean) => void;
  onClickGroup: (e: ThreeEvent<MouseEvent>) => void;
  result: GLTF;
  annotations: any[];
  groupRef: any;
  setAnnotations: Dispatch<SetStateAction<any[]>>;
  isDraggable: boolean;
  setIsDraggable: Dispatch<SetStateAction<boolean>>;
  selected: number;
}) => {
  result.scene.updateMatrixWorld();

  const modelRef = useRef<any>();

  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [isMouseOverModel, setIsMouseOverModel] = useState<boolean>(false);

  const rotationSpeed = 0.01;
  const snapshotAngleInterval = (24 * Math.PI) / 180; // 24도

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDraggable) return;

    const { intersections } = e;
    const intersect = intersections[0].point;

    if (intersections.length > 0) {
      const updateState = annotations.map(annotation => {
        if (annotation.id + 1 === selected) {
          return {
            ...annotation,
            lookAt: {
              x: intersect.x,
              y: intersect.y,
              z: intersect.z,
            },
          };
        } else {
          return annotation;
        }
      });

      setAnnotations(updateState);
    }
  };

  useFrame(() => {
    if (modelRef.current && capturing && isRotating) {
      if (modelRef.current.rotation.y === 0) {
        capture();
      }

      modelRef.current.rotation.y += rotationSpeed;

      if (modelRef.current.rotation.y >= currentAngle + snapshotAngleInterval) {
        setCurrentAngle(modelRef.current.rotation.y);
        capture();
      }

      if (currentAngle >= Math.PI * 2) {
        setIsRotating(false);
        setCapturing(false);
        setCurrentAngle(0);
        modelRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <group
      onClick={onClickGroup}
      dispose={null}
      ref={groupRef}
      onPointerOver={() => setIsMouseOverModel(true)}
      onPointerOut={() => setIsMouseOverModel(false)}
      onPointerMove={handlePointerMove}
    >
      <primitive object={result.scene} ref={modelRef} />
    </group>
  );
};

export default forwardRef(Viewer3D);
