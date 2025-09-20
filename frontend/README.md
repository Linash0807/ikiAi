# Ikigai AI Career Path Finder - Frontend

A modern React TypeScript frontend application for the Ikigai AI Career Path Finder system. This application provides a comprehensive interface for career discovery, job searching, roadmap management, and AI-powered career guidance.

## Features

### 🔐 Authentication & Security
- Firebase Authentication integration
- JWT-based session handling
- Protected routes and secure API communication
- No direct Firestore/Storage access from frontend

### 📊 Core Functionality
- **Profile Management**: Complete user profile with skills, experience, education, and preferences
- **Career Recommendations**: AI-powered career suggestions based on ikigai principles
- **Job Search**: Personalized job search with categorized results
- **Roadmap Management**: 90-day career development plans with task tracking
- **AI Chat**: Contextual chat interface with RAG-powered responses
- **Document Upload**: Profile pictures, resumes, and knowledge base documents
- **Health Monitoring**: System status and service health checks

### 🎨 User Experience
- Modern, responsive design with Tailwind CSS
- Intuitive navigation and user flows
- Real-time feedback and loading states
- Comprehensive error handling
- Accessibility-focused components

### 🏗️ Technical Architecture
- Feature-based organization
- TypeScript interfaces mapped to backend Zod schemas
- Custom hooks for API integration
- Reusable UI components
- Form validation with react-hook-form
- File upload with drag-and-drop support

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Authentication enabled
- Backend API running on http://localhost:4000

### Installation

1. **Clone and install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_API_URL=http://localhost:4000/api
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to http://localhost:3000

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Header, Layout)
│   └── ui/              # Base UI components (Button, Input, Card, etc.)
├── contexts/            # React contexts (AuthContext)
├── hooks/               # Custom hooks (useApi, useApiCall)
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Profile.tsx      # User profile management
│   ├── Recommendations.tsx # Career recommendations
│   ├── JobSearch.tsx    # Job search interface
│   ├── Roadmaps.tsx     # Career roadmap management
│   ├── Chat.tsx         # AI chat interface
│   └── Health.tsx       # System health monitoring
├── services/            # API client and services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── config/              # Configuration files
└── App.tsx              # Main application component
```

## API Integration

The frontend integrates with all backend API endpoints:

- `GET/PUT /api/profile` - User profile management
- `POST /api/profile/picture` - Profile picture upload
- `POST /api/profile/resume` - Resume upload
- `POST /api/recommendation` - Career recommendations
- `POST /api/jobs/search` - Job search
- `POST /api/roadmaps` - Create roadmap
- `PUT /api/roadmaps/:id/task` - Update roadmap task
- `GET/POST /api/chat/sessions` - Chat session management
- `GET/POST /api/chat/sessions/:id/messages` - Chat messages
- `POST /api/knowledge/upload` - Document upload
- `GET /api/health` - Health check

## Key Components

### Authentication Flow
- Firebase Authentication with email/password
- Automatic token refresh
- Protected route handling
- Session persistence

### File Upload System
- Drag-and-drop file uploads
- Client-side validation
- Progress tracking
- Support for images, PDFs, and documents

### Chat Interface
- Real-time messaging
- Session management
- Markdown rendering
- Message history

### Form Management
- React Hook Form integration
- Zod schema validation
- Error handling and feedback
- Dynamic form fields

## Styling

The application uses Tailwind CSS with a custom design system:

- **Colors**: Primary (blue), Secondary (gray), Success (green), Warning (yellow), Error (red)
- **Typography**: Inter font family
- **Components**: Consistent spacing, shadows, and transitions
- **Responsive**: Mobile-first design approach

## Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks (if configured)

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform**
   - Vercel, Netlify, or AWS S3 + CloudFront
   - Ensure environment variables are configured
   - Update API URL for production

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test all user flows thoroughly
5. Update documentation as needed

## License

This project is part of the Ikigai AI Career Path Finder system.
