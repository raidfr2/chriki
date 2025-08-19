# Location Features for Chriki Chat

## Overview

Chriki now includes location-based services that allow users to find places near them using Google Maps integration. The bot can detect location-related queries and provide relevant Google Maps links.

## Features

### 1. Location Detection & Permission Management
- **Automatic Location Detection**: The app can detect when users ask for nearby places
- **Permission Handling**: Graceful handling of location permissions (granted, denied, unavailable)
- **Location Status Display**: Visual indicator showing current location status in the chat header

### 2. Supported Location Queries
The bot recognizes queries for:
- **Healthcare**: Hospitals (مستشفى), Pharmacies (صيدلية)
- **Food & Dining**: Restaurants (مطعم), Cafés (قهوة)
- **Services**: Banks (بنك), ATMs, Gas Stations (محطة بنزين)
- **Emergency**: Police (شرطة), Fire Stations (إطفاء)
- **Education**: Schools (مدرسة), Universities (جامعة)
- **Entertainment**: Parks (حديقة), Museums (متحف), Cinemas (سينما)
- **Shopping**: Shopping Centers (مركز تجاري)

### 3. Google Maps Integration
- **Smart URL Generation**: Creates appropriate Google Maps URLs based on user location
- **Location-Aware Queries**: When location is available, adds "near me" context
- **Fallback Support**: Provides general search when location is not available

## How It Works

### For Users with Location Access:
1. User asks: "Show me hospitals near me"
2. Bot responds with helpful information and a Google Maps link
3. Link opens Google Maps with the query centered on user's location

### For Users without Location Access:
1. User asks: "Show me hospitals near me"
2. Bot asks for location permission
3. If granted, provides location-specific results
4. If denied, provides general recommendations for Algeria

## Technical Implementation

### Frontend Components
- `LocationProvider`: Manages location state and permissions
- `LocationStatus`: Shows current location status in UI
- `GoogleMapsLink`: Displays clickable Google Maps links in chat

### Backend Integration
- Enhanced chat API to detect location queries
- Location-aware response generation
- Google Maps URL generation with proper coordinates

### Database Schema Updates
Added location fields to user profiles:
- `latitude`: User's latitude coordinate
- `longitude`: User's longitude coordinate
- `location_enabled`: Whether location access is enabled
- `last_location_update`: Timestamp of last location update

## Usage Examples

### Arabic Queries:
- "أين المستشفيات القريبة مني؟"
- "مطاعم قريبة"
- "صيدليات في المنطقة"

### French Queries:
- "Hôpitaux près de moi"
- "Restaurants à proximité"
- "Pharmacies dans le quartier"

### Darija Queries:
- "Mustashfayat qrib mink"
- "Restaurants qrib mink"
- "Saydaliyat fi l-mantiqa"

## Privacy & Security

- Location data is stored locally in browser storage
- No location data is sent to the server unless explicitly requested
- Users can clear location data at any time
- Location permissions are handled securely through browser APIs

## Future Enhancements

- Reverse geocoding to show user's current city/area
- Integration with local Algerian business directories
- Real-time traffic and public transport information
- Custom location preferences and favorites
