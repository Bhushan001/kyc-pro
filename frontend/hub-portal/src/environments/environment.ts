export const environment = {
  production: false,
  apiGatewayUrl: 'http://localhost:9080/api',
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