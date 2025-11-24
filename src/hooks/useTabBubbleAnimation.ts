import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface UseTabBubbleAnimationProps {
  activeTab: string
  tabIdPrefix?: string
  disabled?: boolean
}

export function useTabBubbleAnimation({ 
  activeTab, 
  tabIdPrefix = 'tab',
  disabled = false
}: UseTabBubbleAnimationProps) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const tabsListRef = useRef<HTMLDivElement>(null)

  // Función para animar la burbuja hacia un tab
  const animateBubbleTo = (tabId: string) => {
    if (disabled) return
    const tab = document.getElementById(tabId)
    if (!tab || !bubbleRef.current || !tabsListRef.current) return

    const tabRect = tab.getBoundingClientRect()
    const listRect = tabsListRef.current.getBoundingClientRect()

    gsap.to(bubbleRef.current, {
      x: tabRect.left - listRect.left,
      width: tabRect.width,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  // Posicionar la burbuja inicialmente y cuando cambie la tab activa
  useGSAP(() => {
    if (disabled) return
    const tabId = `${tabIdPrefix}-${activeTab}`
    animateBubbleTo(tabId)
  }, [activeTab, tabIdPrefix, disabled])

  // Configuración inicial de la burbuja
  useGSAP(() => {
    if (disabled) return
    if (bubbleRef.current) {
      gsap.set(bubbleRef.current, {
        opacity: 1,
      })
    }
  }, [disabled])

  const getTabHandlers = (tabValue: string) => {
    if (disabled) return {}
    return {
      onClick: () => animateBubbleTo(`${tabIdPrefix}-${tabValue}`),
      onMouseEnter: () => animateBubbleTo(`${tabIdPrefix}-${tabValue}`),
      onMouseLeave: () => animateBubbleTo(`${tabIdPrefix}-${activeTab}`),
    }
  }

  return {
    bubbleRef,
    tabsListRef,
    animateBubbleTo,
    getTabHandlers,
  }
}
