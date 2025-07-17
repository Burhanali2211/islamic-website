# API Documentation

## Overview

The IDARAH WALI UL ASER Islamic Library Management System API provides comprehensive endpoints for managing books, users, borrowing records, and administrative functions. All endpoints use RESTful conventions and return JSON responses.

## Base URL

```
Production: https://your-domain.netlify.app/api
Development: http://localhost:5173/api
```

## Authentication

The API uses Supabase authentication with JWT tokens. Include the authorization header in all authenticated requests:

```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass123!",
  "full_name": "Ahmad Ali",
  "role": "student"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "user_metadata": {
        "full_name": "Ahmad Ali",
        "role": "student"
      }
    },
    "session": {
      "access_token": "jwt_token",
      "expires_at": 1234567890
    }
  },
  "error": null
}
```

#### POST /auth/signin
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com"
    },
    "session": {
      "access_token": "jwt_token",
      "expires_at": 1234567890
    }
  },
  "error": null
}
```

#### POST /auth/signout
Sign out current user and invalidate session.

**Response:**
```json
{
  "error": null
}
```

#### GET /auth/user
Get current authenticated user information.

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "user_metadata": {
        "full_name": "Ahmad Ali",
        "role": "student"
      }
    }
  },
  "error": null
}
```

## Book Management

### GET /books
Retrieve list of books with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by Islamic category
- `author` (string): Filter by author name
- `language` (string): Filter by language
- `available_only` (boolean): Show only available books
- `featured_only` (boolean): Show only featured books

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Sahih Bukhari",
      "author": "Imam Bukhari",
      "category": "hadith",
      "isbn": "978-0123456789",
      "description": "Collection of authentic hadiths",
      "language": "arabic",
      "pages": 500,
      "publisher": "Islamic Publications",
      "publication_year": 850,
      "is_featured": true,
      "is_available": true,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ],
  "error": null,
  "count": 150,
  "page": 1,
  "total_pages": 8
}
```

### POST /books
Create a new book record. Requires admin or teacher role.

**Request Body:**
```json
{
  "title": "Tafsir Ibn Kathir",
  "author": "Ibn Kathir",
  "category": "tafsir",
  "isbn": "978-0987654321",
  "description": "Comprehensive Quranic commentary",
  "language": "arabic",
  "pages": 800,
  "publisher": "Dar al-Kutub",
  "publication_year": 1365,
  "is_featured": false,
  "is_available": true
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Tafsir Ibn Kathir",
    "author": "Ibn Kathir",
    // ... other fields
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "error": null
}
```

### PUT /books/:id
Update an existing book. Requires admin or teacher role.

**Request Body:** (partial update supported)
```json
{
  "is_featured": true,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    // ... updated book data
  },
  "error": null
}
```

### DELETE /books/:id
Delete a book record. Requires admin role.

**Response:**
```json
{
  "error": null
}
```

### GET /books/search
Advanced book search with multiple criteria.

**Query Parameters:**
- `q` (string): Search query for title/author
- `category` (string): Islamic category filter
- `author` (string): Author name filter
- `language` (string): Language filter
- `year_from` (number): Publication year range start
- `year_to` (number): Publication year range end
- `available_only` (boolean): Available books only
- `featured_only` (boolean): Featured books only

**Response:**
```json
{
  "data": [
    // ... array of matching books
  ],
  "error": null,
  "total_results": 25
}
```

## User Management

### GET /users
Retrieve list of users. Requires admin role.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `role` (string): Filter by user role
- `search` (string): Search by name or email

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "student@example.com",
      "full_name": "Ahmad Ali",
      "role": "student",
      "phone": "+92-300-1234567",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "last_login": "2023-01-15T10:30:00Z"
    }
  ],
  "error": null
}
```

### POST /users
Create a new user account. Requires admin role.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "full_name": "Fatima Zahra",
  "role": "teacher",
  "phone": "+92-300-9876543"
}
```

### PUT /users/:id
Update user information.

**Request Body:**
```json
{
  "full_name": "Updated Name",
  "phone": "+92-300-1111111"
}
```

### DELETE /users/:id
Delete user account. Requires admin role.

## Borrowing System

### POST /borrowing
Create a new borrowing record.

**Request Body:**
```json
{
  "book_id": "uuid",
  "due_date": "2023-02-15T00:00:00Z"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "book_id": "uuid",
    "borrowed_at": "2023-02-01T00:00:00Z",
    "due_date": "2023-02-15T00:00:00Z",
    "returned_at": null,
    "status": "active",
    "book": {
      "title": "Sahih Bukhari",
      "author": "Imam Bukhari"
    }
  },
  "error": null
}
```

### PUT /borrowing/:id/return
Return a borrowed book.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "returned_at": "2023-02-10T00:00:00Z",
    "status": "returned"
  },
  "error": null
}
```

### GET /borrowing/user/:id
Get borrowing history for a specific user.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "book_id": "uuid",
      "borrowed_at": "2023-02-01T00:00:00Z",
      "due_date": "2023-02-15T00:00:00Z",
      "returned_at": "2023-02-10T00:00:00Z",
      "status": "returned",
      "book": {
        "title": "Sahih Bukhari",
        "author": "Imam Bukhari"
      }
    }
  ],
  "error": null
}
```

### GET /borrowing/overdue
Get list of overdue books. Requires admin or teacher role.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "book_id": "uuid",
      "due_date": "2023-01-15T00:00:00Z",
      "days_overdue": 5,
      "user": {
        "full_name": "Ahmad Ali",
        "email": "ahmad@example.com"
      },
      "book": {
        "title": "Tafsir Ibn Kathir",
        "author": "Ibn Kathir"
      }
    }
  ],
  "error": null
}
```

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "data": null,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `DUPLICATE_KEY`: Unique constraint violation
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API requests are rate-limited to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Pagination

List endpoints support pagination with these parameters:
- `page`: Page number (1-based)
- `limit`: Items per page (max 100)

Response includes pagination metadata:
```json
{
  "data": [...],
  "page": 1,
  "limit": 20,
  "total": 150,
  "total_pages": 8
}
```

## Real-time Features

The API supports real-time updates via WebSocket connections:

### Channels
- `books-changes`: Book CRUD operations
- `borrowing-updates`: Borrowing record changes
- `user-presence`: Online user tracking
- `notifications`: System notifications

### Subscription Example
```javascript
const channel = supabase
  .channel('books-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'books' },
    (payload) => console.log('Book updated:', payload)
  )
  .subscribe();
```
