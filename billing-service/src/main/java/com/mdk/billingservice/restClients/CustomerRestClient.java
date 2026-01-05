package com.mdk.billingservice.restClients;


import com.mdk.billingservice.models.Customer;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service")
public interface CustomerRestClient {
    @GetMapping("/customers/{id}")
    @CircuitBreaker(name = "customer-cb", fallbackMethod = "getDefaultCustomer")
    Customer findById(@PathVariable Long id);

    /**
     * Provides a default customer instance to be used as a fallback when the primary customer retrieval fails.
     *
     * @param id The ID of the customer to be used for the default customer instance.
     * @param ignoredE The exception that triggered the fallback mechanism.
     * @return A default Customer instance with predefined values.
     */
    default Customer getDefaultCustomer(Long id, Exception ignoredE) {
        Customer customer = new Customer();
        customer.setId(id);
        customer.setName("default");
        customer.setEmail("default@gmail.com");
        return customer;
    }
}
