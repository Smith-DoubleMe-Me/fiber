"use client";

import { useState, useRef, forwardRef } from "react";
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
}) => {
  const path = "/models/test1.glb";

  result.scene.updateMatrixWorld();

  const modelRef = useRef<any>();

  const [currentAngle, setCurrentAngle] = useState<number>(0);

  const rotationSpeed = 0.01;
  const snapshotAngleInterval = (24 * Math.PI) / 180; // 24도

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

  // useEffect(() => {
  //   if (annotations.length > 0) {
  //     const geometry = new THREE.BufferGeometry();
  //     const material = new THREE.PointsMaterial({ color: 0xff0000, size: 10 });
  //     const positions = new Float32Array([0, 0, 0]);
  //     geometry.setAttribute(
  //       "position",
  //       new THREE.BufferAttribute(positions, 3),
  //     );

  //     annotations.map((a, i) => {
  //       const points = new THREE.Points(geometry, material);
  //       points.position.set(a.lookAt.x, a.lookAt.y, a.lookAt.z);
  //       result.scene.add(points);
  //     });
  //   }
  // }, [annotations]);

  return (
    <group onClick={onClickGroup} dispose={null} ref={groupRef}>
      <primitive object={result.scene} ref={modelRef} />
    </group>
  );
};

export default forwardRef(Viewer3D);
