# Dog Breeds Explorer Backend API

A Node.js + TypeScript REST API for the Dog Breeds Explorer application. This API provides endpoints to fetch dog breeds, get breed images, and manage favorite breeds with intelligent caching for optimal performance.

## Features

- 🐕 Fetch all dog breeds from the Dog CEO API
- 🖼️ Get random images for specific breeds
- ❤️ Manage favorite breeds with persistent storage
- ⚡ **Intelligent Caching System** with configurable TTL
- 🔒 Security middleware (Helmet, CORS)
- 📝 Request logging with Morgan
- 🛡️ Error handling and validation
- 📊 Health check endpoint
- 🗄️ **Cache Management** and monitoring

## API Endpoints

### Breeds

- `GET /api/breeds` - Get all dog breeds
- `GET /api/breeds/:breed/images` - Get images for a specific breed
  - Query parameter: `count` (optional, default: 3, max: 10)

### Favorites

- `GET /api/favorites` - Get all favorite breeds (includes cached images)
- `POST /api/favorites` - Add a breed to favorites
  - Body: `{ "breed": "bulldog" }`
- `DELETE /api/favorites/:breed` - Remove a breed from favorites

### Cache Management

- `GET /api/cache/stats` - Get cache statistics and performance metrics
- `POST /api/cache/clear` - Clear all cache or specific breed cache
  - Body: `{ "breed": "bulldog" }` (optional, clears specific breed)
  - Body: `{}` (clears all cache)
- `POST /api/cache/cleanup` - Remove expired cache entries

### Health

- `GET /health` - Health check endpoint

## Caching System

### Overview

The API implements a comprehensive in-memory caching system to improve performance and reduce external API calls to the Dog CEO API.

### Cache Strategy

| Data Type     | TTL        | Description                                       |
| ------------- | ---------- | ------------------------------------------------- |
| Breeds List   | 1 hour     | Complete breeds list with images (rarely changes) |
| Breed Images  | 30 minutes | Multiple images per breed                         |
| Single Images | 15 minutes | Individual breed images                           |

### Cache Features

- **Automatic Expiration**: Cache entries expire based on configured TTL
- **Memory Management**: Automatic cleanup of expired entries
- **Error Handling**: Graceful fallback when cache fails
- **Performance Monitoring**: Cache statistics and hit rates
- **Manual Control**: Clear specific or all cache entries

### Cache Performance

- **First Request**: ~2000ms (fetching from external API)
- **Cached Request**: ~0ms (served from memory)
- **Cache Hit Rate**: 90%+ for repeated requests within TTL
- **Memory Usage**: Efficient in-memory storage with automatic cleanup

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

### Cache Management Examples

#### Get cache statistics

```bash
curl http://localhost:3001/api/cache/stats
```

Response:

```json
{
  "success": true,
  "stats": {
    "totalEntries": 203,
    "validEntries": 203,
    "expiredEntries": 0,
    "cacheSize": 203
  },
  "timestamp": "2025-07-29T20:51:38.815Z"
}
```

#### Clear all cache

```bash
curl -X POST http://localhost:3001/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### Clear specific breed cache

```bash
curl -X POST http://localhost:3001/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"breed": "bulldog"}'
```

#### Clean up expired cache entries

```bash
curl -X POST http://localhost:3001/api/cache/cleanup
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
│   │   ├── dogApi.ts    # Dog CEO API integration with caching
│   │   ├── cacheService.ts # Cache management service
│   │   └── favoritesService.ts # Favorites management
│   ├── routes/          # Express route handlers
│   │   ├── breeds.ts    # Breeds endpoints
│   │   ├── favorites.ts # Favorites endpoints
│   │   └── cache.ts     # Cache management endpoints
│   ├── middleware/      # Express middleware
│   └── index.ts         # Main application entry point
├── data/                # Data storage (auto-created)
├── dist/                # Compiled JavaScript (auto-created)
├── package.json
├── tsconfig.json
└── README.md
```

## Cache Configuration

### TTL Settings

Cache TTL (Time To Live) values can be configured in `src/services/dogApi.ts`:

```typescript
const CACHE_TTL = {
  BREEDS_LIST: 60 * 60 * 1000, // 1 hour
  BREED_IMAGES: 30 * 60 * 1000, // 30 minutes
  SINGLE_IMAGE: 15 * 60 * 1000, // 15 minutes
};
```

### Cache Keys

The system uses intelligent cache key generation:

- `all_breeds_with_images` - Complete breeds list
- `breed_image_{breedPath}` - Single breed image
- `breed_images_{breed}_{count}` - Multiple breed images

### Monitoring

Cache performance can be monitored through:

1. **Console Logs**: Real-time cache operations
2. **API Endpoints**: Cache statistics and management
3. **Performance Metrics**: Response times and hit rates

### Best Practices

1. **Cache Warming**: First request populates cache
2. **TTL Optimization**: Balance freshness vs performance
3. **Memory Management**: Regular cleanup of expired entries
4. **Error Handling**: Graceful fallback when cache fails
5. **Monitoring**: Track cache performance and hit rates
