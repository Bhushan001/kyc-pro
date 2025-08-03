#!/bin/bash

# Comprehensive Keycloak Setup Fix Script
# This script fixes all common Keycloak setup issues

echo "🔧 Fixing Keycloak Setup Issues..."
echo "=================================="

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

# Function to get admin token using direct admin console login
get_admin_token_direct() {
    echo -e "${YELLOW}Getting admin token via direct login...${NC}"
    
    # First, get the login page to get the session
    local login_response=$(curl -s -c cookies.txt "http://localhost:8080/admin/")
    
    # Get the login form
    local form_response=$(curl -s -b cookies.txt "http://localhost:8080/admin/")
    
    # Extract the form action and other required fields
    local form_action=$(echo "$form_response" | grep -o 'action="[^"]*"' | head -1 | cut -d'"' -f2)
    local form_url="http://localhost:8080$form_action"
    
    # Submit login form
    local login_submit=$(curl -s -b cookies.txt -c cookies.txt -X POST "$form_url" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=admin&password=admin123")
    
    # Try to get admin token using admin-cli
    local token_response=$(curl -s -X POST "http://localhost:8080/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=password&client_id=admin-cli&username=admin&password=admin123")
    
    local access_token=$(echo "$token_response" | jq -r '.access_token' 2>/dev/null)
    
    if [ -n "$access_token" ] && [ "$access_token" != "null" ]; then
        print_status 0 "Admin token obtained successfully"
        echo "$access_token"
    else
        print_status 1 "Failed to get admin token via admin-cli"
        echo ""
    fi
}

# Function to configure admin-cli client
configure_admin_cli() {
    echo -e "${YELLOW}Configuring admin-cli client...${NC}"
    
    # Try to access admin console directly
    local admin_response=$(curl -s -w "%{http_code}" "http://localhost:8080/admin/")
    local http_code="${admin_response: -3}"
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "302" ]; then
        print_status 0 "Admin console is accessible"
        print_info "Please manually configure admin-cli client:"
        echo "   1. Go to: http://localhost:8080"
        echo "   2. Login with: admin / admin123"
        echo "   3. Navigate: master realm → Clients → admin-cli"
        echo "   4. Settings tab:"
        echo "      - Access Type: confidential"
        echo "      - Client Protocol: openid-connect"
        echo "      - Direct Access Grants: ON"
        echo "      - Service Accounts: ON"
        echo "   5. Save and go to Credentials tab"
        echo "   6. Note the client secret"
        echo ""
        print_warning "After configuring admin-cli, run this script again"
        return 1
    else
        print_status 1 "Admin console not accessible (HTTP: $http_code)"
        return 1
    fi
}

# Function to create ekyc realm if it doesn't exist
create_ekyc_realm() {
    local token=$1
    
    if [ -z "$token" ]; then
        print_status 1 "No admin token available for realm creation"
        return 1
    fi
    
    echo -e "${YELLOW}Creating ekyc realm...${NC}"
    
    # Check if realm exists
    local realm_response=$(curl -s -w "%{http_code}" "http://localhost:8080/realms/ekyc" 2>/dev/null)
    local http_code="${realm_response: -3}"
    
    if [ "$http_code" = "200" ]; then
        print_status 0 "ekyc realm already exists"
        return 0
    fi
    
    # Create realm
    local realm_config='{
        "realm": "ekyc",
        "enabled": true,
        "displayName": "KYC-Pro Platform",
        "displayNameHtml": "<div class=\"kc-logo-text\"><span>KYC-Pro Platform</span></div>"
    }'
    
    local create_response=$(curl -s -w "%{http_code}" -X POST "http://localhost:8080/admin/realms" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "$realm_config")
    
    local http_code="${create_response: -3}"
    
    if [ "$http_code" = "201" ]; then
        print_status 0 "ekyc realm created successfully"
    else
        print_status 1 "Failed to create ekyc realm (HTTP: $http_code)"
        return 1
    fi
}

# Function to create ekyc-platform-client
create_ekyc_client() {
    local token=$1
    
    if [ -z "$token" ]; then
        print_status 1 "No admin token available for client creation"
        return 1
    fi
    
    echo -e "${YELLOW}Creating ekyc-platform-client...${NC}"
    
    # Check if client exists
    local client_response=$(curl -s -w "%{http_code}" "http://localhost:8080/admin/realms/ekyc/clients?clientId=ekyc-platform-client" \
        -H "Authorization: Bearer $token")
    
    local http_code="${client_response: -3}"
    
    if [ "$http_code" = "200" ]; then
        print_status 0 "ekyc-platform-client already exists"
        return 0
    fi
    
    # Create client
    local client_config='{
        "clientId": "ekyc-platform-client",
        "enabled": true,
        "publicClient": false,
        "clientAuthenticatorType": "client-secret",
        "directAccessGrantsEnabled": true,
        "serviceAccountsEnabled": true,
        "standardFlowEnabled": true,
        "implicitFlowEnabled": false,
        "redirectUris": [],
        "webOrigins": [],
        "adminUrl": "",
        "rootUrl": "",
        "baseUrl": ""
    }'
    
    local create_response=$(curl -s -w "%{http_code}" -X POST "http://localhost:8080/admin/realms/ekyc/clients" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "$client_config")
    
    local http_code="${create_response: -3}"
    
    if [ "$http_code" = "201" ]; then
        print_status 0 "ekyc-platform-client created successfully"
    else
        print_status 1 "Failed to create ekyc-platform-client (HTTP: $http_code)"
        return 1
    fi
}

