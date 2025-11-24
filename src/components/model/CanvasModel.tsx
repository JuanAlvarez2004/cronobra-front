import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Environment, OrbitControls, useProgress } from "@react-three/drei";
import { forwardRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Group } from "three";

interface SceneContentProps {
  modelRef: React.ForwardedRef<Group>;
  onModelReady?: (model: Group) => void;
}

// Componente interno que monitorea el progreso de carga
function SceneContent({ modelRef, onModelReady }: SceneContentProps) {
  const { active } = useProgress()

  useEffect(() => {
    // Cuando active es false, significa que todos los assets terminaron de cargar
    if (!active && modelRef && typeof modelRef !== 'function' && modelRef.current && onModelReady) {
      // Pequeño delay para asegurar que todo esté renderizado en el DOM
      const timer = setTimeout(() => {
        if (modelRef && typeof modelRef !== 'function' && modelRef.current) {
          onModelReady(modelRef.current)
        }
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [active, modelRef, onModelReady])

  useGSAP(() => {
    if (active) return
    if (!modelRef || typeof modelRef === 'function' || !modelRef.current) return

    gsap.from(modelRef.current.position, {
      y: -3,
      z: -5,
      duration: 3,
      delay: .3,
      ease: "power2.out",
    })
  }, [active, modelRef])

  return (
    <>
      <Environment
        preset="forest"
        background={false}
      />

      <group
        position={[0, -1, 0]}
        rotation={[0, 0, 0]}
        scale={0.6}
        ref={modelRef}
      >
        <OrbitControls />
        <Model />
      </group>
    </>
  )
}

interface CanvasModelProps {
  onModelReady?: (model: Group) => void;
}

const CanvasModel = forwardRef<Group, CanvasModelProps>(({ onModelReady }, ref) => {
  const isMobile = useMediaQuery()

  return (
    <div id="canvas-container" className='w-full h-[70dvh]' >
      <Canvas
        dpr={isMobile ? [0.5, 1.2] : [1, 2]}
        camera={{
          fov: 75,
        }}
        performance={{ min: 0.5 }}
        frameloop="always"
        gl={{
          alpha: true,
          stencil: false,
          depth: true,
        }}
      >
        <SceneContent modelRef={ref} onModelReady={onModelReady} />
      </Canvas>
    </div>
  )
})

CanvasModel.displayName = 'CanvasModel'

export default CanvasModel
