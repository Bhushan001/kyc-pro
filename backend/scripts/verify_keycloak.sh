#!/bin/bash

# Comprehensive Keycloak Verification Script
# This script verifies Keycloak setup, admin-cli client, and ekyc-platform-client

echo "🔍 Comprehensive Keycloak Verification"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_section() {
    echo ""
    echo -e "${BLUE}🔍 $1${NC}"
    echo "================================"
}

# Function to check if service is running
check_service() {
    local service_name=$1
    local port=$2
    
    echo -e "${YELLOW}Checking $service_name...${NC}"
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_status 0 "$service_name is running on port $port"
        return 0
    else
        print_status 1 "$service_name is not running on port $port"
        return 1
    fi
}

# Function to get admin token
get_admin_token() {
    echo -e "${YELLOW}Getting admin token...${NC}"
    
    local token_response=$(curl -s -X POST "http://localhost:8080/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=password&client_id=admin-cli&username=admin&password=admin123")
    
    local access_token=$(echo "$token_response" | jq -r '.access_token' 2>/dev/null)
    
    if [ -n "$access_token" ] && [ "$access_token" != "null" ]; then
        print_status 0 "Admin token obtained successfully"
        echo "$access_token"
    else
        print_status 1 "Failed to get admin token"
        print_warning "Response: ${token_response:0:200}"
        echo ""
    fi
}

# Function to test admin-cli client
test_admin_cli_client() {
    local token=$1
    
    if [ -z "$token" ]; then
        print_status 1 "No admin token available for admin-cli test"
        return 1
    fi
    
    echo -e "${YELLOW}Testing admin-cli client...${NC}"
    
    # Test admin-cli client access
    local client_response=$(curl -s -w "%{http_code}" "http://localhost:8080/admin/realms/master/clients?clientId=admin-cli" \
        -H "Authorization: Bearer $token")
    
    local http_code="${client_response: -3}"
    local client_body="${client_response%???}"
    
    if [ "$http_code" = "200" ]; then
        print_status 0 "admin-cli client is accessible"
        
        # Check client configuration
        if echo "$client_body" | grep -q '"publicClient":true'; then
            print_status 0 "admin-cli is configured as public client"
        else
            print_status 1 "admin-cli should be configured as public client"
        fi
        
        if echo "$client_body" | grep -q '"directAccessGrantsEnabled":true'; then
            print_status 0 "admin-cli has direct access grants enabled"
        else
            print_status 1 "admin-cli should have direct access grants enabled"
        fi
        
        if echo "$client_body" | grep -q '"enabled":true'; then
            print_status 0 "admin-cli is enabled"
        else
            print_status 1 "admin-cli should be enabled"
        fi
    else
        print_status 1 "admin-cli client not accessible (HTTP: $http_code)"
        return 1
    fi
}

# Function to test ekyc realm
test_ekyc_realm() {
    echo -e "${YELLOW}Testing ekyc realm...${NC}"
    
    # Test realm access without authentication
    local realm_response=$(curl -s -w "%{http_code}" "http://localhost:8080/realms/ekyc" 2>/dev/null)
    local http_code="${realm_response: -3}"
    
    if [ "$http_code" = "200" ]; then
        print_status 0 "ekyc realm is accessible"
        
        # Check realm configuration
        if echo "$realm_response" | grep -q '"enabled":true'; then
            print_status 0 "ekyc realm is enabled"
        else
            print_status 1 "ekyc realm should be enabled"
        fi
        
        # Check realm name
        local realm_name=$(echo "$realm_response" | grep -o '"realm":"[^"]*"' | cut -d'"' -f4)
        if [ "$realm_name" = "ekyc" ]; then
            print_status 0 "ekyc realm name is correct"
        else
            print_status 1 "ekyc realm name should be 'ekyc'"
        fi
    else
        print_status 1 "ekyc realm not accessible (HTTP: $http_code)"
        return 1
    fi
}

# Function to test ekyc-platform-client
test_ekyc_client() {
    local token=$1
    
    if [ -z "$token" ]; then
        print_status 1 "No admin token available for ekyc client test"
        return 1
    fi
    
    echo -e "${YELLOW}Testing ekyc-platform-client...${NC}"
    
    # Test ekyc-platform-client access
    local client_response=$(curl -s -w "%{http_code}" "http://localhost:8080/admin/realms/ekyc/clients?clientId=ekyc-platform-client" \
        -H "Authorization: Bearer $token")
    
    local http_code="${client_response: -3}"
    local client_body="${client_response%???}"
    
    if [ "$http_code" = "200" ]; then
        print_status 0 "ekyc-platform-client is accessible"
        
        # Check client configuration
        if echo "$client_body" | grep -q '"publicClient":false'; then
            print_status 0 "ekyc-platform-client is configured as confidential client"
        else
            print_status 1 "ekyc-platform-client should be configured as confidential client"
        fi
        
        if echo "$client_body" | grep -q '"enabled":true'; then
            print_status 0 "ekyc-platform-client is enabled"
        else
            print_status 1 "ekyc-platform-client should be enabled"
        fi
        
        # Check client authentication
        if echo "$client_body" | grep -q '"clientAuthenticatorType":"client-secret"'; then
            print_status 0 "ekyc-platform-client has client secret authentication"
        else
            print_status 1 "ekyc-platform-client should have client secret authentication"
        fi
    else
        print_status 1 "ekyc-platform-client not accessible (HTTP: $http_code)"
        return 1
    fi
}

