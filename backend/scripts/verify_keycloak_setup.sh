#!/bin/bash

# Keycloak Setup Verification Script
# This script verifies that Keycloak is properly configured

echo "🔍 Verifying Keycloak Setup..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Function to check if service is running
check_service() {
    local service_name=$1
    local port=$2
    local url=$3
    
    echo -e "${YELLOW}🔍 Checking $service_name...${NC}"
    
    # Check if port is listening
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_status 0 "$service_name is running on port $port"
        
        # Check health endpoint if provided
        if [ -n "$url" ]; then
            response=$(curl -s -w "%{http_code}" "$url" 2>/dev/null)
            http_code="${response: -3}"
            if [ "$http_code" = "200" ]; then
                print_status 0 "$service_name health check passed"
            else
                print_status 1 "$service_name health check failed (HTTP: $http_code)"
            fi
        fi
    else
        print_status 1 "$service_name is not running on port $port"
    fi
}

# Function to check Keycloak realm
check_keycloak_realm() {
    echo -e "${YELLOW}🔍 Checking Keycloak realm...${NC}"
    
    # Try to access the realm (newer Keycloak versions don't use /auth/ prefix)
    response=$(curl -s -w "%{http_code}" "http://localhost:8080/realms/ekyc" 2>/dev/null)
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        print_status 0 "Keycloak realm 'ekyc' is accessible"
    else
        print_status 1 "Keycloak realm 'ekyc' is not accessible (HTTP: $http_code)"
    fi
}

# Function to check Keycloak roles
check_keycloak_roles() {
    echo -e "${YELLOW}🔍 Checking Keycloak roles...${NC}"
    
    # Get admin token
    token_response=$(curl -s -X POST "http://localhost:8080/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=password&client_id=admin-cli&username=admin&password=admin123")
    
    access_token=$(echo $token_response | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$access_token" ]; then
        print_status 0 "Admin token obtained successfully"
        
        # Check roles
        roles_response=$(curl -s -w "%{http_code}" "http://localhost:8080/realms/ekyc/roles" \
            -H "Authorization: Bearer $access_token")
        
        http_code="${roles_response: -3}"
        roles_body="${roles_response%???}"
        
        if [ "$http_code" = "200" ]; then
            print_status 0 "Keycloak roles endpoint is accessible"
            
            # Check for specific roles
            if echo "$roles_body" | grep -q "PLATFORM_ADMIN"; then
                print_status 0 "PLATFORM_ADMIN role exists"
            else
                print_status 1 "PLATFORM_ADMIN role not found"
            fi
            
            if echo "$roles_body" | grep -q "PLATFORM_TENANT_ADMIN"; then
                print_status 0 "PLATFORM_TENANT_ADMIN role exists"
            else
                print_status 1 "PLATFORM_TENANT_ADMIN role not found"
            fi
            
            if echo "$roles_body" | grep -q "PLATFORM_USER"; then
                print_status 0 "PLATFORM_USER role exists"
            else
                print_status 1 "PLATFORM_USER role not found"
            fi
        else
            print_status 1 "Keycloak roles endpoint failed (HTTP: $http_code)"
        fi
    else
        print_status 1 "Failed to get admin token"
    fi
}

# Main verification
echo "🚀 Starting verification..."

# Check services
check_service "Keycloak" "8080" "http://localhost:8080/health/ready"
check_service "PostgreSQL" "5432"

echo ""

# Check Keycloak realm
check_keycloak_realm

echo ""

# Check Keycloak roles
check_keycloak_roles

echo ""
echo "🎉 Verification completed!"
echo "========================"
echo ""
echo "📋 Summary:"
echo "   • Keycloak should be running on port 8080"
echo "   • PostgreSQL should be running on port 5432"
echo "   • Realm 'ekyc' should be accessible"
echo "   • All 3 roles should exist in Keycloak"
echo ""
echo "🔗 Access Points:"
echo "   • Keycloak Admin: http://localhost:8080"
echo "   • Keycloak Realm: http://localhost:8080/realms/ekyc"
echo "   • Health Check: http://localhost:8080/health/ready" 