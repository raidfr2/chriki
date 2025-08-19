import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { User, Profile, SignUpData, SignInData, ProfileUpdateData } from '@shared/schema'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (data: SignUpData) => Promise<{ user: User | null; error: AuthError | null }>
  signIn: (data: SignInData) => Promise<{ user: User | null; error: AuthError | null }>
  signOut: () => Promise<void>
  updateProfile: (data: ProfileUpdateData) => Promise<{ profile: Profile | null; error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(() => {
    // Initialize profile from cache
    try {
      const cached = localStorage.getItem('chriki-profile-cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Cache management functions
  const cacheProfile = (profileData: Profile | null) => {
    try {
      if (profileData) {
        localStorage.setItem('chriki-profile-cache', JSON.stringify(profileData))
        console.log('💾 Profile cached successfully')
      } else {
        localStorage.removeItem('chriki-profile-cache')
        console.log('🗑️ Profile cache cleared')
      }
    } catch (error) {
      console.error('❌ Error caching profile:', error)
    }
  }

  const getCachedProfile = (userId: string): Profile | null => {
    try {
      const cached = localStorage.getItem('chriki-profile-cache')
      if (cached) {
        const profileData = JSON.parse(cached)
        // Verify the cached profile belongs to the current user
        if (profileData.id === userId) {
          console.log('📋 Using cached profile for user:', userId)
          return profileData
        } else {
          console.log('🔄 Cached profile is for different user, clearing cache')
          localStorage.removeItem('chriki-profile-cache')
        }
      }
    } catch (error) {
      console.error('❌ Error reading profile cache:', error)
    }
    return null
  }

  // Enhanced setProfile that automatically caches
  const setProfileWithCache = (profileData: Profile | null) => {
    setProfile(profileData)
    cacheProfile(profileData)
  }

  // Convert Supabase user to our User type
  const convertUser = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email!,
    email_confirmed_at: supabaseUser.email_confirmed_at,
    created_at: supabaseUser.created_at,
    updated_at: supabaseUser.updated_at || supabaseUser.created_at
  })

  // Fetch user profile from database (with caching)
  const fetchProfile = async (userId: string, forceRefresh = false): Promise<Profile | null> => {
    try {
      console.log('🔍 Fetching profile for user:', userId)
      
      // Check cache first (unless force refresh is requested)
      if (!forceRefresh) {
        const cachedProfile = getCachedProfile(userId)
        if (cachedProfile) {
          return cachedProfile
        }
      }

      console.log('🌐 Fetching fresh profile from database...')
      
      // Check if we have a valid session before fetching
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (!currentSession) {
        console.log('⚠️ No active session, skipping profile fetch')
        return null
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Use maybeSingle() to handle no results gracefully

      if (error) {
        console.error('❌ Error fetching profile:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })

        // If it's an auth error, the session might be invalid
        if (error.message?.includes('JWT') || error.code === 'PGRST301') {

          console.log('🔄 Auth error detected, refreshing session...')
          await supabase.auth.refreshSession()
        }
        
        return null
      }

      console.log('📊 Profile fetch result:', data ? 'Found' : 'Not found')
      
      // Cache the fresh data
      if (data) {
        cacheProfile(data)
      }
      
      return data
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
      return null
    }
  }

  // Create minimal profile when user signs up (they'll complete it later)
  const createProfile = async (userId: string, userData: Partial<SignUpData>): Promise<Profile | null> => {
    try {
      // Since we have a database trigger that creates profiles automatically,
      // we don't need to create the profile manually here.
      // The trigger handles the basic profile creation.
      console.log('Profile creation handled by database trigger for user:', userId)
      return null // Profile will be created by trigger
    } catch (error) {
      console.error('Error in createProfile:', error)
      return null
    }
  }

  // Update user profile (with upsert logic)
  const updateProfile = async (data: ProfileUpdateData): Promise<{ profile: Profile | null; error: Error | null }> => {
    if (!user) {
      return { profile: null, error: new Error('User not authenticated') }
    }

    try {
      console.log('🔄 Updating profile for user:', user.id, data)
      
      // First, try to update existing profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .maybeSingle() // Use maybeSingle() instead of single() to handle no results

      if (updateError) {
        console.error('❌ Profile update error:', updateError)
        return { profile: null, error: new Error(updateError.message) }
      }

      // If update was successful and returned a profile
      if (updatedProfile) {
        console.log('✅ Profile updated successfully')
        setProfileWithCache(updatedProfile)
        return { profile: updatedProfile, error: null }
      }

             // If no profile was found to update, create a new one (upsert behavior)
       console.log('📝 No existing profile found, creating new one...')
       const profileData = {
         id: user.id,
         username: data.username || null,
         full_name: data.full_name || null,
         email: user.email,
         city: data.city || null,
         wilaya: data.wilaya || null,
         avatar_url: data.avatar_url || null,
         preferences: data.preferences || {}
       }

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()

      if (createError) {
        console.error('❌ Profile creation error:', createError)
        return { profile: null, error: new Error(createError.message) }
      }

      console.log('✅ Profile created successfully')
             setProfileWithCache(newProfile)
      return { profile: newProfile, error: null }
    } catch (error) {
      console.error('❌ Profile update/create error:', error)
      return { profile: null, error: error as Error }
    }
  }

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user) {
      console.log('⚠️ No user found, cannot refresh profile')
      return
    }
    
    console.log('🔄 Manually refreshing profile...')
    const profileData = await fetchProfile(user.id, true) // Force refresh
    setProfileWithCache(profileData)
    
    if (profileData) {
      console.log('✅ Profile refreshed successfully')
    } else {
      console.log('❌ Failed to refresh profile')
    }
  }

  // Sign up function
  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true)
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        })
        return { user: null, error }
      }

      if (authData.user) {
        const user = convertUser(authData.user)
        
        // Create profile for new user
        await createProfile(user.id, data)
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        })
        
        return { user, error: null }
      }

      return { user: null, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  // Sign in function
  const signIn = async (data: SignInData) => {
    try {
      setLoading(true)
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        })
        return { user: null, error }
      }

      if (authData.user) {
        const user = convertUser(authData.user)
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
        return { user, error: null }
      }

      return { user: null, error: null }
    } catch (error) {
      return { user: null, error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        })
      } else {
        setUser(null)
        setProfileWithCache(null) // This will clear the cache
        setSession(null)
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        })
      }
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initialize auth state and listen for changes
  useEffect(() => {
    let mounted = true

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (mounted && session?.user) {
          const user = convertUser(session.user)
          setUser(user)
          setSession(session)
          
          // Fetch user profile
          const profileData = await fetchProfile(user.id)
          setProfileWithCache(profileData)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('🔄 Auth state changed:', event, session ? 'Session exists' : 'No session')

        setSession(session)
        
        if (session?.user) {
          console.log('👤 Setting user from auth change')
          const user = convertUser(session.user)
          setUser(user)
          
          // Fetch user profile with retry logic
          let retryCount = 0
          const maxRetries = 3
          let profileData = null
          
          while (retryCount < maxRetries && !profileData) {
            if (retryCount > 0) {
              console.log(`🔄 Retrying profile fetch (attempt ${retryCount + 1}/${maxRetries})`)
              // Wait a bit before retrying
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
            }
            
            profileData = await fetchProfile(user.id)
            retryCount++
            
            if (!profileData && retryCount < maxRetries) {
              console.log('⏳ Profile not found, will retry...')
            }
          }
          
          setProfileWithCache(profileData)
          
          if (!profileData) {
            console.log('⚠️ Could not fetch profile after retries')
          }
        } else {
          console.log('🚪 Clearing user from auth change')
          setUser(null)
          setProfileWithCache(null) // This will clear the cache
        }
        
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
