// Shared types and schemas for the application
import { z } from 'zod'

// Authentication and User Profile Types
export interface User {
  id: string
  email: string
  email_confirmed_at?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  email: string | null
  city: string | null
  wilaya: string | null
  avatar_url: string | null
  preferences: Record<string, any>
  // Location fields
  latitude: number | null
  longitude: number | null
  location_enabled: boolean
  last_location_update: string | null
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

// Zod schemas for validation
export const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().optional(), // Will be set up later in profile
  username: z.string().optional(),
  city: z.string().optional(),
  wilaya: z.string().optional(),
})

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const profileUpdateSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  full_name: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  city: z.string().optional(),
  wilaya: z.string().optional(),
  avatar_url: z.string().url('Please enter a valid URL').optional(),
  preferences: z.record(z.any()).optional(),
  // Location fields
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  location_enabled: z.boolean().optional(),
  last_location_update: z.string().optional(),
})

export type SignUpData = z.infer<typeof signUpSchema>
export type SignInData = z.infer<typeof signInSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

// Authentication state types
export interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
}

// Chat-related types (existing functionality)
export interface ChatMessage {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
  chunks?: string[]
  isFormatted?: boolean
  suggestions?: string[]
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  lastActivity: Date
}

// Location types
export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: number
}

export interface LocationPermission {
  granted: boolean
  denied: boolean
  unavailable: boolean
}
