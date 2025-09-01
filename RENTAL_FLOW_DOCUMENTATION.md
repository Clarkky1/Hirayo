# 🏠 Hirayo Rental Platform - Complete System Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Rental Flow Architecture](#rental-flow-architecture)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Requirements](#backend-requirements)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Real-time Communication](#real-time-communication)
8. [Security & Validation](#security--validation)
9. [Deployment & Infrastructure](#deployment--infrastructure)

---

## 🎯 System Overview

**Hirayo** is a peer-to-peer rental platform that connects item owners (lenders) with renters. The platform facilitates secure, transparent, and efficient rental transactions through a comprehensive communication and approval system.

### Core Features
- **Multi-communication channels**: Text messaging and video calls
- **Smart timeout handling**: Automatic fallback options for unresponsive lenders
- **First-come-first-serve**: Priority-based rental request management
- **Real-time tracking**: Location monitoring for security
- **Seamless flow**: From discovery to payment completion

---

## 🔄 Rental Flow Architecture

### 1. **Discovery Phase**
```
User browses items → Filters by category/price/location → Views item details
```

### 2. **Communication Phase**
```
Click "Rent" → Choose communication method → Start conversation with lender
```

#### Communication Options:
- **Text Message**: Asynchronous communication with 5-minute timeout
- **Video Call**: Real-time communication with fallback options

### 3. **Approval Phase**
```
Lender reviews request → Grants/declines permission → Renter proceeds to rental form
```

#### Multiple Request Handling (Lender Side):
```
Multiple renters request same item → Lender sees priority list → Approves first request → Others automatically declined
```

**Key Features:**
- **Request Queue**: Lenders see all pending requests in chronological order
- **Priority System**: First-come-first-serve with visual indicators
- **Automatic Conflict Resolution**: Approving one request automatically declines others
- **Status Management**: Clear tracking of pending, approved, and declined requests

### 4. **Rental Process**
```
Set rental period → Review order → Payment → Item handover
```

### 5. **Post-Rental**
```
Return item → Rate experience → Complete transaction
```

---

## 🎨 Frontend Implementation

### Key Components

#### 1. **ItemDetailScreen** (`components/item/ItemDetailScreen.tsx`)
- **Purpose**: Display item details and initiate rental process
- **Features**:
  - Image carousel with swipe gestures
  - Communication options modal
  - Price display and item information
  - Rent button with communication flow

#### 2. **Communication Modal**
```typescript
// Shows when Rent button is clicked
const communicationOptions = [
  { type: 'video-call', icon: 'videocam-outline', label: 'Video Call' },
  { type: 'message', icon: 'chatbubble-outline', label: 'Message Lender' }
];
```

#### 3. **ViewMessagesScreen** (`app/view-messages/index.tsx`)
- **Purpose**: Renter-side conversation interface
- **Features**:
  - 5-minute timeout handling
  - Alternative suggestions (video call, find alternatives)
  - Permission granted banner
  - Seamless navigation to rental form

#### 4. **LenderMessagesScreen** (`app/lender-messages/index.tsx`)
- **Purpose**: Lender-side request management and multiple rental request handling
- **Features**:
  - **Tabbed Interface**: Three main sections for better organization
    - **Chat Tab**: Direct conversation with renters
    - **Requests Tab**: Manage all rental requests with approve/decline actions
    - **Overview Tab**: Summary of all items and their request statuses
  - **Multiple rental request management**: Handle multiple renters requesting the same item
  - **First-come-first-serve priority system**: Automatic conflict resolution when multiple requests exist
  - **Individual request approval/decline**: Approve one request, automatically decline others for the same item
  - **Request status tracking**: Pending, approved, declined status management
  - **Priority indicators**: Visual badges showing request order and status

#### Multiple Request Management System
```typescript
// Request handling logic
const handleRequestAction = (requestId: string, action: 'approve' | 'decline') => {
  if (action === 'approve') {
    // Approve selected request
    approveRequest(requestId);
    // Automatically decline all other pending requests for the same item
    declineOtherRequests(itemId, requestId);
  }
};

// Visual priority indicators
const renderPriorityBadge = (request: RentalRequest) => {
  if (request.isFirstRequest && request.status === 'pending') {
    return <View style={styles.firstRequestBadge}>
      <Text style={styles.firstRequestText}>1st</Text>
    </View>;
  }
};
```

**Request States:**
- **Pending**: Awaiting lender decision
- **Approved**: Request accepted, others automatically declined
- **Declined**: Request rejected (manual or automatic)

#### Renter vs Lender Experience

**Renter Side:**
- **Single Request**: Each renter submits one request per item
- **Communication**: Direct messaging/video call with lender
- **Status Updates**: Receive notifications about request approval/decline
- **Timeout Handling**: Get alternative suggestions if no response

**Lender Side:**
- **Multiple Requests**: See all pending requests for their items
- **Priority Management**: Handle requests in chronological order
- **Conflict Resolution**: Approving one request automatically declines others
- **Request Queue**: Visual management of all rental requests

#### 5. **VideoCallScreen** (`app/video-call/index.tsx`)
- **Purpose**: Video communication with fallback options
- **Features**:
  - Connection status monitoring
  - Poor connection detection
  - Fallback to messaging
  - Permission granting interface

---

## ⚙️ Backend Requirements

### 1. **Core Technologies**
- **Framework**: Node.js with Express.js or NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: WebSocket (Socket.io) or Supabase Realtime
- **Authentication**: JWT with refresh tokens
- **File Storage**: AWS S3 or Cloudinary for images
- **Video Calls**: Twilio Video or Agora.io

### 2. **Key Services Required**

#### Authentication Service
```typescript
interface AuthService {
  register(userData: UserRegistration): Promise<User>;
  login(credentials: LoginCredentials): Promise<AuthTokens>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  verifyToken(token: string): Promise<UserPayload>;
}
```

#### Communication Service
```typescript
interface CommunicationService {
  // Text Messaging
  sendMessage(senderId: string, receiverId: string, message: MessageData): Promise<Message>;
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  
  // Video Calls
  createVideoCall(initiatorId: string, receiverId: string): Promise<VideoCall>;
  joinVideoCall(callId: string, userId: string): Promise<VideoCallSession>;
  endVideoCall(callId: string): Promise<void>;
  
  // Real-time Updates
  subscribeToUpdates(userId: string): WebSocket;
}
```

#### Rental Request Service
```typescript
interface RentalRequestService {
  createRequest(renterId: string, itemId: string, dates: RentalDates): Promise<RentalRequest>;
  getPendingRequests(lenderId: string): Promise<RentalRequest[]>;
  approveRequest(requestId: string): Promise<RentalRequest>;
  declineRequest(requestId: string, reason?: string): Promise<RentalRequest>;
  handleMultipleRequests(itemId: string, approvedRequestId: string): Promise<void>;
}
```

#### Notification Service
```typescript
interface NotificationService {
  sendPushNotification(userId: string, notification: NotificationData): Promise<void>;
  sendEmail(userId: string, emailTemplate: EmailTemplate): Promise<void>;
  sendSMS(phoneNumber: string, message: string): Promise<void>;
  
  // Timeout Notifications
  scheduleTimeoutNotification(requestId: string, timeoutMinutes: number): Promise<void>;
  sendTimeoutAlternatives(userId: string, alternatives: AlternativeOption[]): Promise<void>;
}
```

---

## 🗄️ Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  profile_image_url VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Items
```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(10,8),
  location_address TEXT,
  images JSONB DEFAULT '[]',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Rental Requests
```sql
CREATE TABLE rental_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  renter_id UUID REFERENCES users(id),
  item_id UUID REFERENCES items(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, declined, cancelled
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  rental_request_id UUID REFERENCES rental_requests(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- text, system, permission_granted
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Video Calls
```sql
CREATE TABLE video_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  rental_request_id UUID REFERENCES rental_requests(id),
  status VARCHAR(50) DEFAULT 'initiated', -- initiated, connected, ended, failed
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_seconds INTEGER,
  connection_quality VARCHAR(50), -- good, poor, failed
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

### Items
```
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
GET    /api/items/search
```

### Rental Requests
```
POST   /api/rental-requests
GET    /api/rental-requests/pending
PUT    /api/rental-requests/:id/approve
PUT    /api/rental-requests/:id/decline
GET    /api/rental-requests/:id
```

### Communication
```
POST   /api/messages
GET    /api/conversations/:userId
GET    /api/conversations/:userId/:otherUserId
POST   /api/video-calls
PUT    /api/video-calls/:id/join
PUT    /api/video-calls/:id/end
```

### Real-time Events
```
WebSocket: /ws
Events:
  - message:received
  - rental_request:status_changed
  - video_call:incoming
  - notification:timeout
```

---

## 🔌 Real-time Communication

### WebSocket Events

#### Message Events
```typescript
// Client to Server
interface ClientEvents {
  'message:send': (data: { receiverId: string, content: string }) => void;
  'typing:start': (data: { receiverId: string }) => void;
  'typing:stop': (data: { receiverId: string }) => void;
}

// Server to Client
interface ServerEvents {
  'message:received': (message: Message) => void;
  'typing:indicator': (data: { userId: string, isTyping: boolean }) => void;
  'rental_request:updated': (request: RentalRequest) => void;
  'notification:timeout': (data: { requestId: string, alternatives: AlternativeOption[] }) => void;
}
```

#### Video Call Events
```typescript
interface VideoCallEvents {
  'call:incoming': (data: { callId: string, initiator: User, item: Item }) => void;
  'call:accepted': (data: { callId: string }) => void;
  'call:rejected': (data: { callId: string, reason?: string }) => void;
  'call:ended': (data: { callId: string, duration: number }) => void;
  'call:connection_quality': (data: { callId: string, quality: string }) => void;
}
```

### Timeout Handling
```typescript
class TimeoutManager {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();
  
  scheduleTimeout(requestId: string, timeoutMinutes: number): void {
    const timeout = setTimeout(() => {
      this.handleTimeout(requestId);
    }, timeoutMinutes * 60 * 1000);
    
    this.timeouts.set(requestId, timeout);
  }
  
  private async handleTimeout(requestId: string): Promise<void> {
    // Send timeout notification
    // Provide alternative options
    // Update request status
  }
}
```

---

## 🔒 Security & Validation

### Authentication & Authorization
- **JWT tokens** with short expiration (15 minutes)
- **Refresh tokens** for long-term sessions
- **Role-based access control** (renter, lender, admin)
- **Rate limiting** on sensitive endpoints

### Data Validation
```typescript
// Input validation schemas
const createRentalRequestSchema = z.object({
  itemId: z.string().uuid(),
  startDate: z.date().min(new Date()),
  endDate: z.date().min(new Date()),
  message: z.string().max(500).optional()
});

const sendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  rentalRequestId: z.string().uuid().optional()
});
```

### Security Headers
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

---

## 🚀 Deployment & Infrastructure

### Environment Setup
```bash
# Required environment variables
DATABASE_URL=postgresql://user:password@localhost:5432/hirayo
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=hirayo-images
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

### Docker Configuration
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Database Migrations
```bash
# Using Prisma
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

### Monitoring & Logging
- **Application monitoring**: New Relic or DataDog
- **Error tracking**: Sentry
- **Log aggregation**: ELK Stack or CloudWatch
- **Performance monitoring**: APM tools

---

## 📱 Mobile App Integration

### Push Notifications
```typescript
interface PushNotificationService {
  sendToUser(userId: string, notification: PushNotification): Promise<void>;
  sendToMultipleUsers(userIds: string[], notification: PushNotification): Promise<void>;
  
  // Notification types
  sendRentalRequestNotification(lenderId: string, request: RentalRequest): Promise<void>;
  sendApprovalNotification(renterId: string, request: RentalRequest): Promise<void>;
  sendTimeoutNotification(renterId: string, alternatives: AlternativeOption[]): Promise<void>;
}
```

### Deep Linking
```typescript
// Handle deep links for notifications
const deepLinkHandlers = {
  'rental-request': (requestId: string) => navigateToRentalRequest(requestId),
  'conversation': (userId: string) => navigateToConversation(userId),
  'video-call': (callId: string) => joinVideoCall(callId)
};
```

---

## 🔄 Testing Strategy

### Unit Tests
- **Service layer**: Business logic testing
- **Repository layer**: Data access testing
- **Utility functions**: Helper function testing

### Integration Tests
- **API endpoints**: End-to-end API testing
- **Database operations**: Data persistence testing
- **WebSocket events**: Real-time communication testing

### E2E Tests
- **Complete rental flow**: Full user journey testing
- **Cross-platform**: iOS and Android testing
- **Performance**: Load and stress testing

---

## 📊 Analytics & Insights

### Key Metrics
- **Rental conversion rate**: Browse to rental completion
- **Communication effectiveness**: Message vs video call success rates
- **Timeout handling**: How often alternatives are used
- **User satisfaction**: Ratings and feedback analysis

### Data Collection
```typescript
interface AnalyticsService {
  trackEvent(event: AnalyticsEvent): Promise<void>;
  trackUserAction(userId: string, action: UserAction): Promise<void>;
  generateReport(dateRange: DateRange, metrics: Metric[]): Promise<Report>;
}
```

---

## 🚧 Development Roadmap

### Phase 1: Core Infrastructure (Weeks 1-4)
- [ ] Database setup and migrations
- [ ] Basic API endpoints
- [ ] Authentication system
- [ ] File upload service

### Phase 2: Communication System (Weeks 5-8)
- [ ] Real-time messaging
- [ ] Video call integration
- [ ] Notification service
- [ ] Timeout handling

### Phase 3: Rental Management (Weeks 9-12)
- [ ] Request approval system
- [ ] Payment integration
- [ ] Location tracking
- [ ] Rating system

### Phase 4: Advanced Features (Weeks 13-16)
- [ ] Analytics dashboard
- [ ] Advanced filtering
- [ ] Mobile optimization
- [ ] Performance tuning

---

## 📞 Support & Maintenance

### Development Team
- **Backend Lead**: [Your Name]
- **Frontend Lead**: [Frontend Developer]
- **DevOps Engineer**: [DevOps Developer]
- **QA Engineer**: [QA Developer]

### Contact Information
- **Email**: dev@hirayo.com
- **Slack**: #hirayo-development
- **Documentation**: [Internal Wiki Link]

---

*This document is maintained by the Hirayo development team. Last updated: [Current Date]*
