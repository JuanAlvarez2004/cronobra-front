import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface UseTabBubbleAnimationProps {
  activeTab: string
  tabIdPrefix?: string
}

export function useTabBubbleAnimation({ 
  activeTab, 
  tabIdPrefix = 'tab' 
}: UseTabBubbleAnimationProps) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const tabsListRef = useRef<HTMLDivElement>(null)

  // Función para animar la burbuja hacia un tab
  const animateBubbleTo = (tabId: string) => {
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
    const tabId = `${tabIdPrefix}-${activeTab}`
    animateBubbleTo(tabId)
  }, [activeTab, tabIdPrefix])

  // Configuración inicial de la burbuja
  useGSAP(() => {
    if (bubbleRef.current) {
      gsap.set(bubbleRef.current, {
        opacity: 1,
      })
    }
  }, [])

  const getTabHandlers = (tabValue: string) => ({
    onClick: () => animateBubbleTo(`${tabIdPrefix}-${tabValue}`),
    onMouseEnter: () => animateBubbleTo(`${tabIdPrefix}-${tabValue}`),
    onMouseLeave: () => animateBubbleTo(`${tabIdPrefix}-${activeTab}`),
  })

  return {
    bubbleRef,
    tabsListRef,
    animateBubbleTo,
    getTabHandlers,
  }
}
