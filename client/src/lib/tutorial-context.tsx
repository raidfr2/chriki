import React, { createContext, useContext, useState, useCallback } from 'react'

export interface TutorialStep {
  id: string
  title: string
  description: string
  target: string // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: 'click' | 'type' | 'wait'
  actionText?: string
  nextText?: string
  skipable?: boolean
}

interface TutorialContextType {
  isActive: boolean
  currentStep: number
  steps: TutorialStep[]
  startTutorial: (steps: TutorialStep[]) => void
  nextStep: () => void
  prevStep: () => void
  skipTutorial: () => void
  completeTutorial: () => void
  highlightTarget: string | null
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined)

export function useTutorial() {
  const context = useContext(TutorialContext)
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider')
  }
  return context
}

interface TutorialProviderProps {
  children: React.ReactNode
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<TutorialStep[]>([])

  const startTutorial = useCallback((tutorialSteps: TutorialStep[]) => {
    setSteps(tutorialSteps)
    setCurrentStep(0)
    setIsActive(true)
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      const next = prev + 1
      if (next >= steps.length) {
        setIsActive(false)
        return 0
      }
      return next
    })
  }, [steps.length])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }, [])

  const skipTutorial = useCallback(() => {
    setIsActive(false)
    setCurrentStep(0)
  }, [])

  const completeTutorial = useCallback(() => {
    setIsActive(false)
    setCurrentStep(0)
    // Save completion status to localStorage
    localStorage.setItem('chriki-tutorial-completed', 'true')
  }, [])

  const highlightTarget = isActive && steps[currentStep] ? steps[currentStep].target : null

  const value: TutorialContextType = {
    isActive,
    currentStep,
    steps,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial,
    highlightTarget
  }

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}
