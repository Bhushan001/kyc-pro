#!/bin/bash

# KYC-Pro Backend Services Build Script
# This script builds all backend services using Maven

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to build a service
build_service() {
    local service_name=$1
    local service_path=$2
    
    print_status "Building $service_name..."
    
    if [ ! -d "$service_path" ]; then
        print_error "Service directory not found: $service_path"
        return 1
    fi
    
    cd "$service_path"
    
    if [ ! -f "pom.xml" ]; then
        print_error "pom.xml not found in $service_path"
        return 1
    fi
    
    # Run Maven build
    if mvn clean install -DskipTests; then
        print_success "$service_name built successfully"
    else
        print_error "Failed to build $service_name"
        return 1
    fi
    
    cd - > /dev/null
}

# Main script
main() {
    print_status "Starting KYC-Pro Backend Services Build"
    print_status "========================================"
    
    # Get the script directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
    
    print_status "Backend directory: $BACKEND_DIR"
    
    # List of services to build (in dependency order)
    services=(
        "common:common"
        "eureka-server:eureka-server"
        "api-gateway:api-gateway"
        "auth-service:auth-service"
        "user-service:user-service"
        "tenant-service:tenant-service"
        "module-service:module-service"
        "subscription-service:subscription-service"
        "registry-service:registry-service"
        "keycloak-sync-service:keycloak-sync-service"
    )
    
    # Build each service
    for service in "${services[@]}"; do
        IFS=':' read -r service_name service_path <<< "$service"
        service_full_path="$BACKEND_DIR/$service_path"
        
        print_status "Building $service_name at $service_full_path"
        
        if build_service "$service_name" "$service_full_path"; then
            print_success "$service_name completed"
        else
            print_error "Build failed for $service_name"
            exit 1
        fi
        
        echo ""
    done
    
    print_status "========================================"
    print_success "All backend services built successfully!"
    print_status "Build completed at: $(date)"
}

# Check if Maven is installed
check_maven() {
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed or not in PATH"
        print_status "Please install Maven and try again"
        exit 1
    fi
    
    print_status "Maven version: $(mvn --version | head -n 1)"
}

# Check if Java is installed
check_java() {
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed or not in PATH"
        print_status "Please install Java 21 and try again"
        exit 1
    fi
    
    print_status "Java version: $(java -version 2>&1 | head -n 1)"
}

# Parse command line arguments
SKIP_TESTS=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --skip-tests    Skip running tests during build"
            echo "  --verbose       Enable verbose output"
            echo "  --help          Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run checks
check_java
check_maven

# Set Maven options based on arguments
MAVEN_OPTS=""
if [ "$SKIP_TESTS" = true ]; then
    MAVEN_OPTS="$MAVEN_OPTS -DskipTests"
fi

if [ "$VERBOSE" = true ]; then
    MAVEN_OPTS="$MAVEN_OPTS -X"
fi

export MAVEN_OPTS

# Run main function
main "$@" 