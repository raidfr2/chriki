import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocation } from '@/lib/location-context'
import { MapPin, Navigation, X, Loader2, Settings } from 'lucide-react'

export default function LocationStatus() {
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  
  const { 
    location, 
    permission, 
    isLoading, 
    error, 
    requestLocation, 
    clearLocation,
    updateLocation,
    hasLocation 
  } = useLocation()

  const getStatusText = () => {
    if (isLoading) return 'Getting location...'
    if (error) return 'Location error'
    if (hasLocation) return 'Location available'
    if (permission.denied) return 'Location denied'
    if (permission.unavailable) return 'Location unavailable'
    return 'Location not set'
  }

  const getStatusColor = () => {
    if (isLoading) return 'text-yellow-600'
    if (error || permission.denied) return 'text-red-600'
    if (hasLocation) return 'text-green-600'
    return 'text-gray-600'
  }

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />
    if (hasLocation) return <MapPin className="w-4 h-4" />
    if (permission.denied) return <X className="w-4 h-4" />
    return <Navigation className="w-4 h-4" />
  }

  const handleManualLocation = () => {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)
    
    if (isNaN(lat) || isNaN(lng)) {
      return
    }
    
    updateLocation(lat, lng)
    setShowManualInput(false)
    setManualLat('')
    setManualLng('')
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className={`text-xs font-mono ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {hasLocation && (
        <div className="text-xs text-muted-foreground font-mono">
          {location?.latitude?.toFixed(4)}, {location?.longitude?.toFixed(4)}
        </div>
      )}
      
      <div className="flex gap-1 ml-auto">
        {!hasLocation && !permission.denied && !isLoading && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={requestLocation}
              className="h-6 px-2 text-xs font-mono"
              disabled={isLoading}
            >
              ENABLE
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowManualInput(!showManualInput)}
              className="h-6 px-2 text-xs font-mono"
              title="Manual location"
            >
              <Settings className="w-3 h-3" />
            </Button>
          </>
        )}
        
        {hasLocation && (
          <Button
            size="sm"
            variant="outline"
            onClick={clearLocation}
            className="h-6 px-2 text-xs font-mono text-red-600 hover:text-red-700"
          >
            CLEAR
          </Button>
        )}
      </div>
      
      {/* Manual Location Input */}
      {showManualInput && (
        <div className="mt-2 p-2 bg-muted/30 rounded border border-border">
          <div className="text-xs font-mono text-muted-foreground mb-2">
            Manual Location (for testing)
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Latitude"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              className="h-6 text-xs"
              step="any"
            />
            <Input
              type="number"
              placeholder="Longitude"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              className="h-6 text-xs"
              step="any"
            />
            <Button
              size="sm"
              onClick={handleManualLocation}
              className="h-6 px-2 text-xs font-mono"
              disabled={!manualLat || !manualLng}
            >
              SET
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
