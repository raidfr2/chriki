import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocation } from '@/lib/location-context'

// Complete list of Algeria's 58 wilayas with their official numbers and coordinates
const algeriaWilayas = [
  { number: 1, name: 'Adrar', lat: 27.8702, lng: -0.2841 },
  { number: 2, name: 'Chlef', lat: 36.1654, lng: 1.3370 },
  { number: 3, name: 'Laghouat', lat: 33.8000, lng: 2.8667 },
  { number: 4, name: 'Oum El Bouaghi', lat: 35.8753, lng: 7.1133 },
  { number: 5, name: 'Batna', lat: 35.5500, lng: 6.1667 },
  { number: 6, name: 'Béjaïa', lat: 36.7525, lng: 5.0626 },
  { number: 7, name: 'Biskra', lat: 34.8481, lng: 5.7281 },
  { number: 8, name: 'Béchar', lat: 31.6177, lng: -2.2286 },
  { number: 9, name: 'Blida', lat: 36.4700, lng: 2.8300 },
  { number: 10, name: 'Bouira', lat: 36.3736, lng: 3.9048 },
  { number: 11, name: 'Tamanrasset', lat: 22.7851, lng: 5.5281 },
  { number: 12, name: 'Tébessa', lat: 35.4075, lng: 8.1169 },
  { number: 13, name: 'Tlemcen', lat: 34.8783, lng: -1.3150 },
  { number: 14, name: 'Tiaret', lat: 35.3712, lng: 1.3170 },
  { number: 15, name: 'Tizi Ouzou', lat: 36.7118, lng: 4.0435 },
  { number: 16, name: 'Algiers', lat: 36.7538, lng: 3.0588 },
  { number: 17, name: 'Djelfa', lat: 34.6714, lng: 3.2630 },
  { number: 18, name: 'Jijel', lat: 36.8190, lng: 5.7667 },
  { number: 19, name: 'Sétif', lat: 36.1901, lng: 5.4095 },
  { number: 20, name: 'Saïda', lat: 34.8370, lng: 0.1512 },
  { number: 21, name: 'Skikda', lat: 36.8761, lng: 6.9094 },
  { number: 22, name: 'Sidi Bel Abbès', lat: 35.1977, lng: -0.6388 },
  { number: 23, name: 'Annaba', lat: 36.9000, lng: 7.7667 },
  { number: 24, name: 'Guelma', lat: 36.4612, lng: 7.4286 },
  { number: 25, name: 'Constantine', lat: 36.3650, lng: 6.6147 },
  { number: 26, name: 'Médéa', lat: 36.2640, lng: 2.7540 },
  { number: 27, name: 'Mostaganem', lat: 35.9315, lng: 0.0890 },
  { number: 28, name: 'MSila', lat: 35.7056, lng: 4.5415 },
  { number: 29, name: 'Mascara', lat: 35.3968, lng: 0.1405 },
  { number: 30, name: 'Ouargla', lat: 31.9539, lng: 5.3348 },
  { number: 31, name: 'Oran', lat: 35.6971, lng: -0.6337 },
  { number: 32, name: 'El Bayadh', lat: 33.6781, lng: 1.0196 },
  { number: 33, name: 'Illizi', lat: 26.4840, lng: 8.4723 },
  { number: 34, name: 'Bordj Bou Arréridj', lat: 36.0731, lng: 4.7608 },
  { number: 35, name: 'Boumerdès', lat: 36.7667, lng: 3.4667 },
  { number: 36, name: 'El Tarf', lat: 36.7672, lng: 8.3137 },
  { number: 37, name: 'Tindouf', lat: 27.6710, lng: -8.1479 },
  { number: 38, name: 'Tissemsilt', lat: 35.6078, lng: 1.8112 },
  { number: 39, name: 'El Oued', lat: 33.3565, lng: 6.8675 },
  { number: 40, name: 'Khenchela', lat: 35.4361, lng: 7.1433 },
  { number: 41, name: 'Souk Ahras', lat: 36.2863, lng: 7.9511 },
  { number: 42, name: 'Tipaza', lat: 36.5947, lng: 2.4474 },
  { number: 43, name: 'Mila', lat: 36.4504, lng: 6.2641 },
  { number: 44, name: 'Aïn Defla', lat: 36.2639, lng: 1.9676 },
  { number: 45, name: 'Naâma', lat: 33.2667, lng: -0.3000 },
  { number: 46, name: 'Aïn Témouchent', lat: 35.2981, lng: -1.1406 },
  { number: 47, name: 'Ghardaïa', lat: 32.4911, lng: 3.6736 },
  { number: 48, name: 'Relizane', lat: 35.7370, lng: 0.5559 },
  { number: 49, name: 'Timimoun', lat: 29.2631, lng: 0.2411 },
  { number: 50, name: 'Bordj Badji Mokhtar', lat: 21.3167, lng: 0.9500 },
  { number: 51, name: 'Ouled Djellal', lat: 34.4167, lng: 5.0833 },
  { number: 52, name: 'Béni Abbès', lat: 30.1333, lng: -2.1667 },
  { number: 53, name: 'In Salah', lat: 27.1930, lng: 2.4608 },
  { number: 54, name: 'In Guezzam', lat: 19.5667, lng: 5.7667 },
  { number: 55, name: 'Touggourt', lat: 33.1067, lng: 6.0581 },
  { number: 56, name: 'Djanet', lat: 24.5542, lng: 9.4840 },
  { number: 57, name: 'El MGhair', lat: 33.9500, lng: 5.9167 },
  { number: 58, name: 'El Meniaa', lat: 30.5833, lng: 2.8833 }
]

