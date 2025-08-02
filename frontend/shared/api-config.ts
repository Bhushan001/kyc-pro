import { environment } from '../kyc-pro/src/environments/environment';

export class ApiConfig {
  // Base API Gateway URL
  static readonly BASE_URL = environment.apiGatewayUrl;
  
  // Service endpoints
  static readonly AUTH_SERVICE = `${environment.apiGatewayUrl}${environment.services.auth}`;
  static readonly TENANT_SERVICE = `${environment.apiGatewayUrl}${environment.services.tenant}`;
  static readonly USER_SERVICE = `${environment.apiGatewayUrl}${environment.services.user}`;
  static readonly MODULE_SERVICE = `${environment.apiGatewayUrl}${environment.services.module}`;
  static readonly SUBSCRIPTION_SERVICE = `${environment.apiGatewayUrl}${environment.services.subscription}`;
  static readonly KEYCLOAK_SYNC_SERVICE = `${environment.apiGatewayUrl}${environment.services.keycloakSync}`;
  static readonly REGISTRY_SERVICE = `${environment.apiGatewayUrl}${environment.services.registry}`;
  
  // Auth endpoints
  static readonly LOGIN = `${ApiConfig.AUTH_SERVICE}/login`;
  static readonly SIGNUP = `${ApiConfig.AUTH_SERVICE}/signup`;
  static readonly REFRESH_TOKEN = `${ApiConfig.AUTH_SERVICE}/refresh`;
  static readonly LOGOUT = `${ApiConfig.AUTH_SERVICE}/logout`;
  
  // Tenant endpoints
  static readonly GET_TENANTS = `${ApiConfig.TENANT_SERVICE}`;
  static readonly GET_TENANT_BY_ID = (id: string) => `${ApiConfig.TENANT_SERVICE}/${id}`;
  static readonly CREATE_TENANT = `${ApiConfig.TENANT_SERVICE}`;
  static readonly UPDATE_TENANT = (id: string) => `${ApiConfig.TENANT_SERVICE}/${id}`;
  static readonly DELETE_TENANT = (id: string) => `${ApiConfig.TENANT_SERVICE}/${id}`;
  
  // User endpoints
  static readonly GET_USERS = `${ApiConfig.USER_SERVICE}`;
  static readonly GET_USER_BY_ID = (id: string) => `${ApiConfig.USER_SERVICE}/${id}`;
  static readonly GET_USERS_BY_TENANT = (tenantId: string) => `${ApiConfig.USER_SERVICE}/tenant/${tenantId}`;
  static readonly CREATE_USER = `${ApiConfig.USER_SERVICE}`;
  static readonly UPDATE_USER = (id: string) => `${ApiConfig.USER_SERVICE}/${id}`;
  static readonly DELETE_USER = (id: string) => `${ApiConfig.USER_SERVICE}/${id}`;
  static readonly GET_USER_TASKS = (userId: string) => `${ApiConfig.USER_SERVICE}/${userId}/tasks`;
  
  // Module endpoints
  static readonly GET_MODULES = `${ApiConfig.MODULE_SERVICE}`;
  static readonly GET_MODULE_BY_ID = (id: string) => `${ApiConfig.MODULE_SERVICE}/${id}`;
  static readonly CREATE_MODULE = `${ApiConfig.MODULE_SERVICE}`;
  static readonly UPDATE_MODULE = (id: string) => `${ApiConfig.MODULE_SERVICE}/${id}`;
  static readonly DELETE_MODULE = (id: string) => `${ApiConfig.MODULE_SERVICE}/${id}`;
  
  // Subscription endpoints
  static readonly GET_SUBSCRIPTIONS = `${ApiConfig.SUBSCRIPTION_SERVICE}`;
  static readonly GET_SUBSCRIPTION_BY_ID = (id: string) => `${ApiConfig.SUBSCRIPTION_SERVICE}/${id}`;
  static readonly GET_SUBSCRIPTIONS_BY_TENANT = (tenantId: string) => `${ApiConfig.SUBSCRIPTION_SERVICE}/tenant/${tenantId}`;
  static readonly CREATE_SUBSCRIPTION = `${ApiConfig.SUBSCRIPTION_SERVICE}`;
  static readonly UPDATE_SUBSCRIPTION = (id: string) => `${ApiConfig.SUBSCRIPTION_SERVICE}/${id}`;
  static readonly DELETE_SUBSCRIPTION = (id: string) => `${ApiConfig.SUBSCRIPTION_SERVICE}/${id}`;
  
  // Keycloak Sync endpoints
  static readonly SYNC_USER = `${ApiConfig.KEYCLOAK_SYNC_SERVICE}/users/sync`;
  static readonly DELETE_USER_FROM_KEYCLOAK = (email: string) => `${ApiConfig.KEYCLOAK_SYNC_SERVICE}/users/${email}`;
  static readonly SYNC_ROLE = `${ApiConfig.KEYCLOAK_SYNC_SERVICE}/roles/sync`;
  static readonly KEYCLOAK_SYNC_HEALTH = `${ApiConfig.KEYCLOAK_SYNC_SERVICE}/health`;
  
  // Registry endpoints
  static readonly CREATE_ROLE = `${ApiConfig.REGISTRY_SERVICE}/roles/create`;
  static readonly GET_ROLE_BY_ID = (roleId: string) => `${ApiConfig.REGISTRY_SERVICE}/roles/${roleId}`;
  static readonly GET_ROLE_BY_CODE = (roleCode: string) => `${ApiConfig.REGISTRY_SERVICE}/roles/code/${roleCode}`;
  static readonly GET_ALL_ROLES = `${ApiConfig.REGISTRY_SERVICE}/roles`;
  static readonly GET_ROLES_BY_TENANT = (tenantId: string) => `${ApiConfig.REGISTRY_SERVICE}/roles/tenant/${tenantId}`;
  static readonly UPDATE_ROLE = (roleId: string) => `${ApiConfig.REGISTRY_SERVICE}/roles/${roleId}`;
  static readonly DELETE_ROLE = (roleId: string) => `${ApiConfig.REGISTRY_SERVICE}/roles/${roleId}`;
  static readonly REGISTRY_HEALTH = `${ApiConfig.REGISTRY_SERVICE}/roles/health`;
} 