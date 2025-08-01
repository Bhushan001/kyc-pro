#!/bin/bash
set -euo pipefail

COMMON_ROOT="./common"
PKG_PATH="com/saasplatform/common"

echo "Creating common Maven library module at $COMMON_ROOT..."

# Create directory structure for Java and resources
mkdir -p "$COMMON_ROOT/src/main/java/$PKG_PATH"
mkdir -p "$COMMON_ROOT/src/main/resources/static"
mkdir -p "$COMMON_ROOT/src/main/resources/templates"

# pom.xml with packaging jar (not spring-boot)
cat > "$COMMON_ROOT/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.saasplatform</groupId>
    <artifactId>common</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>common</name>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Place shared dependencies here (optional) -->
    </dependencies>

    <build>
        <plugins>
            <!-- Compiler plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.10.1</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
EOF

# Sample Java class - SharedDto.java
cat > "$COMMON_ROOT/src/main/java/$PKG_PATH/SharedDto.java" <<EOF
package com.saasplatform.common;

/**
 * Sample shared DTO for demonstration.
 */
public class SharedDto {
    private String message;

    public SharedDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
EOF

# Sample static text file (could be a static configuration, template snippet, etc.)
echo "This is a sample static resource from the common module." > "$COMMON_ROOT/src/main/resources/static/sample.txt"

# Sample template file
echo "<html><body><h1>Sample Template from Common Module</h1></body></html>" > "$COMMON_ROOT/src/main/resources/templates/sample.html"

echo "✅ Common Maven library module scaffold is ready at $COMMON_ROOT."
echo "  - Add more shared Java classes inside src/main/java/$PKG_PATH/"
echo "  - Add static resources under src/main/resources/"
echo "  - Build with: mvn clean install"
echo "  - Reference in other modules via dependency:"
echo "      <dependency>"
echo "        <groupId>com.saasplatform</groupId>"
echo "        <artifactId>common</artifactId>"
echo "        <version>1.0.0</version>"
echo "      </dependency>"
