"use client";

import { useGLTF, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const Center3D = () => {
  const modelRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const modelDistance = 5; // 모델과 카메라 사이의 거리 설정
  const modelScale = 1; // 모델의 크기를 조정할 스케일 값 설정
  const path = "/models/test3.glb";

  const result = useGLTF(path);

  // 모델의 기하학적 중심을 계산하여 중심축 정렬하는 함수
  const centerModel = () => {
    const boundingBox = new THREE.Box3().setFromObject(modelRef.current);
    const center = boundingBox.getCenter(new THREE.Vector3());

    // 모델의 중심을 원점(0, 0, 0)으로 이동
    modelRef.current.position.sub(center);
  };

  // useFrame 훅을 사용하여 애니메이션 및 각 프레임마다 수행할 작업 처리
  useFrame(() => {
    centerModel();
    cameraRef.current.position.copy(modelRef.current.position);
    cameraRef.current.translateZ(modelDistance);
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        fov={45}
        aspect={1200 / 600}
        near={0.1}
        far={1000}
        position={[7, 3, 7]}
      />
      <group
        ref={modelRef}
        scale={[modelScale, modelScale, modelScale]}
        position={[0, -1, 0]}
      >
        <primitive object={result.scene} />
      </group>
      <OrbitControls />
    </>
  );
};

export default Center3D;
