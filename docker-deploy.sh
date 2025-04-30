#!/bin/bash

# Docker deployment script for Flyby Spotter
# This script helps with common Docker operations

set -e

# Function to display help
show_help() {
  echo "Flyby Spotter Docker Deployment Script"
  echo ""
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  deploy      - Build ARM64 image, push to registry, and deploy to Pi"
  echo "  logs        - Show container logs"
  echo "  restart     - Restart the container"
  echo "  stop        - Stop the container"
  echo "  status      - Check container status"
  echo "  cleanup     - Remove unused Docker resources"
  echo "  help        - Show this help message"
  echo ""
}

# Check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
  fi

  if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
  fi
}

# Deploy the application
deploy() {
  echo "Building ARM64 image for Raspberry Pi..."
  
  # Create and use buildx builder if needed
  docker buildx create --use --name arm64builder || true
  
  # Build and push ARM64 image directly to registry
  echo "Building and pushing to registry.colonmelvin.com..."
  docker buildx build \
    --platform linux/arm64/v8 \
    -t registry.colonmelvin.com/flyby-spotter-banner:latest \
    --push \
    .

  if [ $? -ne 0 ]; then
    echo "Error: Build failed"
    exit 1
  fi

  echo "Image built and pushed successfully"

  # Deploy to Raspberry Pi
  echo "Deploying to Raspberry Pi..."
  ssh crmelvin@pi5.internal "cd /opt/apps/flyby-spotter-banner-v3 && \
    docker-compose pull && \
    docker-compose down && \
    docker-compose up -d"

  if [ $? -ne 0 ]; then
    echo "Error: Deployment failed"
    exit 1
  fi

  echo "Deployment complete. Checking container status..."
  ssh crmelvin@pi5.internal "cd /opt/apps/flyby-spotter-banner-v3 && docker-compose ps"
}

# Show container logs
show_logs() {
  echo "Showing container logs (press Ctrl+C to exit)..."
  ssh crmelvin@pi5.internal "cd /opt/apps/flyby-spotter-banner-v3 && docker-compose logs -f"
}

# Restart the container
restart() {
  echo "Restarting container on Raspberry Pi..."
  ssh crmelvin@pi5.internal "cd /opt/apps/flyby-spotter-banner-v3 && docker-compose restart"
  echo "Container restarted."
}

# Stop the container
stop() {
  echo "Stopping container on Raspberry Pi..."
  ssh crmelvin@pi5.internal "cd /opt/apps/flyby-spotter-banner-v3 && docker-compose down"
  echo "Container stopped."
}

# Check container status
status() {
  echo "Container status on Raspberry Pi:"
  ssh crmelvin@pi5.internal "cd /opt/apps/flyby-spotter-banner-v3 && docker-compose ps"
}

# Clean up unused Docker resources
cleanup() {
  echo "Cleaning up unused Docker resources on Raspberry Pi..."
  ssh crmelvin@pi5.internal "docker system prune -f"
  echo "Cleanup complete."
}

# Main script execution
check_docker

# Process command line arguments
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

case "$1" in
  deploy)
    deploy
    ;;
  logs)
    show_logs
    ;;
  restart)
    restart
    ;;
  stop)
    stop
    ;;
  status)
    status
    ;;
  cleanup)
    cleanup
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    echo "Unknown command: $1"
    show_help
    exit 1
    ;;
esac

exit 0
