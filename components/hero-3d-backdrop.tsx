"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { DoubleSide, Group, MathUtils, type Mesh } from "three";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function GateOrbit({
  mouseRef,
}: {
  mouseRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const rig = useRef<Group | null>(null);
  const ring = useRef<Mesh | null>(null);
  const inner = useRef<Mesh | null>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouse = mouseRef.current;

    if (ring.current) {
      ring.current.rotation.z = t * 0.22;
      ring.current.rotation.x = Math.sin(t * 0.22) * 0.12;
    }
    if (inner.current) {
      inner.current.rotation.z = -t * 0.28;
      inner.current.rotation.y = t * 0.18;
    }
    if (rig.current) {
      const targetY = mouse.y * 0.22;
      const targetX = mouse.x * 0.22;
      rig.current.rotation.y = MathUtils.lerp(rig.current.rotation.y, targetX, 0.06);
      rig.current.rotation.x = MathUtils.lerp(rig.current.rotation.x, -targetY, 0.06);
      rig.current.position.x = MathUtils.lerp(rig.current.position.x, mouse.x * 0.3, 0.06);
      rig.current.position.y = MathUtils.lerp(rig.current.position.y, mouse.y * 0.18, 0.06);
    }
  });

  return (
    <group ref={rig} position={[1.1, 0.1, 0]} scale={1.05}>
      <mesh ref={ring}>
        <torusGeometry args={[1.25, 0.08, 22, 120]} />
        <meshStandardMaterial
          color="#2563eb"
          metalness={0.65}
          roughness={0.18}
          emissive="#0ea5e9"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh ref={inner}>
        <torusGeometry args={[0.78, 0.06, 18, 100]} />
        <meshStandardMaterial
          color="#06b6d4"
          metalness={0.6}
          roughness={0.16}
          emissive="#22d3ee"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-0.2, -0.15, -0.15]}>
        <icosahedronGeometry args={[0.36, 1]} />
        <meshStandardMaterial
          color="#0ea5e9"
          metalness={0.4}
          roughness={0.22}
          emissive="#38bdf8"
          emissiveIntensity={0.18}
        />
      </mesh>
    </group>
  );
}

function Particles() {
  const group = useRef<Group | null>(null);

  const points = useMemo(() => {
    const count = 26;
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2;
      const r = 1.55 + (i % 4) * 0.22;
      return {
        key: i,
        position: [Math.cos(a) * r - 0.4, Math.sin(a) * r * 0.55, -0.8] as [
          number,
          number,
          number,
        ],
        scale: 0.055 + (i % 5) * 0.012,
        color: i % 3 === 0 ? "#67e8f9" : i % 3 === 1 ? "#38bdf8" : "#a5b4fc",
      };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) group.current.rotation.z = t * 0.08;
  });

  return (
    <group ref={group}>
      {points.map((p) => (
        <mesh key={p.key} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 18, 18]} />
          <meshStandardMaterial
            color={p.color}
            roughness={0.08}
            metalness={0.18}
            emissive={p.color}
            emissiveIntensity={0.22}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneRig() {
  const { pointer } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    mouse.current.x = pointer.x;
    mouse.current.y = pointer.y;
  });

  return (
    <>
      <Float speed={1.15} rotationIntensity={0.35} floatIntensity={0.35}>
        <GateOrbit mouseRef={mouse} />
      </Float>
      <Particles />
      <Sphere args={[22, 48, 48]} scale={1} position={[0, 0, -12]}>
        <meshStandardMaterial
          color="#0b1220"
          metalness={0}
          roughness={1}
          emissive="#0ea5e9"
          emissiveIntensity={0.1}
          side={DoubleSide}
        />
      </Sphere>
    </>
  );
}

export function Hero3DBackdrop({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const first = args[0];
      if (typeof first === "string" && first.includes("THREE.Clock")) return;
      originalWarn(...args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  if (reducedMotion) {
    return (
      <div
        className={className}
        aria-hidden
        style={{
          background:
            "radial-gradient(900px 420px at 70% 35%, rgba(34,211,238,0.22), transparent 55%), radial-gradient(760px 420px at 80% 65%, rgba(37,99,235,0.18), transparent 60%)",
        }}
      />
    );
  }

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 4, 4]} intensity={0.9} />
        <pointLight position={[-3.2, -1.2, 3]} intensity={0.5} color="#22d3ee" />
        <SceneRig />
      </Canvas>
    </div>
  );
}

