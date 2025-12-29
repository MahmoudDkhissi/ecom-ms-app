package com.mdk.customerservice;

import com.mdk.customerservice.entities.Customer;
import com.mdk.customerservice.repositories.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class CustomerServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CustomerServiceApplication.class, args);
    }


    @Bean
    CommandLineRunner commandLineRunner(CustomerRepository customerRepository) {
        return args -> {
                Customer customer1 = Customer.builder().name("Mahmoud").email("mahmoud@gmail.com").build();
                Customer customer2 = Customer.builder().name("Rokaya").email("rokaya@gmail.com").build();
                Customer customer3 = Customer.builder().name("Aziz").email("aziz@gmail.com").build();
                customerRepository.save(customer1);
                customerRepository.save(customer2);
                customerRepository.save(customer3);

        };
    }

}
