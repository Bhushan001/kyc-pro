export const environment = {
  production: true,
  apiGatewayUrl: 'https://api.kyc-pro.com/api',
  services: {
    auth: '/auth',
    tenant: '/tenants',
    user: '/users',
    module: '/modules',
    subscription: '/subscriptions',
    keycloakSync: '/keycloak-sync',
    registry: '/registry'
  }
}; 