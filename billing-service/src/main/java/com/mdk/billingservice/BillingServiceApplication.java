package com.mdk.billingservice;

import com.mdk.billingservice.entities.Bill;
import com.mdk.billingservice.entities.ProductItem;
import com.mdk.billingservice.repositories.BillRepository;
import com.mdk.billingservice.repositories.ProductItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
@EnableFeignClients
public class BillingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BillingServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner init(ProductItemRepository productItemRepository, BillRepository billRepository) {
        return args -> {
            List<Long> customerIds = List.of(1L, 2L, 3L);
            List<Long> productIds = List.of(1L, 2L, 3L);
            customerIds.forEach(id -> {
                Bill bill = Bill.builder().name("Bill" + id).customerId(id).build();
                billRepository.save(bill);
                productIds.forEach(pid -> {
                    ProductItem productItem = ProductItem.builder().productId(id).bill(bill).quantity((long) (Math.random()*1000)).build();
                    productItemRepository.save(productItem);
                });
            });
        };
    }

}