export default function LocationTestHelper() {
  const { updateLocation, location } = useLocation()
  const [selectedWilaya, setSelectedWilaya] = useState<string>('')

  const setLocation = (lat: number, lng: number) => {
    updateLocation(lat, lng)
  }

  const handleWilayaSelect = (value: string) => {
    setSelectedWilaya(value)
    const wilaya = algeriaWilayas.find(w => w.number.toString() === value)
    if (wilaya) {
      setLocation(wilaya.lat, wilaya.lng)
    }
  }

  // Clear dropdown selection when global location is cleared
  useEffect(() => {
    if (!location) {
      setSelectedWilaya('')
    } else {
      // Find the wilaya that matches the current location
      const matchingWilaya = algeriaWilayas.find(w => 
        Math.abs(w.lat - location.latitude) < 0.1 && 
        Math.abs(w.lng - location.longitude) < 0.1
      )
      if (matchingWilaya) {
        setSelectedWilaya(matchingWilaya.number.toString())
      }
    }
  }, [location])

  // Sort wilayas by number (they're already sorted in the array, but being explicit)
  const sortedWilayas = [...algeriaWilayas].sort((a, b) => a.number - b.number)

  return (
    <div className="p-4 bg-muted/30 rounded-lg border border-border">
      <div className="text-sm font-mono font-bold mb-3">Algeria Wilayas</div>
      
      <div className="space-y-3">
        <Select value={selectedWilaya} onValueChange={handleWilayaSelect}>
          <SelectTrigger className="w-full border-2 border-border focus:accent-border focus:ring-1 focus:ring-accent-border">
            <SelectValue placeholder="Select your wilaya..." />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {sortedWilayas.map((wilaya) => (
              <SelectItem 
                key={wilaya.number} 
                value={wilaya.number.toString()}
                className="font-mono text-sm"
              >
                {String(wilaya.number).padStart(2, '0')} - {wilaya.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedWilaya && (
          <div className="text-xs text-muted-foreground">
            Location set to: {algeriaWilayas.find(w => w.number.toString() === selectedWilaya)?.name}
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground mt-3">
        Select your wilaya to set your location. Numbers are official wilaya codes.
      </div>
    </div>
  )
}
