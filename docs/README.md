# IDARAH WALI UL ASER Islamic Library Management System

## Overview

The IDARAH WALI UL ASER Islamic Library Management System is a comprehensive web application designed specifically for Islamic educational institutions. Built with modern web technologies, it provides a complete solution for managing books, users, borrowing records, and administrative tasks while maintaining authentic Islamic terminology and cultural appropriateness.

## Features

### 🕌 Islamic-Focused Design
- Authentic Islamic terminology throughout the interface
- Islamic calendar integration with Hijri date support
- Prayer times and Qibla direction features
- Islamic book categories (Quran, Hadith, Fiqh, Tafsir, Seerah, etc.)
- Cultural sensitivity in all UI elements and content

### 📚 Library Management
- **Book Management**: Add, edit, delete, and categorize Islamic books
- **Advanced Search**: Multi-criteria search with filters for category, author, language, and publication year
- **Featured Books**: Highlight important Islamic texts
- **Availability Tracking**: Real-time book availability status
- **ISBN Validation**: Automatic ISBN format validation

### 👥 User Management
- **Role-Based Access Control**: Admin, Teacher, and Student roles
- **User Profiles**: Comprehensive user information management
- **Authentication**: Secure login/logout with email verification
- **Profile Management**: Users can update their personal information

### 📖 Borrowing System
- **Book Borrowing**: Students and teachers can borrow available books
- **Due Date Tracking**: Automatic calculation of due dates
- **Overdue Management**: Track and manage overdue books
- **Borrowing History**: Complete history of all borrowing activities
- **Return Processing**: Easy book return workflow

### 📊 Admin Dashboard
- **Real-time Statistics**: Live dashboard with key metrics
- **User Analytics**: Track user activity and engagement
- **Book Analytics**: Monitor book popularity and availability
- **System Monitoring**: Real-time system health and performance
- **Report Generation**: Comprehensive reporting capabilities

### 🔄 Real-time Features
- **Live Updates**: Real-time data synchronization across all users
- **Notifications**: Instant notifications for important events
- **Activity Feed**: Live activity stream of system events
- **Online Presence**: Track which users are currently online
- **Auto-refresh**: Automatic data refresh without page reload

### 🛡️ Security & Performance
- **Row Level Security (RLS)**: Database-level security policies
- **Data Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Robust error handling and user feedback
- **Performance Optimization**: Efficient database queries and caching
- **Responsive Design**: Mobile-first responsive design

## Technology Stack

### Frontend
- **React 19**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Client-side routing and navigation
- **React Hook Form**: Efficient form handling with validation
- **Zod**: Schema validation for forms and data

### Backend & Database
- **Supabase**: Backend-as-a-Service with PostgreSQL database
- **PostgreSQL**: Robust relational database with advanced features
- **Real-time Subscriptions**: WebSocket-based real-time updates
- **Row Level Security**: Database-level security policies
- **Edge Functions**: Serverless functions for custom logic

### Development & Testing
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **ESLint**: Code linting and quality assurance
- **TypeScript**: Static type checking
- **Git**: Version control with GitHub integration

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── forms/          # Form components
│   ├── search/         # Search-related components
│   ├── realtime/       # Real-time feature components
│   ├── notifications/  # Notification system
│   └── ui/            # Basic UI components
├── pages/              # Page components
│   ├── admin/         # Admin-specific pages
│   └── teacher/       # Teacher-specific pages
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── context/            # React context providers
└── __tests__/          # Test files
    ├── components/     # Component tests
    ├── services/       # Service tests
    ├── hooks/          # Hook tests
    ├── utils/          # Utility tests
    └── integration/    # Integration tests
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Burhanali2211/islamic-website.git
   cd islamic-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the SQL schema file in your Supabase project:
   ```bash
   # Execute islamic-library-database-schema.sql in Supabase SQL editor
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Run Tests**
   ```bash
   npm run test
   ```

### Building for Production

```bash
npm run build
npm run preview
```

## Testing

The project includes comprehensive testing coverage:

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Categories
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Database and API integration testing
- **Component Tests**: React component behavior testing
- **Service Tests**: API service function testing
- **Hook Tests**: Custom React hook testing
- **Utility Tests**: Utility function testing

## Deployment

### Netlify Deployment
The project is configured for easy deployment to Netlify:

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy automatically on git push

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## API Documentation

Detailed API documentation is available in [docs/API.md](docs/API.md).

### Quick Reference

#### Authentication
- User registration, login, logout
- Profile management
- Role-based access control

#### Books
- CRUD operations for book management
- Advanced search and filtering
- Category management
- Featured books

#### Users
- User management (admin only)
- Profile updates
- Role assignments

#### Borrowing
- Book borrowing and returning
- Due date management
- Overdue tracking
- Borrowing history

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for new features
- Use Islamic terminology appropriately
- Maintain cultural sensitivity
- Follow the existing code style
- Update documentation for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in the `docs/` folder

## Acknowledgments

- IDARAH WALI UL ASER organization for the requirements and vision
- Islamic scholars for guidance on appropriate terminology
- Open source community for the excellent tools and libraries
- Contributors who helped build and improve this system

---

**Built with ❤️ for the Islamic educational community**
