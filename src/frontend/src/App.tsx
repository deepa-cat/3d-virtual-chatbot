import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import * as THREE from "three";
import { ChatPanel } from "./components/ChatPanel";
import { GridFloor } from "./components/GridFloor";
import { ParticleSystem } from "./components/ParticleSystem";
import { RobotAvatar } from "./components/RobotAvatar";
import { useChatHistory, useSendMessage } from "./hooks/useQueries";

function Scene({ isTalking }: { isTalking: boolean }) {
  return (
    <>
      {/* Environment & lighting */}
      <color attach="background" args={["#050a18"]} />
      <fog attach="fog" args={["#050a18", 8, 25]} />

      <ambientLight intensity={0.3} color={new THREE.Color(0x1a2560)} />

      {/* Main key light - cyan top */}
      <pointLight
        position={[0, 4, 2]}
        intensity={2.5}
        color={new THREE.Color(0x00d4ff)}
        distance={12}
      />

      {/* Fill light - violet left */}
      <pointLight
        position={[-4, 1, 1]}
        intensity={1.5}
        color={new THREE.Color(0x7b4fff)}
        distance={10}
      />

      {/* Rim light - from behind */}
      <pointLight
        position={[2, -1, -4]}
        intensity={1.2}
        color={new THREE.Color(0x00aacc)}
        distance={8}
      />

      {/* Floor bounce */}
      <pointLight
        position={[0, -2, 0]}
        intensity={0.5}
        color={new THREE.Color(0x003344)}
        distance={6}
      />

      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

      {/* Stars background */}
      <Stars
        radius={80}
        depth={60}
        count={3000}
        factor={4}
        saturation={0.3}
        fade
        speed={0.5}
      />

      {/* Particles */}
      <ParticleSystem />

      {/* Grid floor */}
      <GridFloor />

      {/* Robot */}
      <RobotAvatar isTalking={isTalking} />

      {/* Orbit controls - auto rotate only */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.5}
        target={[0, -0.2, 0]}
      />
    </>
  );
}

export default function App() {
  const { data: messages = [], isLoading } = useChatHistory();
  const sendMessage = useSendMessage();

  const isTalking = sendMessage.isPending;

  async function handleSend(content: string) {
    await sendMessage.mutateAsync(content);
  }

  return (
    <div className="fixed inset-0 bg-[#050a18] overflow-hidden font-body">
      {/* Scan line effect */}
      <div className="scan-line" />

      {/* 3D Canvas - full screen */}
      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: [0, 0.4, 3.5],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          shadows
          dpr={[1, 2]}
        >
          <Scene isTalking={isTalking} />
        </Canvas>
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center px-6 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-center">
            <span className="text-cyan-400 text-sm font-mono font-bold">
              A7
            </span>
          </div>
          <div>
            <h1 className="text-sm font-display font-bold text-foreground tracking-widest uppercase neon-cyan">
              AXIS-7
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
              Neural Interface
            </p>
          </div>
        </div>

        {/* Right: status indicators */}
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400/80 font-mono uppercase tracking-wider">
              System Online
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <span className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-wider">
              Neural Net Active
            </span>
          </div>
        </div>
      </div>

      {/* Chat panel overlay */}
      <div className="absolute right-0 top-14 bottom-0 w-full sm:w-[380px] z-10 flex flex-col">
        <div className="glass-panel h-full flex flex-col m-3 mt-2 rounded-2xl overflow-hidden neon-border">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            isSending={isTalking}
            onSend={handleSend}
          />
        </div>
      </div>

      {/* Bottom corner: branding */}
      <div className="absolute bottom-3 left-4 z-20 hidden sm:block">
        <p className="text-[10px] text-muted-foreground/50">
          © {new Date().getFullYear()} •{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400/60 transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
