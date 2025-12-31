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



