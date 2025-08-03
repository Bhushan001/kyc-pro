# Keycloak Quick Setup Guide

## 🚀 Quick Configuration Steps

### **1. Start Keycloak**
```bash
cd backend
docker-compose up -d keycloak
```

### **2. Access Admin Console**
- **URL:** http://localhost:8080
- **Username:** `admin`
- **Password:** `admin123`

### **3. Create Realm**
1. Click **"Create Realm"** (top-left dropdown)
2. **Realm Name:** `ekyc`
3. Click **"Create"**

### **4. Configure Realm Settings**
1. Go to **Realm Settings** → **General**
2. **Display Name:** `KYC-Pro Platform`
3. **HTML Display Name:** `KYC-Pro Platform`
4. Click **"Save"**

### **5. Configure Admin CLI Client (Check Existing)**
1. Go to **Clients** → Look for `admin-cli`
2. **If admin-cli exists:**
   - Click on `admin-cli` to edit
   - Go to **Settings** tab
   - Ensure **Access Type:** `confidential`
   - Ensure **Client Protocol:** `openid-connect`
   - Click **"Save"**
   - Go to **Credentials** tab
   - Note the **Client Secret** (you'll need this)
3. **If admin-cli doesn't exist:**
   - Click **"Create"**
   - **Client ID:** `admin-cli`
   - **Client Protocol:** `openid-connect`
   - **Access Type:** `confidential`
   - Click **"Save"**
   - Go to **Credentials** tab
   - Note the **Client Secret**

### **6. Create Frontend Client**
1. Go to **Clients** → **Create**
2. **Client ID:** `kyc-pro-frontend`
3. **Client Protocol:** `openid-connect`
4. **Access Type:** `public`
5. **Valid Redirect URIs:** 
   ```
   http://localhost:4200/*
   http://localhost:4201/*
   http://localhost:4202/*
   http://localhost:4203/*
   ```
6. **Web Origins:** 
   ```
   http://localhost:4200
   http://localhost:4201
   http://localhost:4202
   http://localhost:4203
   ```
7. Click **"Save"**

### **7. Create Roles (Manual)**
1. Go to **Roles** → **Add Role**
2. Create these 3 roles:

#### **Role 1: PLATFORM_ADMIN**
- **Role Name:** `PLATFORM_ADMIN`
- **Description:** `Platform Administrator`
- **Composite Roles:** `OFF`
- Click **"Save"**

#### **Role 2: PLATFORM_TENANT_ADMIN**
- **Role Name:** `PLATFORM_TENANT_ADMIN`
- **Description:** `Platform Tenant Administrator`
- **Composite Roles:** `OFF`
- Click **"Save"**

#### **Role 3: PLATFORM_USER**
- **Role Name:** `PLATFORM_USER`
- **Description:** `Platform User`
- **Composite Roles:** `OFF`
- Click **"Save"**

### **8. Create Test Users (Optional)**
1. Go to **Users** → **Add User**
2. Create test users with appropriate roles

## ✅ Verification

### **Check Keycloak Health:**
```bash
curl http://localhost:8080/health/ready
```

### **Check Realm:**
- Visit: http://localhost:8080/auth/realms/ekyc

### **Check Roles:**
- Go to: http://localhost:8080 → Admin Console → ekyc realm → Roles

## 🔧 Environment Variables

Add these to your `.env` file:
```bash
# Keycloak Configuration
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=ekyc
KEYCLOAK_CLIENT_ID=admin-cli
KEYCLOAK_CLIENT_SECRET=<your-client-secret>
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin123
```

## 🎯 Next Steps

After Keycloak is configured:
1. Start all KYC-Pro services
2. Import the Postman collection
3. Create roles using the API (they'll auto-sync to Keycloak)
4. Verify roles in both database and Keycloak

## 🚨 Troubleshooting

### **Keycloak Not Starting:**
```bash
# Check logs
docker-compose logs keycloak

# Restart Keycloak
docker-compose restart keycloak
```

### **Database Connection Issues:**
```bash
# Check PostgreSQL
docker-compose ps postgres

# Check database
docker exec -it ekyc-postgres psql -U saas_user -d keycloak
```

### **Admin Console Not Accessible:**
- Verify port 8080 is not blocked
- Check if Keycloak container is running
- Try accessing http://localhost:8080/health/ready 