#!/bin/bash

echo "🔄 Rebuilding all services with Spring Boot 3.4.0..."

# Clean all services first
echo "🧹 Cleaning all services..."
cd common && mvn clean && cd ..
cd eureka-server && mvn clean && cd ..
cd api-gateway && mvn clean && cd ..
cd auth-service && mvn clean && cd ..
cd tenant-service && mvn clean && cd ..
cd user-service && mvn clean && cd ..
cd module-service && mvn clean && cd ..
cd subscription-service && mvn clean && cd ..

echo "✅ All services cleaned"

# Build in correct order
echo "🔨 Building services in order..."

echo "1. Building common project..."
cd common && mvn clean install && cd ..

echo "2. Building eureka-server..."
cd eureka-server && mvn clean install && cd ..

echo "3. Building api-gateway..."
cd api-gateway && mvn clean install && cd ..

echo "4. Building auth-service..."
cd auth-service && mvn clean install && cd ..

echo "5. Building tenant-service..."
cd tenant-service && mvn clean install && cd ..

echo "6. Building user-service..."
cd user-service && mvn clean install && cd ..

echo "7. Building module-service..."
cd module-service && mvn clean install && cd ..

echo "8. Building subscription-service..."
cd subscription-service && mvn clean install && cd ..

echo "✅ All services built successfully with Spring Boot 3.4.0!"
echo ""
echo "🚀 You can now start the services:"
echo "1. Start Eureka Server: cd eureka-server && mvn spring-boot:run"
echo "2. Start API Gateway: cd api-gateway && mvn spring-boot:run"
echo "3. Start other services as needed"
echo ""
echo "📊 Check Eureka Dashboard: http://localhost:8761" 