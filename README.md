```
    # FLYBY SPOTTER

A Next.js application for tracking and displaying flight information with Auth0 device-based authentication.

## Features

- Auth0 device-based authentication with QR code
- Secure access to flight information
- Real-time flight tracking display
- Responsive design

## Authentication Flow

This application uses Auth0's device authorization flow, which is ideal for devices with limited input capabilities or for seamless authentication across devices:

1. The application displays a QR code and a user code
2. The user scans the QR code with their mobile device or visits the URL and enters the code
3. The user completes authentication on their mobile device
4. The application polls Auth0 for authentication status
5. Once authenticated, the user can access the application

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ccmelvin/flyby-spotter-banner-v3.git
cd flyby-spotter-banner-v3
```

2. Install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
```

3. Create a `.env.local` file based on `.env.local.example` and fill in your Auth0 credentials:
```
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_AUDIENCE=your-auth0-audience
AUTH0_SCOPE=openid profile email offline_access
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on your Raspberry Pi
- Git for cloning the repository

### Deployment Steps

1. Clone the repository:
```bash
git clone https://github.com/ccmelvin/flyby-spotter-banner-v3.git
cd flyby-spotter-banner-v3
```

2. Build and start the Docker container:
```bash
docker-compose up -d
```

3. Access the application at http://localhost:3000 or http://[your-raspberry-pi-ip]:3000

### Using the Deployment Script

A deployment script is included to simplify Docker operations:

1. Make the script executable:
```bash
chmod +x docker-deploy.sh
```

2. Use the script for common operations:
```bash
# Deploy the application
./docker-deploy.sh deploy

# View logs
./docker-deploy.sh logs

# Check status
./docker-deploy.sh status

# Restart the container
./docker-deploy.sh restart

# Stop the container
./docker-deploy.sh stop

# Clean up unused Docker resources
./docker-deploy.sh cleanup
```

### Environment Variables

The Docker Compose file includes default environment variables. If you need to customize them:

1. Create a `.env` file in the project root
2. Add your custom environment variables
3. Restart the container:
```bash
docker-compose down
docker-compose up -d
```

### Raspberry Pi Optimizations

The Docker setup includes several optimizations for running on a Raspberry Pi:

- Uses tmpfs for temporary files to reduce writes to the SD card
- Configures logging to minimize disk writes
- Sets appropriate resource limits for Raspberry Pi hardware
- Disables source maps in production to reduce size and disk writes

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/app/api` - API routes
- `/src/app/auth` - Authentication-related pages
- `/src/auth` - Auth0 configuration and utilities
- `/src/components` - React components

## Authentication Files

- `/src/auth/auth0-config.ts` - Auth0 configuration
- `/src/auth/auth-utils.ts` - Authentication utilities
- `/src/app/api/auth/device/route.ts` - Device code API endpoints
- `/src/app/api/auth/device/poll/route.ts` - Polling API endpoint
- `/src/app/auth/callback/page.tsx` - Auth0 callback page
- `/src/app/auth/verify/page.tsx` - Verification page
- `/src/app/auth/signin/page.tsx` - Sign-in page with QR code

## License

This project is licensed under the MIT License.

    ```

