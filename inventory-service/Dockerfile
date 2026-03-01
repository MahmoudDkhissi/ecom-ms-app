FROM eclipse-temurin:17-jre
WORKDIR /app
VOLUME /tmp
EXPOSE 8083
COPY target/*.jar inventory-service.jar
ENTRYPOINT ["java", "-jar", "inventory-service.jar"]