# Function to test OAuth2 endpoints
test_oauth2_endpoints() {
    echo -e "${YELLOW}Testing OAuth2 endpoints...${NC}"
    
    # Test authorization endpoint
    local auth_response=$(curl -s -w "%{http_code}" "http://localhost:8080/realms/ekyc/protocol/openid-connect/auth?response_type=code&client_id=ekyc-platform-client&redirect_uri=http://localhost:4200&state=test")
    local http_code="${auth_response: -3}"
    
    if [ "$http_code" = "200" ]; then
        print_status 0 "Authorization endpoint is accessible"
    else
        print_status 1 "Authorization endpoint not accessible (HTTP: $http_code)"
    fi
    
    # Test token endpoint
    local token_response=$(curl -s -w "%{http_code}" "http://localhost:8080/realms/ekyc/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=client_credentials&client_id=ekyc-platform-client")
    local http_code="${token_response: -3}"
    
    if [ "$http_code" = "200" ]; then
        print_status 0 "Token endpoint is accessible"
    else
        print_warning "Token endpoint not accessible (HTTP: $http_code) - this is normal for public clients"
    fi
}

# Function to test roles
test_roles() {
    local token=$1
    
    if [ -z "$token" ]; then
        print_status 1 "No admin token available for roles test"
        return 1
    fi
    
    echo -e "${YELLOW}Testing roles...${NC}"
    
    # Test realm roles
    local roles_response=$(curl -s -w "%{http_code}" "http://localhost:8080/admin/realms/ekyc/roles" \
        -H "Authorization: Bearer $token")
    
    local http_code="${roles_response: -3}"
    local roles_body="${roles_response%???}"
    
    if [ "$http_code" = "200" ]; then
        print_status 0 "ekyc realm roles are accessible"
        
        # Check for specific roles
        if echo "$roles_body" | grep -q '"name":"PLATFORM_ADMIN"'; then
            print_status 0 "PLATFORM_ADMIN role exists"
        else
            print_status 1 "PLATFORM_ADMIN role not found"
        fi
        
        if echo "$roles_body" | grep -q '"name":"PLATFORM_TENANT_ADMIN"'; then
            print_status 0 "PLATFORM_TENANT_ADMIN role exists"
        else
            print_status 1 "PLATFORM_TENANT_ADMIN role not found"
        fi
        
        if echo "$roles_body" | grep -q '"name":"PLATFORM_USER"'; then
            print_status 0 "PLATFORM_USER role exists"
        else
            print_status 1 "PLATFORM_USER role not found"
        fi
    else
        print_status 1 "ekyc realm roles not accessible (HTTP: $http_code)"
        return 1
    fi
}

# Function to test services
test_services() {
    echo -e "${YELLOW}Testing services...${NC}"
    
    # Test API Gateway
    if check_service "API Gateway" "9080"; then
        local health_response=$(curl -s -w "%{http_code}" "http://localhost:9080/actuator/health")
        local http_code="${health_response: -3}"
        
        if [ "$http_code" = "200" ]; then
            print_status 0 "API Gateway health check passed"
        else
            print_status 1 "API Gateway health check failed (HTTP: $http_code)"
        fi
    fi
    
    # Test frontend applications
    check_service "KYC-Pro Portal" "4200"
    check_service "Hub Portal" "4201"
    check_service "Console Portal" "4202"
    check_service "Workspace Portal" "4203"
}

