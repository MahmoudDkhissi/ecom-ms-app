FROM eclipse-temurin:17-jre
WORKDIR /app
VOLUME /tmp
EXPOSE 8888
COPY target/*.jar gateway-service.jar
ENTRYPOINT ["java", "-jar", "gateway-service.jar"]