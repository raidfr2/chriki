import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qzqldzgbxesvlxkjtxzt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cWxkemdieGVzdmx4a2p0eHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjAyOTMsImV4cCI6MjA3MTAzNjI5M30.3fzr9iSmYb-YV2UckwdsXk1f6XkdgXlR-U25JKaZoJU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database schema
export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  email: string | null
  city: string | null
  wilaya: string | null
  avatar_url: string | null
  preferences: Record<string, any>
  created_at: string
}

export interface UserNote {
  id: number
  user_id: string
  key: string
  value: string
  source: string | null
  created_at: string
}
