FROM eclipse-temurin:17-jre
WORKDIR /app
VOLUME /tmp
EXPOSE 8082
COPY target/*.jar billing-service.jar
COPY wait-for-keycloak.sh /wait-for-keycloak.sh
RUN chmod +x /wait-for-keycloak.sh
CMD ["sh", "-c", "/wait-for-keycloak.sh && java -jar billing-service.jar"]