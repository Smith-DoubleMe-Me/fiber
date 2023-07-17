'use client'

import { Canvas } from "@react-three/fiber"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-5xl font-bold text-blue-100">Fiber test</h1>
      <div className="w-screen h-screen">
        <Canvas>
          <mesh>
            <boxGeometry />
            <meshStandardMaterial />
          </mesh>
        </Canvas>
      </div>
    </main>
  )
}
