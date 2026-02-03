# FIKS API Documentation

Base URL: `http://localhost:5001/api`

## Table of Contents
- [Authentication](#authentication)
- [Services](#services)
- [Messages](#messages)
- [Reviews](#reviews)
- [Experience (Pervoja)](#experience-pervoja)
- [Search](#search)
- [Admin](#admin)

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "emri": "John",
  "mbiemri": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "klient",
  "telefoni": "+383123456789"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": 1, "emri": "John", ... },
    "token": "eyJhbGciOiJ...",
    "refreshToken": "eyJhbGciOiJ..."
  }
}
```

---

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJ...",
    "refreshToken": "eyJhbGciOiJ..."
  }
}
```

---

#### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJ..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": { "id": 1, "emri": "John", "email": "john@example.com", ... }
}
```

---

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "emri": "John Updated",
  "telefoni": "+383987654321"
}
```

---

## Services

### Get All Services
```http
GET /services
```

**Query Parameters:**
- `kategoria` - Filter by category
- `qyteti` - Filter by city
- `search` - Search term

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulli": "Plumbing Service",
      "pershkrimi": "Professional plumbing...",
      "cmimi": 50,
      "kategoria": "Hidraulik",
      "qyteti": "Prishtinë"
    }
  ]
}
```

---

### Get Service by ID
```http
GET /services/:id
```

---

### Create Service (Professional only)
```http
POST /services
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "titulli": "Web Development",
  "pershkrimi": "Full stack development services",
  "cmimi": 100,
  "kategoria": "IT",
  "qyteti": "Prishtinë"
}
```

---

### Update Service
```http
PUT /services/:id
Authorization: Bearer <token>
```

---

### Delete Service
```http
DELETE /services/:id
Authorization: Bearer <token>
```

---

### Get My Services
```http
GET /services/user/my-services
Authorization: Bearer <token>
```

---

## Messages

### Get Conversations
```http
GET /messages/conversations
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "partner_id": 2,
      "emri": "Jane",
      "mbiemri": "Doe",
      "mesazhi": "Hello!",
      "unread_count": 3
    }
  ]
}
```

---

### Get Messages with User
```http
GET /messages/:userId
Authorization: Bearer <token>
```

---

### Send Message
```http
POST /messages
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "receiver_id": 2,
  "mesazhi": "Hello, I'm interested in your service"
}
```

---

### Mark Messages as Read
```http
PUT /messages/read/:userId
Authorization: Bearer <token>
```

---

### Get Unread Count
```http
GET /messages/unread/count
Authorization: Bearer <token>
```

---

## Reviews

### Get Reviews for Service
```http
GET /reviews/service/:serviceId
```

---

### Create Review
```http
POST /reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "service_id": 1,
  "rating": 5,
  "comment": "Excellent service!"
}
```

---

### Update Review
```http
PUT /reviews/:id
Authorization: Bearer <token>
```

---

### Delete Review
```http
DELETE /reviews/:id
Authorization: Bearer <token>
```

---

## Experience (Pervoja)

### Get My Experience
```http
GET /pervoja/my
Authorization: Bearer <token>
```

---

### Get User's Experience
```http
GET /pervoja/user/:userId
```

---

### Create Experience
```http
POST /pervoja
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "pozita": "Senior Developer",
  "kompania": "Tech Company",
  "data_fillimit": "2020-01-01",
  "data_perfundimit": "2023-12-31",
  "pershkrimi": "Led development team..."
}
```

---

### Update Experience
```http
PUT /pervoja/:id
Authorization: Bearer <token>
```

---

### Delete Experience
```http
DELETE /pervoja/:id
Authorization: Bearer <token>
```

---

## Search

### Search Services
```http
GET /search?q=keyword
```

---

### Get Search Suggestions
```http
GET /search/suggestions?q=key
```

---

### Get Filters
```http
GET /search/filters
```

---

## Admin

All admin endpoints require admin role.

### Get Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

---

### Get Visitors
```http
GET /admin/visitors?period=daily|weekly|monthly
Authorization: Bearer <admin_token>
```

---

### Get All Users
```http
GET /admin/users
Authorization: Bearer <admin_token>
```

---

### Get All Services
```http
GET /admin/services
Authorization: Bearer <admin_token>
```

---

### Delete User
```http
DELETE /admin/users/:id
Authorization: Bearer <admin_token>
```

---

### Delete Service
```http
DELETE /admin/services/:id
Authorization: Bearer <admin_token>
```

---

## Error Responses

All endpoints may return:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/expired token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Server Error |

---

## Security Features

### Token Management
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)
- Automatic token refresh on 401 response
- Tokens stored securely in localStorage

### Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Passwords never returned in API responses
