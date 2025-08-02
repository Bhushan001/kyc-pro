package com.ekyc.keycloaksyncservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class KeycloakSyncServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(KeycloakSyncServiceApplication.class, args);
    }
} 