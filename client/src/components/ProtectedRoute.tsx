import { useAuth } from '@/hooks/use-auth'
import { useLocation } from 'wouter'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [, navigate] = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="font-mono text-lg mb-4">LOADING.CHRIKI...</div>
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto"></div>
          
          {/* Fallback refresh option after a few seconds */}
          <div className="mt-8">
            <button 
              onClick={() => window.location.reload()} 
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              // CLICK.TO.REFRESH
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || null
  }

  return <>{children}</>
}
