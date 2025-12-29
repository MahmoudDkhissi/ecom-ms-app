package com.mdk.inventoryservice;

import com.mdk.inventoryservice.entities.Product;
import com.mdk.inventoryservice.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.util.List;

@SpringBootApplication
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }


    @Bean
    CommandLineRunner commandLineRunner(ProductRepository productRepository) {
        return args -> {
            Product product1 = Product.builder().name("Laptop").price(BigDecimal.valueOf(10000)).build();
            Product product2 = Product.builder().name("Smartphone").price(BigDecimal.valueOf(6500)).build();
            Product product3 = Product.builder().name("Playstation").price(BigDecimal.valueOf(4000)).build();
            productRepository.saveAll(List.of(product1, product2, product3));
        };
    }

}
