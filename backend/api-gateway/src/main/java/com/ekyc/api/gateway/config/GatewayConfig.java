package com.ekyc.api.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Health check route - fixed to point to actuator
                .route("health-check", r -> r.path("/health")
                        .filters(f -> f.rewritePath("/health", "/actuator/health"))
                        .uri("http://localhost:9080"))
                
                // Auth Service routes
                .route("auth", r -> r.path("/api/auth/**")
                        .filters(f -> f.rewritePath("/api/auth/(?<segment>.*)", "/api/auth/${segment}"))
                        .uri("lb://auth-service"))
                
                // User Service routes
                .route("user-management", r -> r.path("/api/users/**")
                        .filters(f -> f.rewritePath("/api/users/(?<segment>.*)", "/${segment}"))
                        .uri("lb://user-service"))
                
                // Tenant Service routes
                .route("tenant-management", r -> r.path("/api/tenants/**")
                        .filters(f -> f.rewritePath("/api/tenants/(?<segment>.*)", "/${segment}"))
                        .uri("lb://tenant-service"))
                
                // Module Service routes
                .route("module-service", r -> r.path("/api/modules/**")
                        .filters(f -> f.rewritePath("/api/modules/(?<segment>.*)", "/${segment}"))
                        .uri("lb://module-service"))
                
                // Subscription Service routes
                .route("subscription-service", r -> r.path("/api/subscriptions/**")
                        .filters(f -> f.rewritePath("/api/subscriptions/(?<segment>.*)", "/${segment}"))
                        .uri("lb://subscription-service"))
                
                // Registry Service routes
                .route("registry-service", r -> r.path("/api/registry/**")
                        .filters(f -> f.rewritePath("/api/registry/(?<segment>.*)", "/${segment}"))
                        .uri("lb://registry-service"))
                
                // Keycloak Sync Service routes
                .route("keycloak-sync-service", r -> r.path("/api/keycloak-sync/**")
                        .filters(f -> f.rewritePath("/api/keycloak-sync/(?<segment>.*)", "/${segment}"))
                        .uri("lb://keycloak-sync-service"))
                
                // Eureka Server route for service discovery
                .route("eureka", r -> r.path("/eureka/**")
                        .filters(f -> f.rewritePath("/eureka/(?<segment>.*)", "/${segment}"))
                        .uri("http://localhost:8761"))
                
                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(Arrays.asList("*"));
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
} 