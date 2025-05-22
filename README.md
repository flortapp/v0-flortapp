# Date App CMS Frontend

This is the frontend for the Date App CMS, built with Next.js and using a mock backend for local development.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/dateapp_cms_front.git
cd dateapp_cms_front
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:

\`\`\`
# API Configuration
NEXT_PUBLIC_USE_REAL_API=false
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_API_TIMEOUT=5000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Application Settings
NEXT_PUBLIC_APP_NAME=Date App CMS
NEXT_PUBLIC_DEBUG_MODE=true
\`\`\`

4. Start the development server
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

### Core Variables

- `NEXT_PUBLIC_USE_REAL_API`: Set to "true" to use the real backend API, "false" to use mock data
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the real backend API (used when `USE_REAL_API` is true)
- `NEXT_PUBLIC_API_TIMEOUT`: Timeout in milliseconds for API requests

### Feature Flags

- `NEXT_PUBLIC_ENABLE_ANALYTICS`: Enable/disable analytics features
- `NEXT_PUBLIC_ENABLE_NOTIFICATIONS`: Enable/disable notification features

### Application Settings

- `NEXT_PUBLIC_APP_NAME`: Application name displayed in the UI
- `NEXT_PUBLIC_DEBUG_MODE`: Enable/disable debug mode for additional logging

## Development Approach

This project follows a frontend-first development approach, using mock data for local development. The key aspects of this approach are:

### Mock Backend

- The application uses a mock API service (`services/api-mock.ts`) that simulates backend responses
- Mock data is initialized when the application starts
- API calls have simulated network delays to mimic real-world conditions

### State Management

- React Context API is used for global state management
- The `AppStateContext` provides access to users, bots, and conversations data
- Custom hooks (`use-api-data.ts`) handle data fetching and state updates

### Component Architecture

- Components are organized by feature
- UI components are separated from data fetching logic
- Responsive design is implemented using Tailwind CSS

## Transitioning to a Real Backend

When you're ready to connect to a real backend:

1. Set `NEXT_PUBLIC_USE_REAL_API=true` in your environment variables
2. Implement the real API service in `services/api-real.ts`
3. Update `services/api.ts` to import and use the real API service
4. Test the integration with the real backend

## Project Structure

\`\`\`
├── app/                  # Next.js app directory
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── ...               # Other pages
├── components/           # React components
│   ├── ui/               # UI components
│   ├── users/            # User-related components
│   └── ...               # Other component categories
├── config/               # Configuration files
│   └── env.ts            # Environment variable configuration
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── services/             # API services
│   ├── api.ts            # API service entry point
│   └── api-mock.ts       # Mock API implementation
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
\`\`\`

## Best Practices

- Keep components focused on a single responsibility
- Use TypeScript for type safety
- Follow the container/presentational component pattern
- Use custom hooks for reusable logic
- Keep UI components separate from data fetching
- Use responsive design principles
