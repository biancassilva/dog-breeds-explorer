# Dog Breeds Explorer API Documentation

## Overview

The Dog Breeds Explorer Backend API is a RESTful service built with Node.js, TypeScript, and Express. It provides endpoints for managing dog breeds, images, and favorites with an intelligent caching system for optimal performance.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://your-domain.com`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow a consistent JSON format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-07-29T20:51:38.815Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description",
  "timestamp": "2025-07-29T20:51:38.815Z"
}
```

## Endpoints

### Breeds

#### GET /api/breeds

Retrieve all dog breeds with their images.

**Response:**

```json
{
  "breeds": [
    {
      "name": "labrador",
      "image": "https://images.dog.ceo/breeds/labrador/n02099712_5941.jpg"
    }
  ],
  "count": 201,
  "duration": "2018ms"
}
```

**Cache Behavior:**

- **First Request**: Fetches from Dog CEO API (~2000ms)
- **Subsequent Requests**: Served from cache (~0ms)
- **TTL**: 1 hour

#### GET /api/breeds/:breed/images

Retrieve random images for a specific breed.

**Parameters:**

- `breed` (path): Breed name (e.g., "labrador", "bulldog")
- `count` (query): Number of images (default: 3, max: 10)

**Response:**

```json
[
  "https://images.dog.ceo/breeds/labrador/n02099712_5941.jpg",
  "https://images.dog.ceo/breeds/labrador/n02099712_5942.jpg",
  "https://images.dog.ceo/breeds/labrador/n02099712_5943.jpg"
]
```

**Cache Behavior:**

- **Cache Key**: `breed_images_{breed}_{count}`
- **TTL**: 30 minutes

### Favorites

#### GET /api/favorites

Retrieve all favorite breeds with their images.

**Response:**

```json
[
  {
    "breed": "labrador",
    "addedAt": "2025-07-29T20:46:41.276Z",
    "image": "https://images.dog.ceo/breeds/labrador/n02099712_5941.jpg"
  }
]
```

**Cache Integration:**

- Images are fetched using cached data when available
- Reduces API calls for favorite breed images

#### POST /api/favorites

Add a breed to favorites.

**Request Body:**

```json
{
  "breed": "labrador"
}
```

**Response:**

```json
{
  "breed": "labrador",
  "addedAt": "2025-07-29T20:46:41.276Z",
  "image": "https://images.dog.ceo/breeds/labrador/n02099712_5941.jpg"
}
```

#### DELETE /api/favorites/:breed

Remove a breed from favorites.

**Response:**

```json
{
  "success": true,
  "message": "Breed removed from favorites"
}
```

### Cache Management

#### GET /api/cache/stats

Get cache statistics and performance metrics.

**Response:**

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

**Statistics Explained:**

- `totalEntries`: Total number of cache entries (valid + expired)
- `validEntries`: Number of non-expired cache entries
- `expiredEntries`: Number of expired cache entries
- `cacheSize`: Current size of the cache map

#### POST /api/cache/clear

Clear cache entries.

**Request Body (Clear All):**

```json
{}
```

**Request Body (Clear Specific Breed):**

```json
{
  "breed": "labrador"
}
```

**Response:**

```json
{
  "success": true,
  "message": "All cache cleared",
  "timestamp": "2025-07-29T20:51:38.815Z"
}
```

#### POST /api/cache/cleanup

Remove expired cache entries.

**Response:**

```json
{
  "success": true,
  "message": "Cleaned up 5 expired cache entries",
  "deletedCount": 5,
  "timestamp": "2025-07-29T20:51:38.815Z"
}
```

### Health Check

#### GET /health

Check API health status.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2025-07-29T20:51:27.388Z",
  "uptime": 5.097605208
}
```

## Caching System

### Architecture

The caching system is built with the following components:

1. **CacheService** (`src/services/cacheService.ts`)

   - In-memory cache using Map
   - TTL-based expiration
   - Automatic cleanup
   - Statistics tracking

2. **DogApiService** (`src/services/dogApi.ts`)

   - Integration with CacheService
   - Intelligent cache key generation
   - Graceful fallback on cache misses

3. **Cache Routes** (`src/routes/cache.ts`)
   - Cache management endpoints
   - Statistics and monitoring

