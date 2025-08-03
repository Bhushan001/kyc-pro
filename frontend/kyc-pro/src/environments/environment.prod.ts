export const environment = {
  production: true,
  apiGatewayUrl: 'http://localhost:9080/api',
  services: {
    auth: '/auth',
    tenant: '/tenants',
    user: '/users',
    module: '/modules',
    subscription: '/subscriptions',
    keycloakSync: '/keycloak-sync',
    registry: '/registry'
  },
  portals: {
    hub: 'http://localhost:4201', // hub
    console: 'http://localhost:4202', // console
    workspace: 'http://localhost:4203', // workspace
    kycPro: 'http://localhost:4200' // main kyc-pro portal
  }
}; 