# Function to provide resolution steps
provide_resolution_steps() {
    echo ""
    print_section "Resolution Steps"
    
    echo "Based on the test results, here are the steps to resolve issues:"
    echo ""
    
    # Check if Keycloak is running
    if ! lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "🔧 1. Start Keycloak:"
        echo "   docker-compose up -d keycloak"
        echo ""
    fi
    
    # Check if admin-cli client needs configuration
    if [ -n "$ADMIN_CLI_ISSUES" ]; then
        echo "🔧 2. Configure admin-cli client in Keycloak Admin Console:"
        echo "   • Go to: http://localhost:8080"
        echo "   • Login with: admin / admin123"
        echo "   • Navigate: master realm → Clients → admin-cli"
        echo "   • Capability Config tab:"
        echo "     - Client authentication: OFF"
        echo "     - Direct access grants: ON"
        echo "     - Standard flow: ON"
        echo "     - Service accounts roles: ON"
        echo ""
    fi
    
    # Check if ekyc realm needs configuration
    if [ -n "$EKYC_REALM_ISSUES" ]; then
        echo "🔧 3. Configure ekyc realm:"
        echo "   • Go to: http://localhost:8080"
        echo "   • Navigate: ekyc realm → Realm Settings"
        echo "   • Enable the realm"
        echo "   • Set display name if needed"
        echo ""
    fi
    
    # Check if ekyc-platform-client needs configuration
    if [ -n "$EKYC_CLIENT_ISSUES" ]; then
             echo "🔧 4. Configure ekyc-platform-client:"
     echo "   • Go to: http://localhost:8080"
     echo "   • Navigate: ekyc realm → Clients → ekyc-platform-client"
     echo "   • Settings tab:"
     echo "     - Access Type: confidential"
     echo "   • Capability Config tab:"
     echo "     - Client authentication: ON"
     echo "     - Standard flow: ON"
     echo "     - Direct access grants: ON"
     echo "     - Service accounts roles: ON"
     echo "   • Credentials tab:"
     echo "     - Copy the client secret for backend configuration"
        echo ""
    fi
    
    # Check if roles need to be created
    if [ -n "$ROLES_ISSUES" ]; then
        echo "🔧 5. Create roles in ekyc realm:"
        echo "   • Go to: http://localhost:8080"
        echo "   • Navigate: ekyc realm → Roles"
        echo "   • Create these roles:"
        echo "     - PLATFORM_ADMIN"
        echo "     - PLATFORM_TENANT_ADMIN"
        echo "     - PLATFORM_USER"
        echo ""
    fi
    
    # Check if services need to be started
    if ! lsof -Pi :9080 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "🔧 6. Start services:"
        echo "   • API Gateway: docker-compose up -d api-gateway"
        echo "   • All services: docker-compose up -d"
        echo ""
    fi
    
    # Check if frontend apps need to be started
    if ! lsof -Pi :4200 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "🔧 7. Start frontend applications:"
        echo "   • KYC-Pro Portal: cd frontend/kyc-pro && npm start"
        echo "   • Hub Portal: cd frontend/hub && npm start"
        echo "   • Console Portal: cd frontend/console && npm start"
        echo "   • Workspace Portal: cd frontend/workspace && npm start"
        echo ""
    fi
    
    echo "🔗 Access Points:"
    echo "   • Keycloak Admin Console: http://localhost:8080"
    echo "   • eKYC Realm: http://localhost:8080/realms/ekyc"
    echo "   • API Gateway: http://localhost:9080"
    echo "   • KYC-Pro Portal: http://localhost:4200"
    echo "   • Hub Portal: http://localhost:4201"
    echo "   • Console Portal: http://localhost:4202"
    echo "   • Workspace Portal: http://localhost:4203"
}

# Main verification
echo "🚀 Starting comprehensive Keycloak verification..."

# Initialize issue tracking variables
ADMIN_CLI_ISSUES=""
EKYC_REALM_ISSUES=""
EKYC_CLIENT_ISSUES=""
ROLES_ISSUES=""

# Test Keycloak service
print_section "Testing Keycloak Service"
if ! check_service "Keycloak" "8080"; then
    echo "Keycloak is not running. Please start it first."
    exit 1
fi

# Test admin authentication
print_section "Testing Admin Authentication"
admin_token=$(get_admin_token)

if [ -z "$admin_token" ]; then
    echo "Admin authentication failed. Please check admin user and admin-cli client configuration."
    exit 1
fi

# Test admin-cli client
print_section "Testing admin-cli Client"
if ! test_admin_cli_client "$admin_token"; then
    ADMIN_CLI_ISSUES="true"
fi

# Test ekyc realm
print_section "Testing ekyc Realm"
if ! test_ekyc_realm; then
    EKYC_REALM_ISSUES="true"
fi

# Test ekyc-platform-client
print_section "Testing ekyc-platform-client"
if ! test_ekyc_client "$admin_token"; then
    EKYC_CLIENT_ISSUES="true"
fi

# Test OAuth2 endpoints
print_section "Testing OAuth2 Endpoints"
test_oauth2_endpoints

# Test roles
print_section "Testing Roles"
if ! test_roles "$admin_token"; then
    ROLES_ISSUES="true"
fi

# Test services
print_section "Testing Services"
test_services

# Provide resolution steps
provide_resolution_steps

echo ""
echo "🎉 Comprehensive Keycloak verification completed!"
echo "================================================"
echo ""
echo "📋 Summary:"
echo "   • Keycloak service status: $(lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 && echo "Running" || echo "Not running")"
echo "   • Admin authentication: $(if [ -n "$admin_token" ]; then echo "Working"; else echo "Failed"; fi)"
echo "   • admin-cli client: $(if [ -z "$ADMIN_CLI_ISSUES" ]; then echo "Configured"; else echo "Needs configuration"; fi)"
echo "   • ekyc realm: $(if [ -z "$EKYC_REALM_ISSUES" ]; then echo "Configured"; else echo "Needs configuration"; fi)"
echo "   • ekyc-platform-client: $(if [ -z "$EKYC_CLIENT_ISSUES" ]; then echo "Configured"; else echo "Needs configuration"; fi)"
echo "   • Roles: $(if [ -z "$ROLES_ISSUES" ]; then echo "Configured"; else echo "Need to be created"; fi)"
echo "   • Services: $(lsof -Pi :9080 -sTCP:LISTEN -t >/dev/null 2>&1 && echo "Running" || echo "Need to be started")" 