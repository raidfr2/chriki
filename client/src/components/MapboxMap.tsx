import React, { useEffect, useRef } from 'react';

interface MapboxMapProps {
  accessToken: string;
  styleUrl: string;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  accessToken,
  styleUrl,
  className = '',
  center = [3.0588, 36.7538], // Algiers coordinates
  zoom = 10
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    // Load Mapbox GL JS dynamically
    const loadMapbox = async () => {
      // Load CSS
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
      script.onload = () => {
        if (mapContainer.current && !map.current) {
          // @ts-ignore - mapboxgl is loaded dynamically
          const mapboxgl = window.mapboxgl;
          mapboxgl.accessToken = accessToken;

          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: styleUrl,
            center: center,
            zoom: zoom,
            attributionControl: false,
            logoPosition: 'bottom-right'
          });

          // Add navigation controls
          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

          // Add some markers for Algeria's major cities
          const cities = [
            { name: 'Algiers', coordinates: [3.0588, 36.7538] },
            { name: 'Oran', coordinates: [-0.6018, 35.6911] },
            { name: 'Constantine', coordinates: [6.6147, 36.3650] },
            { name: 'Annaba', coordinates: [7.7553, 36.9000] },
            { name: 'Blida', coordinates: [2.8277, 36.4203] },
            { name: 'Batna', coordinates: [6.1667, 35.5667] },
            { name: 'Djelfa', coordinates: [3.2500, 34.6833] },
            { name: 'Sétif', coordinates: [5.4000, 36.1833] },
            { name: 'Sidi Bel Abbès', coordinates: [-0.6333, 35.2000] },
            { name: 'Biskra', coordinates: [5.7333, 34.8500] }
          ];

          cities.forEach(city => {
            // Create a custom marker element
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.cssText = `
              background-color: #f97316;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              cursor: pointer;
              animation: pulse 2s infinite;
            `;

            // Add CSS animation
            if (!document.querySelector('#marker-styles')) {
              const style = document.createElement('style');
              style.id = 'marker-styles';
              style.textContent = `
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.2); opacity: 0.8; }
                  100% { transform: scale(1); opacity: 1; }
                }
              `;
              document.head.appendChild(style);
            }

            new mapboxgl.Marker(el)
              .setLngLat(city.coordinates)
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<div style="font-family: monospace; font-weight: bold;">${city.name}</div>`))
              .addTo(map.current);
          });

          // Add some animation on load
          map.current.on('load', () => {
            map.current.flyTo({
              center: center,
              zoom: zoom,
              duration: 2000
            });
          });
        }
      };
      document.head.appendChild(script);
    };

    loadMapbox();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [accessToken, styleUrl, center, zoom]);

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapboxMap;
