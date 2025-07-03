#!/bin/bash

# Docker Scripts for Warehouse Management System

# Build the Docker image
build() {
    echo "🔨 Building Docker image..."
    docker build -t warehouse-dashboard:latest .
    echo "✅ Build completed!"
}

# Run with docker-compose (recommended)
up() {
    echo "🚀 Starting Warehouse Management System..."
    docker-compose up -d
    echo "✅ Application started!"
    echo "🌐 Access the application at: http://localhost"
    echo "📊 Direct app access at: http://localhost:3000"
}

# Stop the application
down() {
    echo "🛑 Stopping Warehouse Management System..."
    docker-compose down
    echo "✅ Application stopped!"
}

# View logs
logs() {
    echo "📋 Viewing application logs..."
    docker-compose logs -f warehouse-dashboard
}

# Run without nginx (simple setup)
run-simple() {
    echo "🚀 Starting simple Docker container..."
    docker run -d \
        --name warehouse-dashboard \
        -p 3000:3000 \
        --restart unless-stopped \
        warehouse-dashboard:latest
    echo "✅ Application started!"
    echo "🌐 Access the application at: http://localhost:3000"
}

# Stop simple container
stop-simple() {
    echo "🛑 Stopping simple container..."
    docker stop warehouse-dashboard
    docker rm warehouse-dashboard
    echo "✅ Container stopped and removed!"
}

# Clean up Docker resources
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    echo "✅ Cleanup completed!"
}

# Show help
help() {
    echo "🏭 Warehouse Management System - Docker Scripts"
    echo ""
    echo "Usage: ./docker-scripts.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build        Build the Docker image"
    echo "  up           Start with docker-compose (with nginx)"
    echo "  down         Stop docker-compose services"
    echo "  logs         View application logs"
    echo "  run-simple   Run simple container (port 3000)"
    echo "  stop-simple  Stop simple container"
    echo "  cleanup      Clean up Docker resources"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-scripts.sh build"
    echo "  ./docker-scripts.sh up"
    echo "  ./docker-scripts.sh logs"
}

# Main script logic
case "$1" in
    build)
        build
        ;;
    up)
        up
        ;;
    down)
        down
        ;;
    logs)
        logs
        ;;
    run-simple)
        build
        run-simple
        ;;
    stop-simple)
        stop-simple
        ;;
    cleanup)
        cleanup
        ;;
    help|*)
        help
        ;;
esac
