import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTutorial } from '@/lib/tutorial-context'
import { X, ArrowLeft, ArrowRight, Play } from 'lucide-react'

export default function TutorialOverlay() {
  const { 
    isActive, 
    currentStep, 
    steps, 
    nextStep, 
    prevStep, 
    skipTutorial, 
    completeTutorial,
    highlightTarget 
  } = useTutorial()

  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [tooltipSize, setTooltipSize] = useState<{ width: number; height: number }>({ width: 350, height: 200 })

  useEffect(() => {
    const updateRect = () => {
      if (!highlightTarget) return
      const element = document.querySelector(highlightTarget)
      if (element) {
        const rect = element.getBoundingClientRect()
        setHighlightRect(rect)
      }
    }

    if (highlightTarget && isActive) {
      const element = document.querySelector(highlightTarget)
      if (element) {
        // Initial measure
        updateRect()
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        })
        // Recalculate after scroll settles
        const t = setTimeout(() => updateRect(), 350)
        // Listen for scroll/resize to keep alignment stable
        const onScroll = () => requestAnimationFrame(updateRect)
        const onResize = () => requestAnimationFrame(updateRect)
        window.addEventListener('scroll', onScroll, true)
        window.addEventListener('resize', onResize)
        return () => {
          clearTimeout(t)
          window.removeEventListener('scroll', onScroll, true)
          window.removeEventListener('resize', onResize)
        }
      }
    } 

    setHighlightRect(null)
  }, [highlightTarget, isActive, currentStep])

  // Measure tooltip actual size for precise placement
  useLayoutEffect(() => {
    if (!isActive) return
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect()
      setTooltipSize({ width: rect.width, height: rect.height })
    }
  }, [isActive, currentStep])

  if (!isActive || !steps[currentStep]) return null

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  const getTooltipPosition = () => {
    if (!highlightRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

    const padding = 20
    const tooltipWidth = tooltipSize.width || 350
    const tooltipHeight = tooltipSize.height || 200
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let position = { top: 0, left: 0, transform: 'none' }

    switch (step.position) {
      case 'top':
        position.top = highlightRect.top - tooltipHeight - padding
        position.left = highlightRect.left + (highlightRect.width / 2) - (tooltipWidth / 2)
        
        // Check if tooltip goes above viewport
        if (position.top < padding) {
          position.top = highlightRect.bottom + padding
        }
        break

      case 'bottom':
        position.top = highlightRect.bottom + padding
        position.left = highlightRect.left + (highlightRect.width / 2) - (tooltipWidth / 2)
        
        // Check if tooltip goes below viewport
        if (position.top + tooltipHeight > viewportHeight - padding) {
          position.top = highlightRect.top - tooltipHeight - padding
        }
        break

      case 'left':
        position.top = highlightRect.top + (highlightRect.height / 2) - (tooltipHeight / 2)
        position.left = highlightRect.left - tooltipWidth - padding
        
        // Check if tooltip goes left of viewport
        if (position.left < padding) {
          position.left = highlightRect.right + padding
        }
        break

      case 'right':
        position.top = highlightRect.top + (highlightRect.height / 2) - (tooltipHeight / 2)
        position.left = highlightRect.right + padding
        
        // Check if tooltip goes right of viewport
        if (position.left + tooltipWidth > viewportWidth - padding) {
          position.left = highlightRect.left - tooltipWidth - padding
        }
        break

      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }

    // Ensure tooltip stays within horizontal bounds
    if (position.left < padding) {
      position.left = padding
    } else if (position.left + tooltipWidth > viewportWidth - padding) {
      position.left = viewportWidth - tooltipWidth - padding
    }

    // Ensure tooltip stays within vertical bounds
    if (position.top < padding) {
      position.top = padding
    } else if (position.top + tooltipHeight > viewportHeight - padding) {
      position.top = viewportHeight - tooltipHeight - padding
    }

    return position
  }

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            style={{ pointerEvents: 'none' }}
          />

          {/* Highlight spotlight */}
          {highlightRect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-50 pointer-events-none"
              style={{
                top: highlightRect.top - 8,
                left: highlightRect.left - 8,
                width: highlightRect.width + 16,
                height: highlightRect.height + 16,
                boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
                borderRadius: '8px',
              }}
            />
          )}

          {/* Tutorial tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 bg-background border-2 border-foreground rounded-lg shadow-2xl"
            style={{
              ...getTooltipPosition(),
              maxWidth: '360px',
            }}
            ref={tooltipRef}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-500" />
                  <span className="font-mono text-xs text-muted-foreground">
                    STEP {currentStep + 1} OF {steps.length}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={skipTutorial}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="font-mono text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {step.actionText && (
                  <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/30 rounded text-xs text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    💡 {step.actionText}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="text-xs font-mono"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  BACK
                </Button>

                <div className="flex gap-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentStep 
                          ? 'bg-blue-500' 
                          : index < currentStep 
                          ? 'bg-green-500' 
                          : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  size="sm"
                  onClick={isLastStep ? completeTutorial : nextStep}
                  className="text-xs font-mono"
                >
                  {isLastStep ? 'FINISH' : step.nextText || 'NEXT'}
                  {!isLastStep && <ArrowRight className="w-3 h-3 ml-1" />}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
