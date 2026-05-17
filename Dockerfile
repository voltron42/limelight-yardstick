# Stage 1: Build with Leiningen
FROM clojure:temurin-21-lein-2.11.2 as builder
WORKDIR /app

# Copy project configuration
COPY project.clj .

# Download dependencies
RUN lein deps

# Copy source code and resources
COPY src/ ./src/
COPY resources/ ./resources/

# Build uberjar
RUN lein uberjar

# Stage 2: Runtime with minimal Alpine image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy compiled JAR from builder stage
COPY --from=builder /app/target/uberjar/limelight-yardstick-*-standalone.jar ./app.jar

# Expose port (for Fly.io)
EXPOSE 8080

# Use dumb-init to properly handle signals
ENTRYPOINT ["dumb-init", "--"]

# Run the application
CMD ["java", "-jar", "app.jar"]
