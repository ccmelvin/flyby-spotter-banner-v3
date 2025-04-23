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
  echo "  deploy      - Build and deploy the application"
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
  echo "Building and deploying Flyby Spotter..."
  docker-compose build
  docker-compose up -d
  echo "Deployment complete. Application is running at http://localhost:3000"
}

# Show container logs
show_logs() {
  echo "Showing container logs (press Ctrl+C to exit)..."
  docker-compose logs -f
}

# Restart the container
restart() {
  echo "Restarting container..."
  docker-compose restart
  echo "Container restarted."
}

# Stop the container
stop() {
  echo "Stopping container..."
  docker-compose down
  echo "Container stopped."
}

# Check container status
status() {
  echo "Container status:"
  docker-compose ps
}

# Clean up unused Docker resources
cleanup() {
  echo "Cleaning up unused Docker resources..."
  docker system prune -f
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