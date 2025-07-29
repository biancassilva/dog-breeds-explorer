# Dog Breeds Explorer - Frontend

A modern Vue 3 frontend application for exploring dog breeds, built with TypeScript, Tailwind CSS, and Pinia for state management.

## Features

- 🐕 **Browse All Breeds**: View a comprehensive list of all available dog breeds
- ❤️ **Favorites System**: Mark and manage your favorite breeds
- 🖼️ **Breed Images**: View beautiful images for each breed in a modal gallery
- 🔍 **Search & Filter**: Search breeds by name and filter by favorites
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- ⚡ **Modern Stack**: Built with Vue 3, TypeScript, and Tailwind CSS

## Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── Layout/         # Layout components
│   ├── BreedCard.vue   # Individual breed card
│   └── BreedImagesModal.vue # Image gallery modal
├── views/              # Page components
│   ├── HomeView.vue    # Home page with all breeds
│   └── FavoritesView.vue # Favorites management page
├── stores/             # Pinia stores
│   └── breeds.ts       # Main application state
├── services/           # API services
│   └── api.ts          # HTTP client and API methods
├── router/             # Vue Router configuration
├── assets/             # Static assets
└── main.ts             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## API Integration

The frontend communicates with the backend API through the following endpoints:

- `GET /api/breeds` - Get all dog breeds
- `GET /api/breeds/:breed/images` - Get images for a specific breed
- `GET /api/favorites` - Get all favorite breeds
- `POST /api/favorites` - Add a breed to favorites
- `DELETE /api/favorites/:breed` - Remove a breed from favorites

## Key Components

### BreedCard

Displays individual breed information with:

- Breed name
- Favorite toggle button
- View images button
- Loading states

### BreedImagesModal

Modal component for viewing breed images with:

- Image grid layout
- Full-screen image viewer
- Loading and error states
- Responsive design

### AppHeader

Navigation header with:

- App logo and title
- Navigation links
- Favorites counter
- Loading and error indicators

## State Management

The application uses Pinia for state management with a single `breeds` store that handles:

- **Breeds Data**: List of all available breeds
- **Favorites**: User's favorite breeds
- **Breed Images**: Cached images for each breed
- **Loading States**: API request loading indicators
- **Error Handling**: Error messages and recovery

## Styling

The application uses Tailwind CSS with custom components and utilities:

- **Custom Colors**: Primary and secondary color schemes
- **Custom Animations**: Fade-in, slide-up, and gentle bounce effects
- **Component Classes**: Pre-built button, card, and input styles
- **Responsive Design**: Mobile-first approach with breakpoints

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Style

The project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Vue 3 Composition API** for component logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
