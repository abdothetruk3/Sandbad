# Vue 3 + Vite Pharmacy App with Express Server

This project combines a Vue 3 frontend with an Express backend server.

## Frontend (Vue 3 + Vite)

The frontend is built with Vue 3 using the Composition API and SFC (Single File Components).

### Frontend Features
- Vue 3 with Composition API
- Vite for fast development
- Vue Router for navigation
- Pinia for state management
- Tailwind CSS for styling
- Supabase integration for backend services
- Multilingual support (English and Arabic)
- Responsive design

## Backend (Express)

The backend is a Node.js Express server that serves the built Vue application and provides additional API endpoints.

### Backend Features
- Static file serving for the built Vue app
- API endpoints for server-side operations
- CORS configuration
- Security headers with Helmet
- Request logging with Morgan
- Compression for improved performance

## Getting Started

### Development

1. Install dependencies:
```
npm install
```

2. Run the Vite development server:
```
npm run dev
```

### Production

1. Build the Vue app:
```
npm run build
```

2. Start the Express server:
```
npm start
```

The application will be available at http://localhost:3000.

## API Endpoints

- `GET /api/health`: Health check endpoint
- Additional endpoints as needed

## Environment Variables

Copy `.env.example` to `.env` and adjust the values as needed:

- `PORT`: The port on which the server will run (default: 3000)
- `NODE_ENV`: The environment mode (development, production)

## Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Express Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)