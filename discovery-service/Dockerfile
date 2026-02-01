FROM eclipse-temurin:17-jre
WORKDIR /app
VOLUME /tmp
EXPOSE 8761
COPY target/*.jar discovery-service.jar
ENTRYPOINT ["java", "-jar", "discovery-service.jar"]