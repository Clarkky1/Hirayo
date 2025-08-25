# My Items - Folder Structure & Real-Time Location Tracking

## 📁 Folder Structure

```
app/my-items/
├── _layout.tsx          # Navigation layout
├── index.tsx            # Main my-items page
├── view.tsx             # View item with map
└── edit.tsx             # Edit item details
```

## 🔗 Navigation Flow

- **Main Page** → **View Button** → `/my-items/view?itemId=1`
- **Main Page** → **Edit Button** → `/my-items/edit?itemId=1`

---

## 🗺️ Real-Time Location Tracking APIs

### 1. Core Location Services

#### 📱 Device Location APIs
- **React Native Geolocation** - `@react-native-community/geolocation`
- **Expo Location** - `expo-location`
- **Background Location Updates** - For continuous tracking

#### 🌐 Backend Location Services
- **Google Maps Platform APIs:**
  - Maps JavaScript API
  - Geocoding API
  - Reverse Geocoding API
  - Places API
- **Mapbox APIs:**
  - Maps API
  - Geocoding API
  - Directions API

### 2. Real-Time Communication

#### 📡 WebSocket/Real-Time APIs
- **Socket.io** - Real-time bidirectional communication
- **Firebase Realtime Database** - Real-time location updates
- **Supabase Realtime** - PostgreSQL with real-time subscriptions
- **Pusher** - Real-time messaging service

#### ☁️ Cloud Services
- **AWS IoT Core** - Device communication
- **Google Cloud IoT** - Device management
- **Azure IoT Hub** - IoT device connectivity

### 3. Location Tracking Implementation

#### 🔄 Frontend (React Native)
```typescript
// Location tracking service
import * as Location from 'expo-location';

const startLocationTracking = async (itemId: string) => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return;

  Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 30000, // Update every 30 seconds
      distanceInterval: 10, // Update every 10 meters
    },
    (location) => {
      // Send location to backend
      updateItemLocation(itemId, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
      });
    }
  );
};
```

#### 🖥️ Backend (Node.js/Express)
```typescript
// WebSocket server for real-time updates
import { Server } from 'socket.io';

io.on('connection', (socket) => {
  socket.on('join-item-tracking', (itemId) => {
    socket.join(`item-${itemId}`);
  });

  socket.on('location-update', (data) => {
    // Save to database
    saveLocationUpdate(data);
    
    // Broadcast to all lenders tracking this item
    io.to(`item-${data.itemId}`).emit('location-updated', data);
  });
});
```

### 4. Database Schema

#### 🗄️ Location Tracking Table
```sql
CREATE TABLE item_locations (
  id SERIAL PRIMARY KEY,
  item_id UUID REFERENCES items(id),
  renter_id UUID REFERENCES users(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  accuracy DECIMAL(5, 2),
  timestamp TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_item_locations_item_id ON item_locations(item_id);
CREATE INDEX idx_item_locations_timestamp ON item_locations(timestamp);
```

### 5. Security & Privacy

#### 🔒 Privacy Controls
- **Consent Management** - Renter must consent to location sharing
- **Time Limits** - Location tracking only during rental period
- **Data Encryption** - Encrypt location data in transit and at rest
- **Access Control** - Only lenders can view their items' locations

#### ⚖️ Legal Compliance
- **GDPR Compliance** - Data protection regulations
- **Location Privacy Laws** - Local jurisdiction requirements
- **Rental Agreement Terms** - Clear consent in rental contracts

### 6. Recommended Tech Stack

#### 🚀 For MVP (Minimum Viable Product)
- **Frontend**: Expo Location + Socket.io client
- **Backend**: Node.js + Express + Socket.io
- **Database**: PostgreSQL + Redis (for real-time)
- **Maps**: Google Maps Platform or Mapbox

#### 🏗️ For Production Scale
- **Frontend**: React Native + Background location services
- **Backend**: Node.js + WebSocket clusters + Load balancer
- **Database**: PostgreSQL + TimescaleDB (for time-series data)
- **Real-time**: Redis Pub/Sub + WebSocket scaling
- **Maps**: Google Maps Platform (enterprise)

### 7. Implementation Phases

#### 📋 Phase 1: Basic Location
- Static location display
- Manual location updates
- Basic map integration

#### 🔄 Phase 2: Real-Time Updates
- WebSocket implementation
- Live location tracking
- Location history

#### 📊 Phase 3: Advanced Features
- Geofencing alerts
- Route tracking
- Location analytics
- Offline support

---

## 📱 Screen Features

### View Screen (`view.tsx`)
- **Map Placeholder** - 300px height map view area
- **Location Coordinates** - Display latitude/longitude
- **Item Information** - Renter details, rental period
- **Tracking Controls** - Start/Stop location tracking
- **Quick Actions** - Contact renter, report issues
- **Security Notice** - Privacy and legal information

### Edit Screen (`edit.tsx`)
- **Basic Information** - Name, category, price
- **Description** - Multi-line text input
- **Location & Status** - Location input, status selector
- **Photos** - Photo upload placeholder
- **Action Buttons** - Save, cancel, delete

---

## 🔧 Technical Implementation

### Navigation Setup
```typescript
// _layout.tsx
<Stack>
  <Stack.Screen name="index" options={{ headerShown: false }} />
  <Stack.Screen name="view" options={{ title: 'View Item', presentation: 'modal' }} />
  <Stack.Screen name="edit" options={{ title: 'Edit Item', presentation: 'modal' }} />
</Stack>
```

### Button Navigation
```typescript
// View Button
onPress={() => router.push({
  pathname: '/my-items/view',
  params: { itemId: item.id }
})}

// Edit Button
onPress={() => router.push({
  pathname: '/my-items/edit',
  params: { itemId: item.id }
})}
```

---

## 📊 Data Flow

```
My Items Page
     ↓
View/Edit Buttons
     ↓
Navigation with itemId
     ↓
Target Screen (View/Edit)
     ↓
Fetch Item Data
     ↓
Display/Edit Interface
```

---

## 🚨 Important Notes

1. **Location tracking is for security purposes only**
2. **Requires explicit consent from renters**
3. **Must comply with local privacy laws**
4. **Data should be encrypted and secure**
5. **Tracking limited to rental period only**

---

## 🔮 Future Enhancements

- **Real-time map integration** with Google Maps/Mapbox
- **Push notifications** for location updates
- **Geofencing** for boundary alerts
- **Location history** and analytics
- **Offline location caching**
- **Multi-device synchronization**

---

*This documentation covers the current implementation and provides a roadmap for future real-time location tracking features.*
