FROM eclipse-temurin:17-jre
WORKDIR /app
VOLUME /tmp
EXPOSE 8082
COPY target/*.jar billing-service.jar
ENTRYPOINT ["java", "-jar", "billing-service.jar"]