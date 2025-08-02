# Keycloak Setup Documentation

## 🔐 Keycloak Overview

Keycloak is used as the Identity and Access Management (IAM) system for the KYC-Pro platform. It handles user authentication, authorization, and role management.

## 🚀 Quick Access

### **Admin Console**
- **URL:** http://localhost:8080
- **Username:** `admin`
- **Password:** `admin123`

### **Health Check**
- **URL:** http://localhost:8080/health/ready
- **Status:** Returns 200 OK when ready

## 📋 Initial Setup Steps

### **1. Access Admin Console**
1. Open browser and navigate to: http://localhost:8080
2. Click on "Administration Console"
3. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`

### **2. Create Realm**
1. **Hover over the realm dropdown** (top-left corner)
2. **Click "Create Realm"**
3. **Enter realm name:** `ekyc`
4. **Click "Create"**

### **3. Configure Realm Settings**

#### **General Settings:**
1. Go to **Realm Settings** → **General**
2. **Display Name:** `KYC-Pro Platform`
3. **HTML Display Name:** `KYC-Pro Platform`
4. **Save**

#### **Login Settings:**
1. Go to **Realm Settings** → **Login**
2. **User registration:** `ON`
3. **Forgot password:** `ON`
4. **Remember me:** `ON`
5. **Save**

#### **Email Settings (Optional):**
1. Go to **Realm Settings** → **Email**
2. Configure SMTP settings if email notifications are needed
3. **Save**

### **4. Create Client Applications**

#### **Admin CLI Client (for service-to-service communication):**
1. Go to **Clients** → **Create**
2. **Client ID:** `admin-cli`
3. **Client Protocol:** `openid-connect`
4. **Root URL:** `http://localhost:8080`
5. **Access Type:** `confidential`
6. **Valid Redirect URIs:** `http://localhost:8080/*`
7. **Web Origins:** `http://localhost:8080`
8. **Save**

#### **Configure Admin CLI Client:**
1. Go to **Credentials** tab
2. **Client Authenticator:** `client-id-and-secret`
3. **Secret:** (auto-generated, note this down)
4. **Save**

#### **Frontend Client (for Angular applications):**
1. Go to **Clients** → **Create**
2. **Client ID:** `kyc-pro-frontend`
3. **Client Protocol:** `openid-connect`
4. **Root URL:** `http://localhost:4200`
5. **Access Type:** `public`
6. **Valid Redirect URIs:** 
   ```
   http://localhost:4200/*
   http://localhost:4201/*
   http://localhost:4202/*
   http://localhost:4203/*
   ```
7. **Web Origins:** 
   ```
   http://localhost:4200
   http://localhost:4201
   http://localhost:4202
   http://localhost:4203
   ```
8. **Save**

### **5. Create Roles**

#### **Platform Roles:**
1. Go to **Roles** → **Add Role**
2. **Role Name:** `ROLE_PLATFORM_ADMIN`
3. **Description:** `Platform Administrator`
4. **Composite Roles:** `OFF`
5. **Save**

3. **Role Name:** `ROLE_PLATFORM_USER`
4. **Description:** `Platform User`
5. **Composite Roles:** `OFF`
6. **Save**

#### **Tenant Roles:**
1. **Role Name:** `ROLE_TENANT_ADMIN`
2. **Description:** `Tenant Administrator`
3. **Composite Roles:** `OFF`
4. **Save**

1. **Role Name:** `ROLE_TENANT_USER`
2. **Description:** `Tenant User`
3. **Composite Roles:** `OFF`
4. **Save**

### **6. Create User Groups (Optional)**

#### **Platform Administrators:**
1. Go to **Groups** → **New**
2. **Name:** `Platform Administrators`
3. **Save**

#### **Tenant Administrators:**
1. **Name:** `Tenant Administrators`
2. **Save**

#### **Platform Users:**
1. **Name:** `Platform Users`
2. **Save**

### **7. Create Test Users**

#### **Platform Admin User:**
1. Go to **Users** → **Add User**
2. **Username:** `platform.admin`
3. **Email:** `admin@kyc-pro.com`
4. **First Name:** `Platform`
5. **Last Name:** `Administrator`
6. **Email Verified:** `ON`
7. **Save**

8. Go to **Credentials** tab
9. **New Password:** `admin123`
10. **Password Confirmation:** `admin123`
11. **Temporary:** `OFF`
12. **Save**

13. Go to **Role Mappings** tab
14. **Available Roles:** Select `ROLE_PLATFORM_ADMIN`
15. **Add selected**

#### **Tenant Admin User:**
1. **Username:** `tenant.admin`
2. **Email:** `tenant.admin@kyc-pro.com`
3. **First Name:** `Tenant`
4. **Last Name:** `Administrator`
5. **Email Verified:** `ON`
6. **Save**

