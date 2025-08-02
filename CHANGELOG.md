# Changelog

## [2024-08-02] - Major Refactoring Update

### 🔄 Java Version Update
- **Upgraded from Java 17 to Java 21** across all microservices
- Updated all `pom.xml` files to use Java 21
- Updated Maven compiler source and target to 21

### 🏗️ Package Name Refactoring
- **Changed package names from `com.saasplatform` to `com.ekyc`**
- Updated all Java files across all microservices
- Renamed directory structure to match new package names
- Updated all import statements and package declarations

### 🏠 Portal Renaming
- **Renamed "Parent Portal" to "Kyc-Pro Portal"**
- Renamed directory: `frontend/parent-portal` → `frontend/kyc-pro`
- Updated all documentation references
- Updated Angular configuration files
- Updated package.json and Dockerfile references

### 🗄️ Database Configuration
- **Updated database name from `saas_platform` to `ekyc_platform`**
- Updated environment variables and configuration files
- Updated Docker container names:
  - `saas-postgres` → `ekyc-postgres`
  - `saas-keycloak` → `ekyc-keycloak`
- Updated Docker network name: `saas-network` → `ekyc-network`

### 🔧 Environment Configuration
- **Updated all environment variable defaults**
- Updated Keycloak realm from `saas-platform` to `ekyc-platform`
- Updated Keycloak client from `saas-platform-client` to `ekyc-platform-client`
- Updated AWS S3 bucket references
- Updated email domain references

### 📚 Documentation Updates
- **Updated all documentation to reflect new naming**
- Updated README.md with new project name and descriptions
- Updated Setup.md with new container names and database references
- Updated common-project.md with new platform references
- Updated environment setup script with new defaults

### 🐳 Docker Configuration
- **Updated Docker Compose configuration**
- Updated container names and network names
- Updated database environment variables
- Updated volume and network references

### 🔄 Configuration Files
- **Updated Angular configuration files**
- Updated package.json files
- Updated Dockerfile references
- Updated build and deployment configurations

## Summary of Changes

### Files Modified
- All `pom.xml` files (Java version update)
- All Java source files (package name changes)
- All documentation files (naming updates)
- Environment configuration files
- Docker Compose configuration
- Angular configuration files
- Package.json files

### Directories Renamed
- `frontend/parent-portal` → `frontend/kyc-pro`
- All Java package directories updated to use `ekyc` instead of `saasplatform`

### Environment Variables Updated
- `POSTGRES_DB`: `saas_platform` → `ekyc_platform`
- `KEYCLOAK_REALM`: `saas-platform` → `ekyc-platform`
- `KEYCLOAK_RESOURCE`: `saas-platform-client` → `ekyc-platform-client`
- Container names and network names updated

### Breaking Changes
- **Database name change**: Requires database recreation or migration
- **Package name changes**: Requires IDE reimport and rebuild
- **Container name changes**: Requires Docker cleanup and restart
- **Portal name change**: Requires frontend rebuild

## Migration Steps

1. **Clean and rebuild all projects**:
   ```bash
   cd backend
   mvn clean install
   ```

2. **Recreate Docker containers**:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

3. **Rebuild frontend applications**:
   ```bash
   cd frontend/kyc-pro
   npm install
   npm start
   ```

4. **Update IDE configurations**:
   - Reimport Maven projects
   - Update run configurations
   - Clear IDE caches

## Notes
- All existing data will be lost due to database name change
- Package name changes require full rebuild of all microservices
- Frontend applications need to be rebuilt with new configuration
- Environment setup script has been updated with new defaults 