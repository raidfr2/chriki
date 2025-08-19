import React from 'react'
import { Button } from '@/components/ui/button'
import { useLocation } from '@/lib/location-context'

// Sample coordinates for major Algerian cities
const sampleLocations = [
  { name: 'Algiers', lat: 36.7538, lng: 3.0588 },
  { name: 'Oran', lat: 35.6971, lng: -0.6337 },
  { name: 'Constantine', lat: 36.3650, lng: 6.6147 },
  { name: 'Annaba', lat: 36.9000, lng: 7.7667 },
  { name: 'Setif', lat: 36.1901, lng: 5.4095 },
  { name: 'Batna', lat: 35.5500, lng: 6.1667 },
  { name: 'Blida', lat: 36.4700, lng: 2.8300 },
  { name: 'Tlemcen', lat: 34.8783, lng: -1.3150 },
]

export default function LocationTestHelper() {
  const { updateLocation } = useLocation()

  const setTestLocation = (lat: number, lng: number) => {
    updateLocation(lat, lng)
  }

  return (
    <div className="p-4 bg-muted/30 rounded-lg border border-border">
      <div className="text-sm font-mono font-bold mb-3">Test Locations (Algeria)</div>
      <div className="grid grid-cols-2 gap-2">
        {sampleLocations.map((location) => (
          <Button
            key={location.name}
            size="sm"
            variant="outline"
            onClick={() => setTestLocation(location.lat, location.lng)}
            className="text-xs font-mono h-8"
          >
            {location.name}
          </Button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Click any city to set it as your test location
      </div>
    </div>
  )
}