### Cache Strategy

| Data Type     | TTL        | Cache Key Pattern              | Description                      |
| ------------- | ---------- | ------------------------------ | -------------------------------- |
| Breeds List   | 1 hour     | `all_breeds_with_images`       | Complete breeds list with images |
| Breed Images  | 30 minutes | `breed_images_{breed}_{count}` | Multiple images per breed        |
| Single Images | 15 minutes | `breed_image_{breedPath}`      | Individual breed images          |

### Cache Key Generation

```typescript
// Breeds list
const cacheKey = "all_breeds_with_images";

// Single breed image
const cacheKey = `breed_image_${breedPath}`;

// Multiple breed images
const cacheKey = `breed_images_${breed}_${count}`;
```

### Performance Metrics

#### Response Times

- **Cache Hit**: ~0ms
- **Cache Miss**: ~2000ms (external API call)
- **Cache Hit Rate**: 90%+ for repeated requests

#### Memory Usage

- **Efficient Storage**: In-memory Map with automatic cleanup
- **Memory Management**: Expired entries automatically removed
- **Scalability**: Configurable TTL prevents memory leaks

### Cache Operations

#### Cache Hit Flow

1. Request received
2. Check cache for key
3. If found and not expired, return cached data
4. Log cache hit

#### Cache Miss Flow

1. Request received
2. Check cache for key
3. If not found or expired, fetch from external API
4. Store result in cache
5. Return data
6. Log cache miss and storage

#### Cache Cleanup

1. Automatic cleanup on cache access
2. Manual cleanup via API endpoint
3. Expired entries removed from memory

### Error Handling

#### Cache Failures

- **Graceful Fallback**: API calls proceed without cache
- **Error Logging**: Cache errors logged but don't break functionality
- **Recovery**: Cache automatically recovers on next request

#### External API Failures

- **Retry Logic**: Failed requests logged with warnings
- **Fallback Values**: Empty strings/arrays returned on failure
- **Error Propagation**: Errors properly propagated to client

## Rate Limiting

Currently, the API does not implement rate limiting. Consider implementing rate limiting for production use.

## CORS Configuration

The API supports CORS with the following configuration:

```typescript
cors({
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://dog-breeds-explorer.vercel.app"]
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
});
```

## Security

### Middleware

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Morgan**: Request logging
- **Express**: JSON body parsing with limits

### Timeouts

- **Request Timeout**: 30 seconds
- **API Client Timeout**: 10 seconds
- **Graceful Shutdown**: SIGTERM/SIGINT handling

## Monitoring

### Console Logging

The API provides comprehensive console logging:

```
📦 Returning cached breeds data
🔄 Fetching fresh breeds data from API
✅ Cached 201 breeds for 60 minutes
🗑️ Cleared cache for breed: labrador
```

### Performance Monitoring

- **Response Times**: Tracked in API responses
- **Cache Statistics**: Available via `/api/cache/stats`
- **Error Rates**: Logged for debugging

## Development

### Local Development

```bash
cd backend
npm install
npm run dev
```

### Testing Endpoints

```bash
# Test breeds endpoint
curl http://localhost:3001/api/breeds

# Test cache statistics
curl http://localhost:3001/api/cache/stats

# Test favorites
curl http://localhost:3001/api/favorites
```

### Debugging Cache

1. Check cache statistics: `GET /api/cache/stats`
2. Clear cache for testing: `POST /api/cache/clear`
3. Monitor console logs for cache operations
4. Use cache cleanup: `POST /api/cache/cleanup`

## Production Considerations

### Cache Configuration

- **TTL Values**: Adjust based on data freshness requirements
- **Memory Usage**: Monitor cache size and memory consumption
- **Cleanup Frequency**: Implement periodic cache cleanup

### Performance Optimization

- **Cache Warming**: Pre-populate cache on startup
- **TTL Optimization**: Balance freshness vs performance
- **Memory Management**: Regular cleanup of expired entries

### Monitoring

- **Cache Hit Rates**: Track cache effectiveness
- **Response Times**: Monitor API performance
- **Error Rates**: Track and alert on failures
- **Memory Usage**: Monitor cache memory consumption
