#!/bin/bash

# =============================================================================
# Kyc-Pro Platform - Build All Docker Images Script
# =============================================================================
# This script builds Docker images for all services using their Dockerfiles

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Docker registry and tag configuration
DOCKER_REGISTRY="${DOCKER_REGISTRY:-ekyc}"
DOCKER_TAG="${DOCKER_TAG:-latest}"

echo -e "${BLUE}=============================================================================${NC}"
echo -e "${BLUE}Kyc-Pro Platform - Building All Docker Images${NC}"
echo -e "${BLUE}=============================================================================${NC}"
echo ""

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed or not in PATH${NC}"
    echo "Please install Docker and try again."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker daemon is not running${NC}"
    echo "Please start Docker and try again."
    exit 1
fi

# Function to build a Docker image
build_docker_image() {
    local service_name="$1"
    local service_path="$2"
    local image_name="$3"
    
    echo -e "${BLUE}Building Docker image for $service_name...${NC}"
    echo "Path: $service_path"
    echo "Image: $image_name"
    
    if [[ ! -d "$service_path" ]]; then
        echo -e "${RED}Error: Service directory not found: $service_path${NC}"
        return 1
    fi
    
    if [[ ! -f "$service_path/Dockerfile" ]]; then
        echo -e "${RED}Error: Dockerfile not found in $service_path${NC}"
        return 1
    fi
    
    cd "$service_path"
    
    # Build Docker image
    echo "Running: docker build -t $image_name ."
    if docker build -t "$image_name" .; then
        echo -e "${GREEN}✓ $service_name Docker image built successfully${NC}"
        
        # Show image info
        echo "Image details:"
        docker images "$image_name" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    else
        echo -e "${RED}✗ $service_name Docker image build failed${NC}"
        return 1
    fi
    
    echo ""
}

# Function to build all Docker images
build_all_images() {
    echo -e "${YELLOW}Building Docker Images...${NC}"
    
    local services=(
        "Eureka Server|eureka-server|$DOCKER_REGISTRY/eureka-server:$DOCKER_TAG"
        "Auth Service|auth-service|$DOCKER_REGISTRY/auth-service:$DOCKER_TAG"
        "Tenant Service|tenant-service|$DOCKER_REGISTRY/tenant-service:$DOCKER_TAG"
        "User Service|user-service|$DOCKER_REGISTRY/user-service:$DOCKER_TAG"
        "Module Service|module-service|$DOCKER_REGISTRY/module-service:$DOCKER_TAG"
        "Subscription Service|subscription-service|$DOCKER_REGISTRY/subscription-service:$DOCKER_TAG"
        "API Gateway|api-gateway|$DOCKER_REGISTRY/api-gateway:$DOCKER_TAG"
    )
    
    local failed_services=()
    
    for service_info in "${services[@]}"; do
        IFS='|' read -r service_name service_dir image_name <<< "$service_info"
        
        if ! build_docker_image "$service_name" "$SCRIPT_DIR/$service_dir" "$image_name"; then
            failed_services+=("$service_name")
        fi
    done
    
    # Report results
    if [[ ${#failed_services[@]} -eq 0 ]]; then
        echo -e "${GREEN}=============================================================================${NC}"
        echo -e "${GREEN}All Docker images built successfully!${NC}"
        echo -e "${GREEN}=============================================================================${NC}"
    else
        echo -e "${RED}=============================================================================${NC}"
        echo -e "${RED}Docker build completed with errors in the following services:${NC}"
        for service in "${failed_services[@]}"; do
            echo -e "${RED}  - $service${NC}"
        done
        echo -e "${RED}=============================================================================${NC}"
        exit 1
    fi
}

# Function to show Docker images summary
show_images_summary() {
    echo ""
    echo -e "${BLUE}Docker Images Summary:${NC}"
    echo "======================"
    echo "Built images:"
    
    local images=(
        "$DOCKER_REGISTRY/eureka-server:$DOCKER_TAG"
        "$DOCKER_REGISTRY/auth-service:$DOCKER_TAG"
        "$DOCKER_REGISTRY/tenant-service:$DOCKER_TAG"
        "$DOCKER_REGISTRY/user-service:$DOCKER_TAG"
        "$DOCKER_REGISTRY/module-service:$DOCKER_TAG"
        "$DOCKER_REGISTRY/subscription-service:$DOCKER_TAG"
        "$DOCKER_REGISTRY/api-gateway:$DOCKER_TAG"
    )
    
    for image in "${images[@]}"; do
        if docker images "$image" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep -q "$image"; then
            echo -e "  ✓ $image"
        else
            echo -e "  ✗ $image (not found)"
        fi
    done
    
    echo ""
    echo -e "${GREEN}All Docker images are ready for deployment${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Start infrastructure: docker-compose up -d"
    echo "  2. Deploy services using Docker Compose or Kubernetes"
    echo "  3. Or run services individually: docker run $DOCKER_REGISTRY/service-name:$DOCKER_TAG"
    echo ""
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -r, --registry REGISTRY    Docker registry (default: ekyc)"
    echo "  -t, --tag TAG              Docker tag (default: latest)"
    echo "  -h, --help                 Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  DOCKER_REGISTRY            Docker registry (default: ekyc)"
    echo "  DOCKER_TAG                 Docker tag (default: latest)"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Build with default settings"
    echo "  $0 -r myregistry -t v1.0.0          # Build with custom registry and tag"
    echo "  DOCKER_REGISTRY=myregistry $0        # Build with custom registry"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -r|--registry)
            DOCKER_REGISTRY="$2"
            shift 2
            ;;
        -t|--tag)
            DOCKER_TAG="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_usage
            exit 1
            ;;
    esac
done

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # Check if services are built
    local services=("common" "eureka-server" "auth-service" "tenant-service" "user-service" "module-service" "subscription-service" "api-gateway")
    
    for service in "${services[@]}"; do
        if [[ ! -f "$SCRIPT_DIR/$service/target"/*.jar ]]; then
            echo -e "${YELLOW}Warning: $service JAR file not found. Building services first...${NC}"
            echo ""
            if [[ -f "$SCRIPT_DIR/build_all.sh" ]]; then
                echo "Running build_all.sh..."
                "$SCRIPT_DIR/build_all.sh"
            else
                echo -e "${RED}Error: build_all.sh not found. Please build services manually first.${NC}"
                exit 1
            fi
            break
        fi
    done
    
    echo -e "${GREEN}✓ Prerequisites check completed${NC}"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}Starting Docker image build process...${NC}"
    echo "Registry: $DOCKER_REGISTRY"
    echo "Tag: $DOCKER_TAG"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Build all Docker images
    build_all_images
    
    # Show summary
    show_images_summary
}

# Run main function
main "$@" 