# Cache System Quick Reference Guide

## Overview

The Dog Breeds Explorer API uses an intelligent in-memory caching system to improve performance and reduce external API calls.

## Quick Start

### Check Cache Status

```bash
curl http://localhost:3001/api/cache/stats
```

### Clear All Cache

```bash
curl -X POST http://localhost:3001/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Clear Specific Breed Cache

```bash
curl -X POST http://localhost:3001/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"breed": "labrador"}'
```

## Cache Configuration

### TTL Settings (src/services/dogApi.ts)

```typescript
const CACHE_TTL = {
  BREEDS_LIST: 60 * 60 * 1000, // 1 hour
  BREED_IMAGES: 30 * 60 * 1000, // 30 minutes
  SINGLE_IMAGE: 15 * 60 * 1000, // 15 minutes
};
```

### Cache Keys

| Data Type       | Cache Key Pattern              | Example                   |
| --------------- | ------------------------------ | ------------------------- |
| Breeds List     | `all_breeds_with_images`       | `all_breeds_with_images`  |
| Single Image    | `breed_image_{breedPath}`      | `breed_image_labrador`    |
| Multiple Images | `breed_images_{breed}_{count}` | `breed_images_labrador_3` |

## Performance Metrics

### Response Times

- **Cache Hit**: ~0ms
- **Cache Miss**: ~2000ms
- **Cache Hit Rate**: 90%+

### Memory Usage

- **Storage**: In-memory Map
- **Cleanup**: Automatic expiration
- **Monitoring**: Via `/api/cache/stats`

## Console Logs

### Cache Operations

```
📦 Returning cached breeds data          # Cache hit
🔄 Fetching fresh breeds data from API   # Cache miss
✅ Cached 201 breeds for 60 minutes      # Cache storage
🗑️ Cleared cache for breed: labrador     # Cache cleanup
```

## API Endpoints

### Cache Management

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/api/cache/stats`   | Get cache statistics        |
| POST   | `/api/cache/clear`   | Clear all or specific cache |
| POST   | `/api/cache/cleanup` | Remove expired entries      |

### Cached Endpoints

| Endpoint                        | Cache TTL          | Cache Key                      |
| ------------------------------- | ------------------ | ------------------------------ |
| `GET /api/breeds`               | 1 hour             | `all_breeds_with_images`       |
| `GET /api/breeds/:breed/images` | 30 min             | `breed_images_{breed}_{count}` |
| `GET /api/favorites`            | Uses cached images | N/A                            |

## Development Workflow

### 1. Testing Cache

```bash
# First request (cache miss)
curl http://localhost:3001/api/breeds

# Second request (cache hit)
curl http://localhost:3001/api/breeds

# Check cache stats
curl http://localhost:3001/api/cache/stats
```

### 2. Debugging Cache Issues

```bash
# Clear cache for testing
curl -X POST http://localhost:3001/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{}'

# Check cache statistics
curl http://localhost:3001/api/cache/stats

# Clean up expired entries
curl -X POST http://localhost:3001/api/cache/cleanup
```

### 3. Monitoring Cache Performance

```bash
# Get detailed cache stats
curl http://localhost:3001/api/cache/stats | jq

# Monitor console logs for cache operations
# Look for: 📦 🔄 ✅ 🗑️ emojis
```

## Common Scenarios

### Scenario 1: Testing Fresh Data

```bash
# Clear cache to force fresh API calls
curl -X POST http://localhost:3001/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{}'

# Make request (will fetch from external API)
curl http://localhost:3001/api/breeds
```

### Scenario 2: Testing Cache Performance

```bash
# First request (cache miss)
time curl http://localhost:3001/api/breeds

# Second request (cache hit)
time curl http://localhost:3001/api/breeds
```

### Scenario 3: Clearing Specific Breed Cache

```bash
# Clear cache for specific breed
curl -X POST http://localhost:3001/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"breed": "labrador"}'

# Verify cache was cleared
curl http://localhost:3001/api/cache/stats
```

## Troubleshooting

### Issue: Cache Not Working

1. Check if cache service is running
2. Verify cache statistics: `GET /api/cache/stats`
3. Check console logs for cache operations
4. Clear cache and retry: `POST /api/cache/clear`

### Issue: Memory Usage High

1. Check cache size: `GET /api/cache/stats`
2. Clean up expired entries: `POST /api/cache/cleanup`
3. Clear all cache: `POST /api/cache/clear`
4. Monitor cache growth over time

### Issue: Stale Data

1. Check TTL settings in `src/services/dogApi.ts`
2. Clear cache for fresh data: `POST /api/cache/clear`
3. Adjust TTL values if needed
4. Monitor cache expiration

## Best Practices

### 1. Cache Warming

- First request populates cache
- Consider pre-warming on startup for production

### 2. TTL Optimization

- Balance data freshness vs performance
- Monitor cache hit rates
- Adjust TTL based on usage patterns

### 3. Memory Management

- Regular cleanup of expired entries
- Monitor cache size and memory usage
- Clear cache when needed

### 4. Error Handling

- Cache failures don't break functionality
- Graceful fallback to external API
- Monitor cache error rates

### 5. Monitoring

- Track cache hit rates
- Monitor response times
- Check cache statistics regularly

## Production Checklist

- [ ] Monitor cache hit rates
- [ ] Set appropriate TTL values
- [ ] Implement cache warming
- [ ] Monitor memory usage
- [ ] Set up cache cleanup schedules
- [ ] Configure error alerting
- [ ] Document cache policies
- [ ] Test cache recovery scenarios
