# Dog Breeds Explorer

A full-stack web application for exploring dog breeds with images, built with Vue.js frontend and Node.js backend with intelligent caching.

## 🚀 Features

### Frontend (Vue.js)

- 🐕 Browse all dog breeds with images
- 🔍 Search and filter breeds
- ❤️ Add/remove favorite breeds
- 🖼️ View multiple images per breed
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast loading with optimized state management

### Backend (Node.js + TypeScript)

- 🛡️ RESTful API with Express.js
- ⚡ **Intelligent Caching System** for optimal performance
- 🗄️ Persistent favorites storage
- 🔒 Security middleware (Helmet, CORS)
- 📝 Comprehensive logging and monitoring
- 🏥 Health check endpoints

## 🏗️ Architecture

```
dog-breeds-explorer/
├── client/                 # Vue.js Frontend
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── views/          # Page views
│   │   ├── stores/         # Pinia state management
│   │   ├── services/       # API client
│   │   └── router/         # Vue Router
│   └── package.json
├── backend/                # Node.js Backend
│   ├── src/
│   │   ├── services/       # Business logic
│   │   │   ├── dogApi.ts   # Dog CEO API integration
│   │   │   ├── cacheService.ts # Caching system
│   │   │   └── favoritesService.ts # Favorites management
│   │   ├── routes/         # API endpoints
│   │   └── middleware/     # Express middleware
│   └── package.json
└── README.md
```

## ⚡ Caching System

The backend implements a sophisticated caching system that significantly improves performance:

### Cache Features

- **In-Memory Storage**: Fast access using Map data structure
- **TTL-Based Expiration**: Configurable time-to-live for different data types
- **Automatic Cleanup**: Expired entries are automatically removed
- **Performance Monitoring**: Cache statistics and hit rates
- **Manual Control**: Clear specific or all cache entries via API

### Cache Strategy

| Data Type     | TTL        | Description                      |
| ------------- | ---------- | -------------------------------- |
| Breeds List   | 1 hour     | Complete breeds list with images |
| Breed Images  | 30 minutes | Multiple images per breed        |
| Single Images | 15 minutes | Individual breed images          |

### Performance Impact

- **First Request**: ~2000ms (external API call)
- **Cached Request**: ~0ms (memory access)
- **Cache Hit Rate**: 90%+ for repeated requests

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:3001`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📚 Documentation

### Backend Documentation

- [Backend README](./backend/README.md) - Setup and API overview
- [API Documentation](./backend/API_DOCUMENTATION.md) - Detailed API reference
- [Cache Guide](./backend/CACHE_GUIDE.md) - Caching system quick reference

### Frontend Documentation

- [Frontend README](./client/README.md) - Vue.js setup and features

## 🔧 API Endpoints

### Core Endpoints

- `GET /api/breeds` - Get all dog breeds (cached)
- `GET /api/breeds/:breed/images` - Get breed images (cached)
- `GET /api/favorites` - Get favorite breeds
- `POST /api/favorites` - Add breed to favorites
- `DELETE /api/favorites/:breed` - Remove breed from favorites

### Cache Management

- `GET /api/cache/stats` - Get cache statistics
- `POST /api/cache/clear` - Clear cache
- `POST /api/cache/cleanup` - Clean up expired entries

### Health Check

- `GET /health` - API health status

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

### Frontend Development

```bash
cd client
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Testing Cache

```bash
# Check cache statistics
curl http://localhost:3001/api/cache/stats

# Clear cache
curl -X POST http://localhost:3001/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{}'

# Test cache performance
curl http://localhost:3001/api/breeds  # First request (cache miss)
curl http://localhost:3001/api/breeds  # Second request (cache hit)
```

## 🔍 Monitoring

### Cache Performance

- Monitor cache hit rates via `/api/cache/stats`
- Check console logs for cache operations (📦 🔄 ✅ 🗑️)
- Track response times for cached vs uncached requests

### Application Health

- Health check endpoint: `GET /health`
- Request logging with Morgan
- Error handling and validation

## 🚀 Production Deployment

### Backend Considerations

- Set appropriate TTL values for your use case
- Monitor cache memory usage
- Implement cache warming strategies
- Set up cache cleanup schedules
- Configure error alerting

### Frontend Considerations

- Build optimization with Vite
- Static asset optimization
- Environment variable configuration
- CORS settings for production domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including cache functionality)
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Dog CEO API](https://dog.ceo/dog-api/) - Source for dog breed data and images
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Express.js](https://expressjs.com/) - Web application framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
