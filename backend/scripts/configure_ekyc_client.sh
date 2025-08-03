#!/bin/bash

# eKYC Platform Client Configuration Script
# This script helps configure the ekyc-platform-client for backend services

echo "🔧 Configuring eKYC Platform Client..."
echo "======================================"

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
        echo ""
    fi
}

# Function to get ekyc-platform-client ID
get_ekyc_client_id() {
    local token=$1
    
    if [ -z "$token" ]; then
        print_status 1 "No admin token available"
        return 1
    fi
    
    local client_response=$(curl -s "http://localhost:8080/admin/realms/ekyc/clients?clientId=ekyc-platform-client" \
        -H "Authorization: Bearer $token")
    
    local client_id=$(echo "$client_response" | jq -r '.[0].id' 2>/dev/null)
    
    if [ -n "$client_id" ] && [ "$client_id" != "null" ]; then
        print_status 0 "Found ekyc-platform-client ID: $client_id"
        echo "$client_id"
    else
        print_status 1 "Could not find ekyc-platform-client ID"
        echo ""
    fi
}

# Function to configure ekyc-platform-client
configure_ekyc_client() {
    local token=$1
    local client_id=$2
    
    if [ -z "$token" ] || [ -z "$client_id" ]; then
        print_status 1 "Missing token or client ID"
        return 1
    fi
    
    echo -e "${YELLOW}Configuring ekyc-platform-client...${NC}"
    
    # Create the configuration JSON for confidential client
    local config_json='{
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
    
    # Update the client configuration
    local update_response=$(curl -s -w "%{http_code}" -X PUT "http://localhost:8080/admin/realms/ekyc/clients/$client_id" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "$config_json")
    
    local http_code="${update_response: -3}"
    
    if [ "$http_code" = "204" ]; then
        print_status 0 "ekyc-platform-client configured successfully"
    else
        print_status 1 "Failed to configure ekyc-platform-client (HTTP: $http_code)"
        return 1
    fi
}

# Function to get client secret
get_client_secret() {
    local token=$1
    local client_id=$2
    
    if [ -z "$token" ] || [ -z "$client_id" ]; then
        print_status 1 "Missing token or client ID"
        return 1
    fi
    
    echo -e "${YELLOW}Getting client secret...${NC}"
    
    local secret_response=$(curl -s "http://localhost:8080/admin/realms/ekyc/clients/$client_id/client-secret" \
        -H "Authorization: Bearer $token")
    
    local client_secret=$(echo "$secret_response" | jq -r '.value' 2>/dev/null)
    
    if [ -n "$client_secret" ] && [ "$client_secret" != "null" ]; then
        print_status 0 "Client secret obtained successfully"
        echo "$client_secret"
    else
        print_status 1 "Failed to get client secret"
        echo ""
    fi
}

# Function to verify ekyc client configuration
verify_ekyc_client_config() {
    local token=$1
    local client_id=$2
    
    if [ -z "$token" ] || [ -z "$client_id" ]; then
        print_status 1 "Missing token or client ID"
        return 1
    fi
    
    echo -e "${YELLOW}Verifying ekyc-platform-client configuration...${NC}"
    
    local client_response=$(curl -s "http://localhost:8080/admin/realms/ekyc/clients/$client_id" \
        -H "Authorization: Bearer $token")
    
    # Check configuration
    if echo "$client_response" | grep -q '"publicClient":false'; then
        print_status 0 "ekyc-platform-client is configured as confidential client"
    else
        print_status 1 "ekyc-platform-client should be configured as confidential client"
    fi
    
    if echo "$client_response" | grep -q '"clientAuthenticatorType":"client-secret"'; then
        print_status 0 "ekyc-platform-client has client secret authentication"
    else
        print_status 1 "ekyc-platform-client should have client secret authentication"
    fi
    
    if echo "$client_response" | grep -q '"directAccessGrantsEnabled":true'; then
        print_status 0 "ekyc-platform-client has direct access grants enabled"
    else
        print_status 1 "ekyc-platform-client should have direct access grants enabled"
    fi
    
    if echo "$client_response" | grep -q '"serviceAccountsEnabled":true'; then
        print_status 0 "ekyc-platform-client has service accounts enabled"
    else
        print_status 1 "ekyc-platform-client should have service accounts enabled"
    fi
    
    if echo "$client_response" | grep -q '"enabled":true'; then
        print_status 0 "ekyc-platform-client is enabled"
    else
        print_status 1 "ekyc-platform-client should be enabled"
    fi
}

# Main configuration
echo "🚀 Starting ekyc-platform-client configuration..."

# Get admin token
admin_token=$(get_admin_token)

if [ -z "$admin_token" ]; then
    echo ""
    print_warning "Could not get admin token. Please check:"
    echo "   1. Keycloak is running on port 8080"
    echo "   2. Admin user exists with username 'admin' and password 'admin123'"
    echo "   3. admin-cli client is properly configured"
    exit 1
fi

echo ""

# Get ekyc-platform-client ID
client_id=$(get_ekyc_client_id "$admin_token")

if [ -z "$client_id" ]; then
    echo ""
    print_warning "Could not find ekyc-platform-client. Please check:"
    echo "   1. ekyc-platform-client exists in ekyc realm"
    echo "   2. You have proper permissions to access it"
    exit 1
fi

echo ""

# Configure ekyc-platform-client
configure_ekyc_client "$admin_token" "$client_id"

echo ""

# Get client secret
client_secret=$(get_client_secret "$admin_token" "$client_id")

if [ -n "$client_secret" ]; then
    echo ""
    print_info "Client Secret: $client_secret"
    echo ""
    print_warning "IMPORTANT: Copy this client secret and update your backend services:"
    echo "   1. Update KEYCLOAK_CLIENT_SECRET in your .env file"
    echo "   2. Update application.yml files in all backend services"
    echo ""
fi

echo ""

# Verify configuration
verify_ekyc_client_config "$admin_token" "$client_id"

echo ""
echo "🎉 ekyc-platform-client configuration completed!"
echo "=============================================="
echo ""
echo "📋 Next Steps:"
echo "   • Update your .env file with the client secret"
echo "   • Test the configuration with: ./scripts/verify_keycloak.sh"
echo "   • Start your backend services"
echo ""
echo "🔗 Access Points:"
echo "   • Keycloak Admin Console: http://localhost:8080"
echo "   • eKYC Realm: http://localhost:8080/realms/ekyc" 