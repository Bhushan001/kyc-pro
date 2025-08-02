#!/bin/bash

# =============================================================================
# Kyc-Pro Platform Environment Setup Script
# =============================================================================
# This script generates a .env file from env.example with interactive prompts
# for customization of development environment settings.

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_EXAMPLE="$SCRIPT_DIR/env.example"
ENV_FILE="$SCRIPT_DIR/.env"

echo -e "${BLUE}=============================================================================${NC}"
echo -e "${BLUE}Kyc-Pro Platform Environment Setup${NC}"
echo -e "${BLUE}=============================================================================${NC}"
echo ""

# Check if env.example exists
if [[ ! -f "$ENV_EXAMPLE" ]]; then
    echo -e "${RED}Error: env.example file not found at $ENV_EXAMPLE${NC}"
    exit 1
fi

# Check if .env already exists
if [[ -f "$ENV_FILE" ]]; then
    echo -e "${YELLOW}Warning: .env file already exists at $ENV_FILE${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Setup cancelled. Existing .env file preserved.${NC}"
        exit 0
    fi
fi

echo -e "${GREEN}Starting environment setup...${NC}"
echo ""

# Function to prompt for value with default
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    if [[ -n "$default" ]]; then
        read -p "$prompt [$default]: " value
        if [[ -z "$value" ]]; then
            value="$default"
        fi
    else
        read -p "$prompt: " value
    fi
    
    echo "$value"
}

# Function to prompt for boolean value
prompt_boolean() {
    local prompt="$1"
    local default="$2"
    
    if [[ "$default" == "true" ]]; then
        read -p "$prompt (Y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            echo "false"
        else
            echo "true"
        fi
    else
        read -p "$prompt (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "true"
        else
            echo "false"
        fi
    fi
}

# Function to prompt for secret/password
prompt_secret() {
    local prompt="$1"
    local default="$2"
    
    if [[ -n "$default" ]]; then
        read -s -p "$prompt [$default]: " value
        echo
        if [[ -z "$value" ]]; then
            value="$default"
        fi
    else
        read -s -p "$prompt: " value
        echo
    fi
    
    echo "$value"
}

echo -e "${BLUE}Database Configuration${NC}"
echo "=========================="

POSTGRES_DB=$(prompt_with_default "PostgreSQL Database Name" "ekyc_platform" "POSTGRES_DB")
POSTGRES_USER=$(prompt_with_default "PostgreSQL Username" "saas_user" "POSTGRES_USER")
POSTGRES_PASSWORD=$(prompt_secret "PostgreSQL Password" "saas_password")
POSTGRES_HOST=$(prompt_with_default "PostgreSQL Host" "localhost" "POSTGRES_HOST")
POSTGRES_PORT=$(prompt_with_default "PostgreSQL Port" "5432" "POSTGRES_PORT")

echo ""
echo -e "${BLUE}Keycloak Configuration${NC}"
echo "========================"

KEYCLOAK_ADMIN=$(prompt_with_default "Keycloak Admin Username" "admin" "KEYCLOAK_ADMIN")
KEYCLOAK_ADMIN_PASSWORD=$(prompt_secret "Keycloak Admin Password" "admin123")
KEYCLOAK_REALM=$(prompt_with_default "Keycloak Realm Name" "ekyc-platform" "KEYCLOAK_REALM")

echo ""
echo -e "${BLUE}Security Configuration${NC}"
echo "========================"

JWT_SECRET=$(prompt_secret "JWT Secret (for development)" "mySuperSecretKeyWhichShouldBeOverriddenInProduction")
MIN_PASSWORD_LENGTH=$(prompt_with_default "Minimum Password Length" "6" "MIN_PASSWORD_LENGTH")

echo ""
echo -e "${BLUE}Service Discovery Configuration${NC}"
echo "=================================="

EUREKA_SERVER_PORT=$(prompt_with_default "Eureka Server Port" "8761" "EUREKA_SERVER_PORT")

echo ""
echo -e "${BLUE}Development Settings${NC}"
echo "======================"

SPRING_PROFILES_ACTIVE=$(prompt_with_default "Spring Profile" "dev" "SPRING_PROFILES_ACTIVE")
LOGGING_LEVEL=$(prompt_with_default "Logging Level" "INFO" "LOGGING_LEVEL")

ENABLE_SWAGGER=$(prompt_boolean "Enable Swagger UI" "true")
ENABLE_SQL_LOGGING=$(prompt_boolean "Enable SQL Logging" "false")
ENABLE_REQUEST_LOGGING=$(prompt_boolean "Enable Request Logging" "true")

echo ""
echo -e "${BLUE}Feature Flags${NC}"
echo "============="