7. Set password: `tenant123`
8. Assign role: `ROLE_TENANT_ADMIN`

#### **Regular User:**
1. **Username:** `user`
2. **Email:** `user@kyc-pro.com`
3. **First Name:** `Regular`
4. **Last Name:** `User`
5. **Email Verified:** `ON`
6. **Save**

7. Set password: `user123`
8. Assign role: `ROLE_PLATFORM_USER`

## 🔧 Configuration Details

### **Environment Variables:**
```bash
# Keycloak Configuration
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=ekyc
KEYCLOAK_CLIENT_ID=admin-cli
KEYCLOAK_CLIENT_SECRET=<your-client-secret>
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin123
```

### **Database Configuration:**
```bash
# Keycloak Database
KC_DB=postgres
KC_DB_URL=jdbc:postgresql://postgres:5432/keycloak?currentSchema=public
KC_DB_USERNAME=saas_user
KC_DB_PASSWORD=saas_password
```

### **Docker Configuration:**
```yaml
keycloak:
  image: quay.io/keycloak/keycloak:23.0
  environment:
    KEYCLOAK_ADMIN: admin
    KEYCLOAK_ADMIN_PASSWORD: admin123
    KC_DB: postgres
    KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak?currentSchema=public
    KC_DB_USERNAME: saas_user
    KC_DB_PASSWORD: saas_password
    KC_HOSTNAME_STRICT: false
    KC_HTTP_ENABLED: true
    KC_HEALTH_ENABLED: true
    KC_METRICS_ENABLED: true
  ports:
    - "8080:8080"
```

## 🔄 Integration with KYC-Pro Services

### **Keycloak Sync Service:**
- **Port:** 9086
- **Purpose:** Synchronizes users and roles between application database and Keycloak
- **Endpoints:** `/api/keycloak-sync/**`

### **Registry Service:**
- **Port:** 9087
- **Purpose:** Manages role lifecycle and integrates with Keycloak Sync
- **Endpoints:** `/api/registry/**`

### **Auth Service:**
- **Port:** 9081
- **Purpose:** Handles authentication and JWT token validation
- **Integration:** Uses Keycloak for user verification

## 📊 Monitoring and Health

### **Health Check Endpoints:**
- **Readiness:** http://localhost:8080/health/ready
- **Liveness:** http://localhost:8080/health/live
- **Metrics:** http://localhost:8080/metrics

### **Admin Console:**
- **URL:** http://localhost:8080
- **Login:** admin/admin123

### **API Endpoints:**
- **REST API:** http://localhost:8080/auth/realms/ekyc
- **OpenID Connect:** http://localhost:8080/auth/realms/ekyc/protocol/openid-connect

## 🔐 Security Best Practices

### **Production Recommendations:**
1. **Change default admin password**
2. **Use HTTPS in production**
3. **Configure proper CORS settings**
4. **Set up proper client secrets**
5. **Enable audit logging**
6. **Configure session timeouts**
7. **Set up password policies**

### **Password Policy:**
1. Go to **Realm Settings** → **Authentication**
2. **Password Policy:** Configure minimum requirements
3. **Brute Force Detection:** Enable protection
4. **Save**

### **Session Management:**
1. Go to **Realm Settings** → **Sessions**
2. **SSO Session Idle:** `30 minutes`
3. **SSO Session Max:** `10 hours`
4. **Save**

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. Database Connection Failed:**
- Check if PostgreSQL is running: `docker-compose ps`
- Verify database exists: `docker exec -it ekyc-postgres psql -U saas_user -d keycloak`
- Check logs: `docker-compose logs keycloak`

#### **2. Admin Console Not Accessible:**
- Verify container is running: `docker ps`
- Check port mapping: `docker port ekyc-keycloak`
- Check logs: `docker logs ekyc-keycloak`

#### **3. Client Authentication Failed:**
- Verify client secret is correct
- Check client configuration in admin console
- Ensure client protocol is `openid-connect`

#### **4. User Sync Issues:**
- Check Keycloak Sync Service logs
- Verify database connectivity
- Check role mappings in Keycloak

### **Useful Commands:**
```bash
# Check container status
docker-compose ps

# View Keycloak logs
docker-compose logs -f keycloak

# Access PostgreSQL
docker exec -it ekyc-postgres psql -U saas_user -d keycloak

# Restart Keycloak
docker-compose restart keycloak

# Check health
curl http://localhost:8080/health/ready
```

## 📚 Additional Resources

- **Keycloak Documentation:** https://www.keycloak.org/documentation
- **OpenID Connect:** https://openid.net/connect/
- **OAuth 2.0:** https://oauth.net/2/
- **Keycloak REST API:** https://www.keycloak.org/docs-api/23.0/rest-api/ 