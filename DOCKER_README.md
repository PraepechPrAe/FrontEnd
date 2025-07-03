# 🏭 Warehouse Management System - Docker Deployment

This guide explains how to run the Warehouse Management System using Docker.

## 🚀 Quick Start

### Option 1: Simple Docker Run (Recommended for Development)

\`\`\`bash
# Make the script executable
chmod +x docker-scripts.sh

# Build and run the application
./docker-scripts.sh run-simple
\`\`\`

Access the application at: http://localhost:3000

### Option 2: Full Production Setup (with Nginx)

\`\`\`bash
# Start the full stack (Next.js + Nginx)
./docker-scripts.sh up
\`\`\`

Access the application at: http://localhost (port 80)

## 📋 Available Commands

\`\`\`bash
# Build the Docker image
./docker-scripts.sh build

# Start with docker-compose (production setup)
./docker-scripts.sh up

# Stop docker-compose services
./docker-scripts.sh down

# View application logs
./docker-scripts.sh logs

# Run simple container (development)
./docker-scripts.sh run-simple

# Stop simple container
./docker-scripts.sh stop-simple

# Clean up Docker resources
./docker-scripts.sh cleanup

# Show help
./docker-scripts.sh help
\`\`\`

## 🏗️ Architecture

### Simple Setup
\`\`\`
Browser → Docker Container (Next.js:3000)
\`\`\`

### Production Setup
\`\`\`
Browser → Nginx (Port 80) → Next.js Container (Port 3000)
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for custom configuration:

\`\`\`env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
\`\`\`

### Docker Compose Services

- **warehouse-dashboard**: Main Next.js application
- **nginx**: Reverse proxy with rate limiting and caching

## 📊 Health Monitoring

The application includes a health check endpoint:

- **Endpoint**: `/api/health`
- **Docker Health Check**: Automatic container health monitoring
- **Nginx Health**: Available at `/health`

## 🔒 Security Features

- Rate limiting (API: 10 req/s, General: 30 req/s)
- Security headers (XSS, CSRF protection)
- Gzip compression
- Static file caching

## 🐛 Troubleshooting

### Check Container Status
\`\`\`bash
docker ps
docker-compose ps
\`\`\`

### View Logs
\`\`\`bash
./docker-scripts.sh logs
docker logs warehouse-dashboard
\`\`\`

### Restart Services
\`\`\`bash
./docker-scripts.sh down
./docker-scripts.sh up
\`\`\`

### Clean Rebuild
\`\`\`bash
./docker-scripts.sh cleanup
./docker-scripts.sh build
./docker-scripts.sh up
\`\`\`

## 📈 Performance Optimization

- **Multi-stage build**: Reduces final image size
- **Standalone output**: Optimized Next.js build
- **Nginx caching**: Static assets cached for 1 year
- **Gzip compression**: Reduces bandwidth usage

## 🔄 Updates

To update the application:

\`\`\`bash
# Pull latest code
git pull

# Rebuild and restart
./docker-scripts.sh down
./docker-scripts.sh build
./docker-scripts.sh up
\`\`\`

## 📝 Notes

- The application runs on Node.js 18 Alpine for minimal size
- Uses non-root user for security
- Includes automatic restart policies
- Health checks ensure container reliability
