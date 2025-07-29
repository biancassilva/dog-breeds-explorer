# Dog Breeds Explorer Backend API

A Node.js + TypeScript REST API for the Dog Breeds Explorer application. This API provides endpoints to fetch dog breeds, get breed images, and manage favorite breeds.

## Features

- 🐕 Fetch all dog breeds from the Dog CEO API
- 🖼️ Get random images for specific breeds
- ❤️ Manage favorite breeds with persistent storage
- 🔒 Security middleware (Helmet, CORS)
- 📝 Request logging with Morgan
- 🛡️ Error handling and validation
- 📊 Health check endpoint

## API Endpoints

### Breeds

- `GET /api/breeds` - Get all dog breeds
- `GET /api/breeds/:breed/images` - Get images for a specific breed
  - Query parameter: `count` (optional, default: 3, max: 10)

### Favorites

- `GET /api/favorites` - Get all favorite breeds
- `POST /api/favorites` - Add a breed to favorites
  - Body: `{ "breed": "bulldog" }`
- `DELETE /api/favorites/:breed` - Remove a breed from favorites

### Health

- `GET /health` - Health check endpoint

## Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Production

Build and start the production server:

```bash
npm run build
npm start
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

## Data Storage

Favorites are stored in a JSON file at `data/favorites.json`. The file is automatically created when the first favorite is added.

## API Examples

### Get all breeds

```bash
curl http://localhost:3001/api/breeds
```

### Get images for a breed

```bash
curl http://localhost:3001/api/breeds/bulldog/images
curl http://localhost:3001/api/breeds/bulldog/images?count=5
```

### Add a favorite

```bash
curl -X POST http://localhost:3001/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"breed": "bulldog"}'
```

### Get favorites

```bash
curl http://localhost:3001/api/favorites
```

### Remove a favorite

```bash
curl -X DELETE http://localhost:3001/api/favorites/bulldog
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (invalid parameters)
- `404` - Not Found (breed not found in favorites)
- `409` - Conflict (breed already in favorites)
- `500` - Internal Server Error

## External Dependencies

- [Dog CEO API](https://dog.ceo/dog-api/) - Source for dog breed data and images

## Project Structure

```
backend/
├── src/
│   ├── types/           # TypeScript type definitions
│   ├── services/        # Business logic services
│   ├── routes/          # Express route handlers
│   ├── middleware/      # Express middleware
│   └── index.ts         # Main application entry point
├── data/                # Data storage (auto-created)
├── dist/                # Compiled JavaScript (auto-created)
├── package.json
├── tsconfig.json
└── README.md
```
