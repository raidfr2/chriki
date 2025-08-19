import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qzqldzgbxesvlxkjtxzt.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cWxkemdieGVzdmx4a2p0eHp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ2MDI5MywiZXhwIjoyMDcxMDM2MjkzfQ.jlhWgpIB8rISz3i_ybvmyVNGMh5G_KTl9ydEsitFyCc'

// Server-side Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Client-side compatible instance for user verification
export const supabaseClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cWxkemdieGVzdmx4a2p0eHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjAyOTMsImV4cCI6MjA3MTAzNjI5M30.3fzr9iSmYb-YV2UckwdsXk1f6XkdgXlR-U25JKaZoJU')

// Verify JWT token and get user
export async function verifyUser(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'No valid authorization header' }
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser(token)
    
    if (error || !user) {
      return { user: null, error: error?.message || 'Invalid token' }
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: 'Token verification failed' }
  }
}

// Get user profile from database
export async function getUserProfile(userId: string) {
  try {
    console.log('🔍 [Server] Fetching profile for user:', userId)
    
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle() // Use maybeSingle() to handle no results gracefully

    if (error) {
      console.error('❌ [Server] Error fetching profile:', error)
      return null
    }

    console.log('📊 [Server] Profile fetch result:', profile ? 'Found' : 'Not found')
    return profile
  } catch (error) {
    console.error('❌ [Server] Error fetching profile:', error)
    return null
  }
}
