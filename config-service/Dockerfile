FROM eclipse-temurin:17-jre
WORKDIR /app
VOLUME /tmp
EXPOSE 9999
COPY target/*.jar config-service.jar
ENTRYPOINT ["java", "-jar", "config-service.jar"]