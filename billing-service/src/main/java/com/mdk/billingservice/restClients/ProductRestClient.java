package com.mdk.billingservice.restClients;


import com.mdk.billingservice.models.Product;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "inventory-service")
public interface ProductRestClient {

    @GetMapping("/products/{id}")
    @CircuitBreaker(name = "product-cb", fallbackMethod = "getDefaultProduct")
    Product findById(@PathVariable Long id);

    default Product getDefaultProduct(Long id, Exception ignoredE) {
        Product product = new Product();
        product.setId(id);
        product.setName("default product");
        return product;
    }

}
