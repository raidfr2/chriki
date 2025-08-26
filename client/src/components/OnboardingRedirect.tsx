import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useLocation } from 'wouter'

interface OnboardingRedirectProps {
  children: React.ReactNode
}

export function OnboardingRedirect({ children }: OnboardingRedirectProps) {
  const { user, profile, loading } = useAuth()
  const [location, setLocation] = useLocation()

  useEffect(() => {
    // Don't redirect if still loading or no user
    if (loading || !user) return

    // Don't redirect if already on onboarding page
    if (location === '/onboarding') return

    // Don't redirect if on login or public pages
    const publicPages = ['/', '/login', '/services']
    if (publicPages.includes(location)) return

    // Check if onboarding was already completed (prevents redirect loops)
    const onboardingCompleted = localStorage.getItem('chriki-onboarding-completed')
    if (onboardingCompleted === 'true') return

    // Check if user needs onboarding
    const needsOnboarding = !profile || 
      !profile.full_name || 
      !profile.username ||
      profile.full_name.trim() === '' ||
      profile.username.trim() === ''

    if (needsOnboarding) {
      console.log('🚀 Redirecting to onboarding - user needs to complete profile')
      setLocation('/onboarding')
    }
  }, [user, profile, loading, location, setLocation])

  return <>{children}</>
}