# Function to create roles
create_roles() {
    local token=$1
    
    if [ -z "$token" ]; then
        print_status 1 "No admin token available for role creation"
        return 1
    fi
    
    echo -e "${YELLOW}Creating roles...${NC}"
    
    # Create PLATFORM_ADMIN role
    local admin_role='{
        "name": "PLATFORM_ADMIN",
        "description": "Platform Administrator",
        "composite": false,
        "clientRole": false
    }'
    
    local create_response=$(curl -s -w "%{http_code}" -X POST "http://localhost:8080/admin/realms/ekyc/roles" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "$admin_role")
    
    local http_code="${create_response: -3}"
    
    if [ "$http_code" = "201" ]; then
        print_status 0 "PLATFORM_ADMIN role created"
    else
        print_status 1 "Failed to create PLATFORM_ADMIN role (HTTP: $http_code)"
    fi
    
    # Create PLATFORM_TENANT_ADMIN role
    local tenant_admin_role='{
        "name": "PLATFORM_TENANT_ADMIN",
        "description": "Platform Tenant Administrator",
        "composite": false,
        "clientRole": false
    }'
    
    create_response=$(curl -s -w "%{http_code}" -X POST "http://localhost:8080/admin/realms/ekyc/roles" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "$tenant_admin_role")
    
    http_code="${create_response: -3}"
    
    if [ "$http_code" = "201" ]; then
        print_status 0 "PLATFORM_TENANT_ADMIN role created"
    else
        print_status 1 "Failed to create PLATFORM_TENANT_ADMIN role (HTTP: $http_code)"
    fi
    
    # Create PLATFORM_USER role
    local user_role='{
        "name": "PLATFORM_USER",
        "description": "Platform User",
        "composite": false,
        "clientRole": false
    }'
    
    create_response=$(curl -s -w "%{http_code}" -X POST "http://localhost:8080/admin/realms/ekyc/roles" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "$user_role")
    
    http_code="${create_response: -3}"
    
    if [ "$http_code" = "201" ]; then
        print_status 0 "PLATFORM_USER role created"
    else
        print_status 1 "Failed to create PLATFORM_USER role (HTTP: $http_code)"
    fi
}

# Function to get client secret
get_client_secret() {
    local token=$1
    
    if [ -z "$token" ]; then
        print_status 1 "No admin token available"
        return 1
    fi
    
    echo -e "${YELLOW}Getting ekyc-platform-client secret...${NC}"
    
    # Get client ID
    local client_response=$(curl -s "http://localhost:8080/admin/realms/ekyc/clients?clientId=ekyc-platform-client" \
        -H "Authorization: Bearer $token")
    
    local client_id=$(echo "$client_response" | jq -r '.[0].id' 2>/dev/null)
    
    if [ -z "$client_id" ] || [ "$client_id" = "null" ]; then
        print_status 1 "Could not find ekyc-platform-client"
        return 1
    fi
    
    # Get client secret
    local secret_response=$(curl -s "http://localhost:8080/admin/realms/ekyc/clients/$client_id/client-secret" \
        -H "Authorization: Bearer $token")
    
    local client_secret=$(echo "$secret_response" | jq -r '.value' 2>/dev/null)
    
    if [ -n "$client_secret" ] && [ "$client_secret" != "null" ]; then
        print_status 0 "Client secret obtained successfully"
        echo ""
        print_info "Client Secret: $client_secret"
        echo ""
        print_warning "IMPORTANT: Update your backend configuration with this secret:"
        echo "   1. Update KEYCLOAK_CLIENT_SECRET in your .env file"
        echo "   2. Update application.yml files in all backend services"
        echo ""
    else
        print_status 1 "Failed to get client secret"
        return 1
    fi
}

# Main fix process
echo "🚀 Starting Keycloak setup fix..."

# Check services
print_section "Checking Services"
if ! check_service "Keycloak" "8080"; then
    echo "Keycloak is not running. Please start it first:"
    echo "   docker-compose up -d keycloak"
    exit 1
fi

if ! check_service "PostgreSQL" "5432"; then
    echo "PostgreSQL is not running. Please start it first:"
    echo "   docker-compose up -d postgres"
    exit 1
fi

# Try to get admin token
print_section "Testing Admin Authentication"
admin_token=$(get_admin_token_direct)

if [ -z "$admin_token" ]; then
    print_section "Configuring Admin CLI"
    configure_admin_cli
    echo ""
    print_warning "Please configure admin-cli manually and run this script again"
    echo ""
    echo "🔗 Access Points:"
    echo "   • Keycloak Admin Console: http://localhost:8080"
    echo "   • Admin Login: admin / admin123"
    exit 1
fi

# Create ekyc realm
print_section "Creating eKYC Realm"
create_ekyc_realm "$admin_token"

# Create ekyc-platform-client
print_section "Creating eKYC Platform Client"
create_ekyc_client "$admin_token"

# Create roles
print_section "Creating Roles"
create_roles "$admin_token"

# Get client secret
print_section "Getting Client Secret"
get_client_secret "$admin_token"

# Final verification
print_section "Final Verification"
echo "Running verification script..."
./scripts/verify_keycloak.sh

echo ""
echo "🎉 Keycloak setup fix completed!"
echo "================================="
echo ""
echo "📋 Next Steps:"
echo "   • Update your backend configuration with the client secret"
echo "   • Start your backend services"
echo "   • Test the frontend applications"
echo ""
echo "🔗 Access Points:"
echo "   • Keycloak Admin Console: http://localhost:8080"
echo "   • eKYC Realm: http://localhost:8080/realms/ekyc"
echo "   • API Gateway: http://localhost:9080" 