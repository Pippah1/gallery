import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, PerspectiveCamera } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function Gallery() {
  const gltf = useGLTF("/scene.glb");
  return <primitive object={gltf.scene} />;
}

interface CameraStop {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const cameraStops: CameraStop[] = [
  { position: new THREE.Vector3(-2 , 2, -11), target: new THREE.Vector3(-2, -1, -10) },
  { position: new THREE.Vector3(2, 3, 0), target: new THREE.Vector3(6, 0, 0) },
  { position: new THREE.Vector3(5, -2, 0), target: new THREE.Vector3(1, -2, 10) },
  { position: new THREE.Vector3(-12, -2, 0), target: new THREE.Vector3(-10, -2, 10) },
  { position: new THREE.Vector3(-2, -2, -5), target: new THREE.Vector3(-6, -2, -4) },
];


function CameraController({ step }: { step: number }) {
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const currentTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!cam.current) return;

    cam.current.position.lerp(cameraStops[step].position, 0.05);

    currentTarget.current.lerp(cameraStops[step].target, 0.05);
    cam.current.lookAt(currentTarget.current);
  });

  return <PerspectiveCamera ref={cam} makeDefault fov={50} />;
}

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const toggleMusic = () => {
    if (!audioRef.current) {
      const audio = new Audio("/music/backgroundMusic.mp3");
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    if (!playing) {
      audio.loop = true;
      audio.play();
    } else {
      audio.pause();
    }
    setPlaying(!playing);
  };

  return (
    <div className="music-controls">
      <button onClick={toggleMusic}>
        {playing ? "Pause Music" : "Play Music"}
      </button>
    </div>
  );
}


export default function App() {
  const [step, setStep] = useState(0);
  const [day, setDay] = useState(true);

  const next = () => setStep((s) => (s + 1) % cameraStops.length);
  const prev = () => setStep((s) => (s - 1 + cameraStops.length) % cameraStops.length);

  return (
    <>
      <Canvas gl={{ toneMappingExposure: 0.3 }}>
        <Gallery />
        {day ? (
            <Environment files="/hdri/bambanani_sunset_2k.hdr" background />
        ) : (
          <Environment files="/hdri/satara_night_2k.hdr" background />
        )}
        <CameraController step={step} />
      </Canvas>

      <div className="controls">
        <button onClick={prev}>Previous</button>
        <button onClick={next}>Next</button>
      </div>

      <div className="environmentControls">
        <button onClick={() => setDay((d) => !d)}>
            {day ? "Switch to Night 🌙" : "Switch to Day ☀️"}
        </button>
      </div>

      <MusicPlayer/>
    </>
  );
}