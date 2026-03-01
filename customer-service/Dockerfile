FROM eclipse-temurin:17-jre
WORKDIR /app
VOLUME /tmp
EXPOSE 8081
COPY target/*.jar customer-service.jar
ENTRYPOINT ["java", "-jar", "customer-service.jar"]