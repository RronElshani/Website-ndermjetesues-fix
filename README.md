# Fiks Platform

A full-stack marketplace platform connecting clients with professionals for various services.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Containerization**: Docker

## Project Structure

```
├── frontend/          # React application
├── backend/           # Express API server
├── database/          # SQL initialization scripts
├── docker/            # Docker configuration
└── docker-compose.yml # Orchestration file
```

## Getting Started

### Development Mode

1. **Start the database**:
   ```bash
   docker-compose up postgres -d
   ```

2. **Start the backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start the frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Production Mode (Docker)

```bash
docker-compose up --build
```

This starts all services:
- Frontend: http://localhost
- Backend API: http://localhost:5000
- Database: localhost:5432

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile

### Services
- `GET /api/services` - List all services (with filters)
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (professionals only)
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## Environment Variables

See `backend/.env.example` for required environment variables.