FEATURE_EMAIL_VERIFICATION=$(prompt_boolean "Enable Email Verification" "false")
FEATURE_TWO_FACTOR_AUTH=$(prompt_boolean "Enable Two-Factor Authentication" "false")
FEATURE_SOCIAL_LOGIN=$(prompt_boolean "Enable Social Login" "false")

echo ""
echo -e "${BLUE}External Services (Optional)${NC}"
echo "================================"

read -p "Do you want to configure external services (email, storage, payments)? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Email Configuration${NC}"
    SMTP_HOST=$(prompt_with_default "SMTP Host" "smtp.gmail.com" "SMTP_HOST")
    SMTP_PORT=$(prompt_with_default "SMTP Port" "587" "SMTP_PORT")
    SMTP_USERNAME=$(prompt_with_default "SMTP Username" "" "SMTP_USERNAME")
    SMTP_PASSWORD=$(prompt_secret "SMTP Password" "")
    SMTP_FROM=$(prompt_with_default "From Email" "noreply@saasplatform.com" "SMTP_FROM")
    
    echo ""
    echo -e "${YELLOW}AWS S3 Configuration${NC}"
    AWS_S3_BUCKET=$(prompt_with_default "S3 Bucket Name" "saas-platform-dev" "AWS_S3_BUCKET")
    AWS_S3_REGION=$(prompt_with_default "S3 Region" "us-east-1" "AWS_S3_REGION")
    AWS_ACCESS_KEY_ID=$(prompt_with_default "AWS Access Key ID" "" "AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY=$(prompt_secret "AWS Secret Access Key" "")
    
    echo ""
    echo -e "${YELLOW}Stripe Configuration${NC}"
    STRIPE_PUBLISHABLE_KEY=$(prompt_with_default "Stripe Publishable Key" "" "STRIPE_PUBLISHABLE_KEY")
    STRIPE_SECRET_KEY=$(prompt_secret "Stripe Secret Key" "")
    STRIPE_WEBHOOK_SECRET=$(prompt_secret "Stripe Webhook Secret" "")
else
    # Set default values for external services
    SMTP_HOST="smtp.gmail.com"
    SMTP_PORT="587"
    SMTP_USERNAME="your-email@gmail.com"
    SMTP_PASSWORD="your-app-password"
    SMTP_FROM="noreply@saasplatform.com"
    AWS_S3_BUCKET="saas-platform-dev"
    AWS_S3_REGION="us-east-1"
    AWS_ACCESS_KEY_ID="your-access-key"
    AWS_SECRET_ACCESS_KEY="your-secret-key"
    STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"
    STRIPE_SECRET_KEY="sk_test_your_secret_key"
    STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
fi

echo ""
echo -e "${GREEN}Generating .env file...${NC}"

# Create .env file from env.example
cp "$ENV_EXAMPLE" "$ENV_FILE"

# Update .env file with user inputs
sed -i.bak "s/^POSTGRES_DB=.*/POSTGRES_DB=$POSTGRES_DB/" "$ENV_FILE"
sed -i.bak "s/^POSTGRES_USER=.*/POSTGRES_USER=$POSTGRES_USER/" "$ENV_FILE"
sed -i.bak "s/^POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$POSTGRES_PASSWORD/" "$ENV_FILE"
sed -i.bak "s/^POSTGRES_HOST=.*/POSTGRES_HOST=$POSTGRES_HOST/" "$ENV_FILE"
sed -i.bak "s/^POSTGRES_PORT=.*/POSTGRES_PORT=$POSTGRES_PORT/" "$ENV_FILE"

sed -i.bak "s/^DATABASE_URL=.*/DATABASE_URL=jdbc:postgresql:\/\/$POSTGRES_HOST:$POSTGRES_PORT\/$POSTGRES_DB/" "$ENV_FILE"
sed -i.bak "s/^DATABASE_USERNAME=.*/DATABASE_USERNAME=$POSTGRES_USER/" "$ENV_FILE"
sed -i.bak "s/^DATABASE_PASSWORD=.*/DATABASE_PASSWORD=$POSTGRES_PASSWORD/" "$ENV_FILE"

sed -i.bak "s/^KEYCLOAK_ADMIN=.*/KEYCLOAK_ADMIN=$KEYCLOAK_ADMIN/" "$ENV_FILE"
sed -i.bak "s/^KEYCLOAK_ADMIN_PASSWORD=.*/KEYCLOAK_ADMIN_PASSWORD=$KEYCLOAK_ADMIN_PASSWORD/" "$ENV_FILE"
sed -i.bak "s/^KC_DB_USERNAME=.*/KC_DB_USERNAME=$POSTGRES_USER/" "$ENV_FILE"
sed -i.bak "s/^KC_DB_PASSWORD=.*/KC_DB_PASSWORD=$POSTGRES_PASSWORD/" "$ENV_FILE"
sed -i.bak "s/^KEYCLOAK_REALM=.*/KEYCLOAK_REALM=$KEYCLOAK_REALM/" "$ENV_FILE"

sed -i.bak "s/^JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" "$ENV_FILE"
sed -i.bak "s/^MIN_PASSWORD_LENGTH=.*/MIN_PASSWORD_LENGTH=$MIN_PASSWORD_LENGTH/" "$ENV_FILE"

sed -i.bak "s/^EUREKA_SERVER_PORT=.*/EUREKA_SERVER_PORT=$EUREKA_SERVER_PORT/" "$ENV_FILE"

sed -i.bak "s/^SPRING_PROFILES_ACTIVE=.*/SPRING_PROFILES_ACTIVE=$SPRING_PROFILES_ACTIVE/" "$ENV_FILE"
sed -i.bak "s/^LOGGING_LEVEL=.*/LOGGING_LEVEL=$LOGGING_LEVEL/" "$ENV_FILE"

sed -i.bak "s/^ENABLE_SWAGGER=.*/ENABLE_SWAGGER=$ENABLE_SWAGGER/" "$ENV_FILE"
sed -i.bak "s/^ENABLE_SQL_LOGGING=.*/ENABLE_SQL_LOGGING=$ENABLE_SQL_LOGGING/" "$ENV_FILE"
sed -i.bak "s/^ENABLE_REQUEST_LOGGING=.*/ENABLE_REQUEST_LOGGING=$ENABLE_REQUEST_LOGGING/" "$ENV_FILE"

sed -i.bak "s/^FEATURE_EMAIL_VERIFICATION=.*/FEATURE_EMAIL_VERIFICATION=$FEATURE_EMAIL_VERIFICATION/" "$ENV_FILE"
sed -i.bak "s/^FEATURE_TWO_FACTOR_AUTH=.*/FEATURE_TWO_FACTOR_AUTH=$FEATURE_TWO_FACTOR_AUTH/" "$ENV_FILE"
sed -i.bak "s/^FEATURE_SOCIAL_LOGIN=.*/FEATURE_SOCIAL_LOGIN=$FEATURE_SOCIAL_LOGIN/" "$ENV_FILE"

sed -i.bak "s/^SMTP_HOST=.*/SMTP_HOST=$SMTP_HOST/" "$ENV_FILE"
sed -i.bak "s/^SMTP_PORT=.*/SMTP_PORT=$SMTP_PORT/" "$ENV_FILE"
sed -i.bak "s/^SMTP_USERNAME=.*/SMTP_USERNAME=$SMTP_USERNAME/" "$ENV_FILE"
sed -i.bak "s/^SMTP_PASSWORD=.*/SMTP_PASSWORD=$SMTP_PASSWORD/" "$ENV_FILE"
sed -i.bak "s/^SMTP_FROM=.*/SMTP_FROM=$SMTP_FROM/" "$ENV_FILE"

sed -i.bak "s/^AWS_S3_BUCKET=.*/AWS_S3_BUCKET=$AWS_S3_BUCKET/" "$ENV_FILE"
sed -i.bak "s/^AWS_S3_REGION=.*/AWS_S3_REGION=$AWS_S3_REGION/" "$ENV_FILE"
sed -i.bak "s/^AWS_ACCESS_KEY_ID=.*/AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID/" "$ENV_FILE"
sed -i.bak "s/^AWS_SECRET_ACCESS_KEY=.*/AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY/" "$ENV_FILE"

sed -i.bak "s/^STRIPE_PUBLISHABLE_KEY=.*/STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY/" "$ENV_FILE"
sed -i.bak "s/^STRIPE_SECRET_KEY=.*/STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY/" "$ENV_FILE"
sed -i.bak "s/^STRIPE_WEBHOOK_SECRET=.*/STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET/" "$ENV_FILE"

# Remove backup file
rm -f "$ENV_FILE.bak"

echo ""
echo -e "${GREEN}✓ Environment setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}Generated files:${NC}"
echo -e "  • ${GREEN}$ENV_FILE${NC} - Environment configuration"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Review the generated .env file"
echo "  2. Start infrastructure: docker-compose up -d"
echo "  3. Build common project: cd common && mvn clean install"
echo "  4. Run microservices in your IDE"
echo ""
echo -e "${YELLOW}Note: Keep your .env file secure and never commit it to version control!${NC}"
echo "" 