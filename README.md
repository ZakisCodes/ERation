# DigiRation - Ration Shop PWA

A complete Progressive Web App for ration shop customers to manage their ration card and transactions with a comprehensive verification system.

## 🚀 Features

### Authentication & Verification Flow
- **Ration ID Registration**: Enter ration card ID and mobile number
- **OTP Verification**: SMS-based mobile number verification
- **Family Member Selection**: Choose your profile from family members
- **Government ID Verification**: Verify identity using Aadhaar, PAN, Voter ID, or Driving License
- **JWT-based Authentication**: Secure token-based authentication

### Core Functionality
- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interface
- **PWA Support**: Installable app with offline capabilities
- **QR Code Scanning**: Scan dealer QR codes for transactions
- **Stock Management**: View available ration items and personal quotas
- **Transaction History**: Track all previous transactions
- **Real-time Updates**: Live status updates for transactions

### Technical Features
- **Next.js Frontend**: React-based with TypeScript
- **Express.js Backend**: RESTful API with SQLite database
- **Material-UI Components**: Modern, accessible UI components
- **Docker Support**: Containerized development and deployment
- **Responsive Design**: Works on all screen sizes

## 📱 Mobile-First Wireframes

The app includes detailed wireframes for all screens:
- Ration ID Registration
- OTP Verification
- Family Member Selection
- Government ID Verification
- Home Dashboard
- Available Stocks
- Transaction History
- QR Code Scanner
- Profile & Settings

See `WIREFRAMES.md` for complete mobile-first design specifications.

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Material-UI** - Component library
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **React Hook Form** - Form management

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **SQLite** - Lightweight database
- **JWT** - Authentication tokens
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Development
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nodemon** - Development server
- **ESLint** - Code linting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose (optional)
- Git

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DigiRation
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Option 2: Manual Setup

1. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

2. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   Or start individually:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 📱 PWA Features

### Camera Access for QR Scanning
The app includes QR code scanning functionality. For PWA camera access:

**Chrome/Edge**: Full camera support
**Firefox**: Limited camera support
**Safari**: Requires HTTPS for camera access

**Note**: Camera access in PWAs works best when:
- App is installed (not just in browser)
- HTTPS is enabled
- User grants camera permissions

### Offline Functionality
The PWA includes:
- Service worker for offline caching
- Offline fallback pages
- Background sync for transactions
- Push notifications (optional)

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Create `.env` in the backend directory:
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

### Database
The app uses SQLite with sample data including:
- Sample ration card: `RC1234567890`
- Family members with different verification statuses
- Sample ration items and stock levels
- User quotas and transaction history

## 🧪 Testing the Verification Flow

### Demo Data
Use these credentials for testing:

**Ration Card ID**: `RC1234567890`
**Mobile Number**: `9876543210`
**OTP**: Check console logs (in development mode)

### Verification Steps
1. Enter ration card ID and mobile number
2. Enter the OTP (shown in console for demo)
3. Select a family member (Rajesh Kumar is pre-verified)
4. Choose government ID type and enter valid format:
   - **Aadhaar**: 12 digits (e.g., 123456789012)
   - **PAN**: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
   - **Voter ID**: 3 letters + 7 digits (e.g., ABC1234567)
   - **Driving License**: DL + 13 digits (e.g., DL1234567890123)

## 📦 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to mobile
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/family-members/:id` - Get family members
- `POST /api/auth/verify-id` - Verify government ID
- `POST /api/auth/complete-verification` - Complete verification

### Ration Management
- `GET /api/ration/stocks` - Get available stocks
- `GET /api/ration/quota/:memberId` - Get user quota
- `GET /api/ration/transactions/:memberId` - Get transaction history
- `POST /api/ration/initiate-transaction` - Start transaction

## 🚀 Deployment

### Production Build
```bash
# Build both frontend and backend
npm run build

# Start production servers
npm run start
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security Features

- JWT token authentication
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention

## 📱 Mobile Optimization

- Touch-friendly interface (44px minimum touch targets)
- Responsive design for all screen sizes
- Fast loading with code splitting
- Offline support with service workers
- App-like experience when installed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the wireframes in `WIREFRAMES.md`
- Review the API documentation above
- Check console logs for debugging
- Ensure all environment variables are set correctly

## 🔮 Future Enhancements

- Push notifications for transaction updates
- Biometric authentication
- Multi-language support
- Advanced analytics dashboard
- Integration with government databases
- Offline transaction queuing
