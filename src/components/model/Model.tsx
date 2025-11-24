import { useGLTF } from "@react-three/drei"
import { memo, useMemo } from "react"
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js"
import useMediaQuery from '@/hooks/useMediaQuery'
import * as THREE from "three"

function Model() {
  const { scene } = useGLTF('/model/house.glb')
  const isMobile = useMediaQuery()
  
  // Clonamos la escena para evitar problemas de instancias múltiples
  const clonedScene = useMemo(() => {
    const cloned = clone(scene)
    
    // Optimizaciones del modelo
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Habilitar frustum culling para mejor performance
        child.frustumCulled = true
        
        const material = child.material
        
        // Optimizar materiales si existen
        if (material) {
          // Manejar arrays de materiales
          const materials = Array.isArray(material) ? material : [material]
          
          materials.forEach((mat) => {
            // En móvil, reducir drásticamente la calidad del material
            if (isMobile) {
              // Cambiar a materiales más simples en móvil
              if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                // Reducir calidad de texturas
                if (mat.map) {
                  mat.map.minFilter = THREE.LinearFilter
                  mat.map.magFilter = THREE.LinearFilter
                  mat.map.anisotropy = 1
                }
                
                // Simplificar cálculos de materiales
                mat.roughness = Math.max(mat.roughness ?? 0.5, 0.5)
                mat.metalness = Math.min(mat.metalness ?? 0, 0.5)
                
                // Desactivar características costosas
                mat.envMapIntensity = mat.envMapIntensity ? mat.envMapIntensity * 0.5 : 0.5
              }
              
              // Desactivar sombras en móvil
              child.castShadow = false
              child.receiveShadow = false
            } else {
              // Configurar shadows de manera más eficiente
              child.castShadow = true
              child.receiveShadow = true
            }
            
            // Deshabilitar actualizaciones innecesarias del material
            mat.needsUpdate = false
          })
        }
        
        // Simplificar geometrías en móvil si es posible
        if (isMobile && child.geometry) {
          child.geometry.computeBoundingSphere()
          child.geometry.computeBoundingBox()
        }
      }
    })
    
    return cloned
  }, [scene, isMobile])
  
  return <primitive object={clonedScene} dispose={null} />
}

// Memoizar el componente para evitar re-renders innecesarios
export default memo(Model)

// Precargar el modelo con configuraciones optimizadas
useGLTF.preload('/model/house.glb')