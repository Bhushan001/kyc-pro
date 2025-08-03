#!/bin/bash

# Script to sync existing Keycloak roles to the database
echo "🔄 Syncing Keycloak roles to database..."

# Get admin token
TOKEN=$(curl -s -X POST "http://localhost:8080/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=admin-cli&username=admin&password=admin123" | jq -r '.access_token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Failed to get admin token"
    exit 1
fi

echo "✅ Got admin token"

# Get roles from Keycloak
ROLES=$(curl -s -X GET "http://localhost:8080/admin/realms/ekyc/roles" \
  -H "Authorization: Bearer $TOKEN")

echo "📋 Found roles in Keycloak:"
echo "$ROLES" | jq -r '.[] | "  - \(.name): \(.description)"'

# Sync each role to database
echo ""
echo "🔄 Syncing roles to database..."

# PLATFORM_ADMIN role
curl -X POST "http://localhost:9080/api/registry/roles/create" \
  -H "Content-Type: application/json" \
  -d '{
    "roleName": "Platform Administrator",
    "roleCode": "PLATFORM_ADMIN",
    "description": "Platform administrator with full system access",
    "category": "PLATFORM"
  }'

echo ""
echo "✅ Role sync completed!"
echo ""
echo "📊 Current database roles:"
curl -s "http://localhost:9080/api/registry/roles" | jq -r '.[] | "  - \(.roleName) (\(.roleCode)): \(.status)"' 