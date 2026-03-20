# Billing Microservices Platform

## General Description

This platform consists of **3 main interconnected microservices**:

1. **Customer Service** – manages customers
2. **Inventory Service** – manages products
3. **Billing Service** – manages bills and product items, combining customer and product data

In addition to these three microservices:

* **Discovery Service (Eureka)** – service registry for dynamic service discovery
* **Reactive Gateway** – single entry point for external clients, with dynamic routing to microservices

Each microservice has its own **H2 database** and exposes a **Spring Data REST Repository** for simple CRUD operations.

---

## Microservices Architecture


```
                                          [ Clients / Frontend ]
                                                    |
                                                    v
                                           [ Gateway Reactive ]   <---   [ Eureka Discovery ]
                                                    |                         | (register)         
          ----------------------------------------------------------------------------------------
          |                                         |                                            |
          v                                         v                                            v
[ Customer Service ] <-(openFeign Client)-> [ Billing Service ] <-(openFeign Client)-> [ Inventory Service ]
          |                                         |                                            |
          v                                         v                                            v
        H2 DB                                     H2 DB                                        H2 DB
```

### Details

* **Reactive Gateway**:
    * Routes requests to microservices via `lb://service-name`
    * Exposes microservice endpoints to external clients

* **Discovery Service (Eureka)**:
    * All microservices register with Eureka
    * Allows the **Gateway** and other services to dynamically discover available instances

* **Billing Service** fetches:
    * the customer from Customer Service via FeignClient
    * the products from Inventory Service via FeignClient

* FeignClients are protected by **Resilience4j Circuit Breakers** to handle service unavailability.

---

## Technologies Used

* Java 17+
* Spring Boot 3.2.5
* Spring Web, Spring WebFlux (Reactive Gateway)
* Spring Data JPA, Spring Data REST
* OpenFeign for inter-service calls
* Resilience4j (Circuit Breaker)
* H2 Database (in-memory)
* Eureka Discovery Service
* Springdoc OpenAPI / Swagger (automatic documentation)
* HAL + JSON (HATEOAS)

---

## Running the Services

### Prerequisites

* Java 17 or higher
* Maven

### Steps

1. Start **Eureka Discovery Service**

```bash
cd discovery-service
mvn clean install
mvn spring-boot:run
```

2. Start **Customer Service**

```bash
cd customer-service
mvn clean install
mvn spring-boot:run
```

3. Start **Inventory Service**

```bash
cd inventory-service
mvn clean install
mvn spring-boot:run
```

4. Start **Billing Service**

```bash
cd billing-service
mvn clean install
mvn spring-boot:run
```

5. Start **Gateway Reactive**

```bash
cd gateway
mvn clean install
mvn spring-boot:run
```

* Services automatically register with **Eureka**
* The **Gateway** dynamically routes requests using `lb://service-name`

---

## 🐳 Running with Docker & Docker Compose (Recommended)

The entire microservices platform can be containerized and orchestrated using **Docker** and **Docker Compose**. This is the **recommended approach** for development and deployment.

### Prerequisites

