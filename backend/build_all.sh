#!/bin/bash

# =============================================================================
# Kyc-Pro Platform - Build All Services Script
# =============================================================================
# This script builds all Java microservices using Maven clean install

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}=============================================================================${NC}"
echo -e "${BLUE}Kyc-Pro Platform - Building All Services${NC}"
echo -e "${BLUE}=============================================================================${NC}"
echo ""

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Error: Maven is not installed or not in PATH${NC}"
    echo "Please install Maven and try again."
    exit 1
fi

# Function to build a service
build_service() {
    local service_name="$1"
    local service_path="$2"
    
    echo -e "${BLUE}Building $service_name...${NC}"
    echo "Path: $service_path"
    
    if [[ ! -d "$service_path" ]]; then
        echo -e "${RED}Error: Service directory not found: $service_path${NC}"
        return 1
    fi
    
    cd "$service_path"
    
    # Check if pom.xml exists
    if [[ ! -f "pom.xml" ]]; then
        echo -e "${RED}Error: pom.xml not found in $service_path${NC}"
        return 1
    fi
    
    # Run Maven clean install
    echo "Running: mvn clean install"
    if mvn clean install -q; then
        echo -e "${GREEN}✓ $service_name built successfully${NC}"
    else
        echo -e "${RED}✗ $service_name build failed${NC}"
        return 1
    fi
    
    echo ""
}

# Function to build common project first
build_common() {
    echo -e "${YELLOW}Building Common Project (required for other services)...${NC}"
    build_service "Common Project" "$SCRIPT_DIR/common"
    
    if [[ $? -ne 0 ]]; then
        echo -e "${RED}Common project build failed. Stopping.${NC}"
        exit 1
    fi
}

# Function to build all microservices
build_microservices() {
    echo -e "${YELLOW}Building Microservices...${NC}"
    
    local services=(
        "Eureka Server|eureka-server"
        "Auth Service|auth-service"
        "Tenant Service|tenant-service"
        "User Service|user-service"
        "Module Service|module-service"
        "Subscription Service|subscription-service"
        "API Gateway|api-gateway"
    )
    
    local failed_services=()
    
    for service_info in "${services[@]}"; do
        IFS='|' read -r service_name service_dir <<< "$service_info"
        
        if ! build_service "$service_name" "$SCRIPT_DIR/$service_dir"; then
            failed_services+=("$service_name")
        fi
    done
    
    # Report results
    if [[ ${#failed_services[@]} -eq 0 ]]; then
        echo -e "${GREEN}=============================================================================${NC}"
        echo -e "${GREEN}All services built successfully!${NC}"
        echo -e "${GREEN}=============================================================================${NC}"
    else
        echo -e "${RED}=============================================================================${NC}"
        echo -e "${RED}Build completed with errors in the following services:${NC}"
        for service in "${failed_services[@]}"; do
            echo -e "${RED}  - $service${NC}"
        done
        echo -e "${RED}=============================================================================${NC}"
        exit 1
    fi
}

# Function to show build summary
show_summary() {
    echo ""
    echo -e "${BLUE}Build Summary:${NC}"
    echo "=============="
    echo "Services built:"
    echo "  ✓ Common Project"
    echo "  ✓ Eureka Server"
    echo "  ✓ Auth Service"
    echo "  ✓ Tenant Service"
    echo "  ✓ User Service"
    echo "  ✓ Module Service"
    echo "  ✓ Subscription Service"
    echo "  ✓ API Gateway"
    echo ""
    echo -e "${GREEN}All JAR files are ready in their respective target/ directories${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Start Eureka Server: cd eureka-server && mvn spring-boot:run"
    echo "  2. Start other services in your IDE"
    echo "  3. Or use build_all_docker_images.sh to build Docker images"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}Starting build process...${NC}"
    echo ""
    
    # Build common project first
    build_common
    
    # Build all microservices
    build_microservices
    
    # Show summary
    show_summary
}

# Run main function
main "$@" 