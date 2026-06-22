"use client";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { useIsMobile } from "../../hooks/useIsMobile";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function BackgroundCanvas() {
  const mobile = useIsMobile();

  if (mobile) {
    // static fallback gradient
    return (
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(60% 50% at 50% 30%, rgba(139,92,246,0.22), transparent 70%), radial-gradient(50% 50% at 70% 80%, rgba(236,72,153,0.18), transparent 70%), #0a0a0a" }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