* Docker installed ([Download](https://www.docker.com/products/docker-desktop))
* Docker Compose installed (included with Docker Desktop)
* Build all services first: `mvn clean install` in each service directory

### Build Docker Images

Build all service images:

```bash
docker-compose build
```

### Start All Services

Launch the entire platform with a single command:

```bash
docker-compose up -d
```

Or, to see logs in real-time:

```bash
docker-compose up
```

### Service Details

The `docker-compose.yml` orchestrates the following services:

| Service | Port | Container Name | Purpose |
|---------|------|---|---------|
| **discovery-service** | 8761 | discovery-service | Eureka Service Registry |
| **config-service** | 9999 | config-service | Spring Cloud Config Server |
| **keycloak** | 8080 | keycloak | Identity Provider (OAuth2/OIDC) |
| **billing-service** | 8082 | billing-service | Billing microservice |
| **inventory-service** | 8083 | inventory-service | Inventory microservice |
| **customer-service** | 8081 | customer-service | Customer microservice |
| **gateway-service** | 8888 | gateway-service | Reactive API Gateway |

### Service Dependencies & Startup Order

Docker Compose automatically manages startup order using health checks:

```
discovery-service (starts first)
        ↓
config-service (waits for discovery-service to be healthy)
        ↓
keycloak (waits for discovery-service to be healthy)
        ↓
billing-service (waits for config-service & keycloak to be healthy)
        ↓
inventory-service (waits for billing-service to be healthy)
        ↓
customer-service (waits for billing-service to be healthy)
        ↓
gateway-service (waits for all microservices to be healthy)
```

### Environment Variables

Each service is configured with the following environment variables for Docker networking:

```yaml
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://discovery-service:8761/eureka/
SPRING_CONFIG_IMPORT=optional:configserver:http://config-service:9999
KEYCLOAK_ISSUER_URI=http://keycloak:8080/realms/ecom-realm
```

These variables allow services to communicate via **container names** (Docker DNS) instead of `localhost`.

### Networking

All services are connected through a **custom bridge network** (`mdk-network`), enabling service-to-service communication using container names (e.g., `http://config-service:9999`).

### Data Persistence

* **Keycloak Data:** Stored in a named volume `keycloak_data` to persist realm configuration and user data across container restarts.
* **Microservices:** Use in-memory H2 databases (no persistence across restarts by design).

### View Running Containers

```bash
docker-compose ps
```

### View Service Logs

View all logs:
```bash
docker-compose logs -f
```

View specific service logs:
```bash
docker-compose logs -f billing-service
```

### Stop All Services

```bash
docker-compose down
```

To also remove volumes (careful: deletes Keycloak data):
```bash
docker-compose down -v
```

### Access Services

Once all services are running and healthy:

* **Gateway:** http://localhost:8888
* **Keycloak Admin Console:** http://localhost:8080/admin (admin / admin)
* **Billing Service Swagger:** http://localhost:8082/swagger-ui.html
* **Customer Service Swagger:** http://localhost:8081/swagger-ui.html
* **Inventory Service Swagger:** http://localhost:8083/swagger-ui.html
* **Eureka Dashboard:** http://localhost:8761

### Testing with Docker

#### 1. Authenticate with Keycloak
```bash
curl -X POST "http://localhost:8080/realms/ecom-realm/protocol/openid-connect/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=password" \
     -d "client_id=your_client_id" \
     -d "username=your_username" \
     -d "password=your_password"
```

#### 2. Call an Endpoint Through the Gateway
```bash
curl -X GET "http://localhost:8888/api/bills/1" \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### Troubleshooting Docker

**Issue:** Service fails to start with "dependency failed to start"

**Solution:** Ensure all images are built and health checks pass:
```bash
docker-compose ps
docker-compose logs <service_name>
```

**Issue:** Services can't communicate

**Solution:** Verify all services are on the same network:
```bash
docker network inspect ecom-ms-app_mdk-network
```

---

## API and Gateway Routing

### Example routes defined in the Gateway :

| Route                  | Target Service     | Description       |
|------------------------| ----------------- |-------------------|
| `/api/bills/**`        | Billing Service   | CRUD bills        |
| `/customers/**`        | Customer Service  | CRUD customers    |
| `/products/**`         | Inventory Service | CRUD products     |
| `/api/productItems/**` | Billing Service   | CRUD ProductItems |

* REST endpoints of each microservice remain accessible via the Gateway (port 8888).

---

## Resilience – Circuit Breaker

* **Billing Service** uses **Resilience4j Circuit Breaker** on the FeignClients for Customer and Inventory.
* Each fallback provides default data:

    * **Default Customer** if Customer Service is down
    * **Default Product** if Inventory Service is down
* This allows Billing Service to continue responding even if a dependent service fails.

---

## Main Models

### Bill

* `id`
* `customerId`
* `name`
* `description`
* `productItems` (list of ProductItems)
* `customer` (Customer fetched via FeignClient)

### ProductItem

* `id`
* `productId`
* `quantity`
* `product` (Product fetched via FeignClient)
* `bill` (reference to the Bill)

### Customer

* `id`
* `name`
* `email`

### Product

* `id`
* `name`
* `description`
* `price`
* `discount`

---
# Centralized Configuration – Spring Cloud Config Server

The platform uses **Spring Cloud Config Server** to externalize and centralize configuration for all microservices.

---

## Why Centralized Configuration?

* Avoid configuration duplication across services
* Centralize configuration management
* Support multiple environments (`dev`, `prod`, etc.)
* Version configuration using Git
* Enable dynamic configuration refresh without restarting services

---

## Configuration Repository

Configuration files are stored in a Git repository:
```
config-repo/
├── billing-service.properties
├── customer-service.properties
├── inventory-service.properties
├── application.properties
```

⚠️ File names **must match** the value of `spring.application.name`.

---

## Architecture Overview
```
        [ Git Config Repository ]
                   |
                   v
            [ Config Server ]
                   |
       ------------------------
       |          |           |           
       v          v           v           
      Billing  Customer  Inventory  
```

* All microservices fetch their configuration from the **Config Server**
* Configuration is no longer embedded inside each microservice

---

## Microservice Client Configuration Example

Each microservice imports its configuration from the Config Server:
```properties
spring.application.name=billing-service
spring.config.import=optional:configserver:http://localhost:8888
```

---

## Configuration Refresh Strategies

By default, configuration does not refresh automatically after a Git commit. Spring Cloud provides two refresh mechanisms.

### 1️⃣ Manual Refresh with Actuator

**Steps:**

1. Update configuration in the Git repository
2. Commit the changes
3. Trigger refresh manually on a specific service:
```http
POST /actuator/refresh
```

**Characteristics:**

* Refreshes only the targeted microservice
* Requires:
  * Spring Boot Actuator
  * `@RefreshScope` on beans using dynamic configuration
* Useful for development and testing

### 2️⃣ Distributed Refresh with Spring Cloud Bus (Recommended)

Spring Cloud Bus propagates configuration changes to all microservices using a message broker (RabbitMQ or Kafka).

**Flow:**
```
Git Commit
   ↓
Config Server
   ↓
Spring Cloud Bus
   ↓
All Microservices refresh automatically
```

**Trigger refresh once:**
```http
POST /actuator/busrefresh
```

**Characteristics:**

* Asynchronous and scalable
* Suitable for microservices architectures
* Ensures configuration consistency across services
* Avoids manual refresh per service

---
---

## 🔐 Security & Identity Management

The platform implements a **stateless security architecture** based on **OAuth2 and OpenID Connect (OIDC)**, using **Keycloak** as the Identity Provider.

### 🏗️ Security Architecture Overview

* **Identity Provider (IdP):** Keycloak manages users, roles, and authentication.
* **Authentication Flow:** The **Reactive Gateway** handles the initial authentication. Once authenticated, the user receives a **JWT (JSON Web Token)**.
* **Resource Servers:** Each microservice (Customer, Inventory, Billing) acts as a **Resource Server**. They independently validate the JWT's signature and expiration using Keycloak's public keys.
* **RBAC (Role-Based Access Control):** Access is restricted based on user roles (`ADMIN`, `USER`) defined in Keycloak.



### 🛠️ Key Security Implementations

#### 1. Custom Role Mapping (KeycloakRoleConverter)
By default, Spring Security looks for roles in the `scope` claim. We implemented a custom `KeycloakRoleConverter` to:
* Extract roles from the `realm_access.roles` JSON path in the JWT.
* Map them to Spring Security authorities with the `ROLE_` prefix (e.g., `ROLE_ADMIN`).
* Enable method-level security using `@PreAuthorize("hasRole('ADMIN')")`.

#### 2. Token Propagation (Token Relay)
To maintain security during inter-service communication (e.g., when `Billing Service` calls `Customer Service` via Feign):
* A **Feign Request Interceptor** was created.
* It captures the JWT from the current `SecurityContext`.
* It injects the token into the `Authorization: Bearer <token>` header of the outgoing request.
* This ensures the downstream service can also verify the user's identity and roles.

### 🚀 How to Test Security

#### 1. Obtain an Access Token
Send a POST request to Keycloak to get a JWT:
```bash
curl -X POST "http://localhost:8080/realms/ecom-realm/protocol/openid-connect/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=password" \
     -d "client_id=your_client_id" \
     -d "username=your_username" \
     -d "password=*****"
   ```  
#### 2. Call a Secured Endpoint
Use the `access_token` received from Keycloak to call the Gateway. The Gateway will then relay this token to the appropriate microservice:

```bash
curl -X GET "http://localhost:8888/api/bills" \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```
---

## Key Points

* Independent microservices with H2 for dev/test
* Inter-service data aggregation via Billing Service
* Reactive Gateway with dynamic routing `lb://service-name`
* Automatic service discovery via Eureka
* Fault tolerance with **Circuit Breaker**
* Automatic OpenAPI documentation for each service

---

## Automatic Documentation

Each microservice exposes its OpenAPI documentation at:



```
http://<host>:<port>/v3/api-docs
```

Example for Billing Service :

```
http://localhost:8082/v3/api-docs
```

Swagger UI pour tester les endpoints :

```
http://localhost:8082/swagger-ui.html
```



