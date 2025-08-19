import { useAuth } from '@/lib/auth-context'

// Re-export useAuth from the context for easier imports
export { useAuth } from '@/lib/auth-context'

// Custom hook for checking if user is authenticated
export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  return {
    user,
    loading,
    isAuthenticated: !!user && !loading
  }
}

// Custom hook for protected routes
export function useAuthGuard() {
  const { user, loading } = useAuth()
  
  const isAuthenticated = !!user && !loading
  const shouldRedirect = !loading && !user
  
  return {
    user,
    loading,
    isAuthenticated,
    shouldRedirect
  }
}
