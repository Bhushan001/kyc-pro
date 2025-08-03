#!/bin/bash

echo "🔄 Creating all platform roles..."

# Get admin token
TOKEN=$(curl -s -X POST "http://localhost:8080/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=admin-cli&username=admin&password=admin123" | jq -r '.access_token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Failed to get admin token"
    exit 1
fi

echo "✅ Got admin token"

# Function to create role in database and link with Keycloak
create_role() {
    local role_name=$1
    local role_code=$2
    local description=$3
    
    echo "🔄 Creating $role_name..."
    
    # Create role in database
    curl -s -X POST "http://localhost:9080/api/registry/roles/create" \
      -H "Content-Type: application/json" \
      -d "{
        \"roleName\": \"$role_name\",
        \"roleCode\": \"$role_code\",
        \"description\": \"$description\",
        \"category\": \"PLATFORM\"
      }"
    
    echo ""
    
    # Get Keycloak role ID
    local keycloak_id=$(curl -s -X GET "http://localhost:8080/admin/realms/ekyc/roles" \
      -H "Authorization: Bearer $TOKEN" | jq -r ".[] | select(.name==\"$role_code\") | .id")
    
    if [ "$keycloak_id" != "null" ] && [ -n "$keycloak_id" ]; then
        # Update database with Keycloak ID
        docker exec -i ekyc-postgres psql -U saas_user -d ekyc_platform -c "UPDATE registry.roles SET keycloak_role_id = '$keycloak_id', status = 'ACTIVE' WHERE role_code = '$role_code';"
        echo "✅ $role_name linked with Keycloak ID: $keycloak_id"
    else
        echo "⚠️  Could not find Keycloak role for $role_code"
    fi
    
    echo ""
}

# Create all three roles
create_role "Platform Administrator" "PLATFORM_ADMIN" "Platform-wide administrator with full system access"
create_role "Platform Tenant Administrator" "PLATFORM_TENANT_ADMIN" "Platform tenant administrator with organization management access"
create_role "Platform User" "PLATFORM_USER" "Platform user with basic access to workspace and KYC workflows"

echo "✅ All roles created!"
echo ""
echo "📊 Current roles:"
curl -s "http://localhost:9080/api/registry/roles" | jq -r '.[] | "  - \(.roleName) (\(.roleCode)): \(.status)"' 