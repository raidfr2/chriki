import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { LocationData, LocationPermission } from '@shared/schema'
import { useToast } from '@/hooks/use-toast'

interface LocationContextType {
  location: LocationData | null
  permission: LocationPermission
  isLoading: boolean
  error: string | null
  requestLocation: () => Promise<void>
  updateLocation: (lat: number, lng: number) => void
  clearLocation: () => void
  getGoogleMapsUrl: (query: string, useCurrentLocation?: boolean) => string
  hasLocation: boolean
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

interface LocationProviderProps {
  children: React.ReactNode
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [permission, setPermission] = useState<LocationPermission>({
    granted: false,
    denied: false,
    unavailable: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Check if geolocation is supported
  const isGeolocationSupported = () => {
    return 'geolocation' in navigator
  }

  // Get current location permission status
  const getPermissionStatus = useCallback(async (): Promise<LocationPermission> => {
    if (!isGeolocationSupported()) {
      return { granted: false, denied: false, unavailable: true }
    }

    try {
      // Check if we can get the current position without prompting
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 5000, // Increased timeout
          maximumAge: 300000 // 5 minutes cache
        })
      })

      return { granted: true, denied: false, unavailable: false }
    } catch (error: any) {
      console.log('Permission check error:', error.code, error.message)
      if (error.code === 1) {
        // PERMISSION_DENIED
        return { granted: false, denied: true, unavailable: false }
      } else if (error.code === 2) {
        // POSITION_UNAVAILABLE - this might be temporary
        return { granted: false, denied: false, unavailable: false }
      } else {
        // TIMEOUT or other errors
        return { granted: false, denied: false, unavailable: false }
      }
    }
  }, [])

  // Request location permission and get current location
  const requestLocation = useCallback(async () => {
    if (!isGeolocationSupported()) {
      setError('Geolocation is not supported in this browser')
      setPermission({ granted: false, denied: false, unavailable: true })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false, // Changed to false for better compatibility
          timeout: 15000, // Increased timeout
          maximumAge: 300000 // 5 minutes cache
        })
      })

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      }

      setLocation(locationData)
      setPermission({ granted: true, denied: false, unavailable: false })
      
      // Save to localStorage
      localStorage.setItem('chriki-user-location', JSON.stringify(locationData))
      
      toast({
        title: "Location updated!",
        description: "Your location has been saved for better assistance.",
      })

    } catch (error: any) {
      console.error('Location error:', error)
      
      if (error.code === 1) {
        setError('Location permission denied. Please enable location access in your browser settings.')
        setPermission({ granted: false, denied: true, unavailable: false })
        toast({
          title: "Location permission denied",
          description: "Please enable location access in your browser settings to get location-based assistance.",
          variant: "destructive"
        })
      } else if (error.code === 2) {
        setError('Location information is temporarily unavailable. This might be due to network issues or GPS signal.')
        setPermission({ granted: false, denied: false, unavailable: false })
        toast({
          title: "Location unavailable",
          description: "Unable to get your location. This might be due to network issues or GPS signal. You can still use location features with manual coordinates.",
          variant: "destructive"
        })
      } else if (error.code === 3) {
        setError('Location request timed out. Please try again.')
        toast({
          title: "Location timeout",
          description: "Location request took too long. Please try again or check your internet connection.",
          variant: "destructive"
        })
      } else {
        setError('Failed to get your location. Please try again.')
        toast({
          title: "Location error",
          description: "An unexpected error occurred while getting your location. Please try again.",
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Update location manually (for testing or manual input)
  const updateLocation = useCallback((lat: number, lng: number) => {
    const locationData: LocationData = {
      latitude: lat,
      longitude: lng,
      timestamp: Date.now()
    }
    
    setLocation(locationData)
    setPermission({ granted: true, denied: false, unavailable: false })
    localStorage.setItem('chriki-user-location', JSON.stringify(locationData))
  }, [])

  // Clear location data
  const clearLocation = useCallback(() => {
    setLocation(null)
    setPermission({ granted: false, denied: false, unavailable: false })
    localStorage.removeItem('chriki-user-location')
  }, [])

  // Generate Google Maps URL
  const getGoogleMapsUrl = useCallback((query: string, useCurrentLocation: boolean = false): string => {
    const baseUrl = 'https://www.google.com/maps/search/'
    
    if (useCurrentLocation && location) {
      // Use current location with query
      return `${baseUrl}${encodeURIComponent(query)}/@${location.latitude},${location.longitude},15z`
    } else {
      // General search
      return `${baseUrl}${encodeURIComponent(query)}`
    }
  }, [location])

  // Initialize location on mount
  useEffect(() => {
    const initializeLocation = async () => {
      // Check for saved location first
      const savedLocation = localStorage.getItem('chriki-user-location')
      if (savedLocation) {
        try {
          const locationData = JSON.parse(savedLocation)
          setLocation(locationData)
          console.log('📍 Loaded saved location:', locationData)
        } catch (error) {
          console.error('Failed to parse saved location:', error)
          localStorage.removeItem('chriki-user-location')
        }
      }

      // Check permission status
      try {
        const permissionStatus = await getPermissionStatus()
        setPermission(permissionStatus)
        console.log('🔐 Location permission status:', permissionStatus)
      } catch (error) {
        console.error('Failed to check location permission:', error)
      }
    }

    initializeLocation()
  }, [getPermissionStatus])

  const value: LocationContextType = {
    location,
    permission,
    isLoading,
    error,
    requestLocation,
    updateLocation,
    clearLocation,
    getGoogleMapsUrl,
    hasLocation: location !== null
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}
