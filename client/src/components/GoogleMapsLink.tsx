import React from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, ExternalLink, Navigation } from 'lucide-react'
import { useLocation } from '@/lib/location-context'

interface GoogleMapsLinkProps {
  query: string
  useCurrentLocation?: boolean
  className?: string
}

export default function GoogleMapsLink({ query, useCurrentLocation = false, className = '' }: GoogleMapsLinkProps) {
  const { location, getGoogleMapsUrl, hasLocation } = useLocation()
  
  const generateMapsUrl = () => {
    return getGoogleMapsUrl(query, useCurrentLocation && location !== null)
  }

  const handleClick = () => {
    window.open(generateMapsUrl(), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`inline-flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
          {query}
        </div>
        <div className="flex items-center gap-1 mt-1">
          {useCurrentLocation && hasLocation ? (
            <>
              <Navigation className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400">
                Near your location
              </span>
            </>
          ) : (
            <span className="text-xs text-blue-600 dark:text-blue-400">
              Search on Google Maps
            </span>
          )}
        </div>
      </div>
      
      <Button
        size="sm"
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono px-4 py-2 rounded-md transition-colors duration-200"
      >
        <ExternalLink className="w-3 h-3 mr-1" />
        OPEN MAP
      </Button>
    </div>
  )
}
