package com.mdk.billingservice.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mdk.billingservice.models.Customer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@NoArgsConstructor @AllArgsConstructor
@Data @Builder
@Table(name = "bill")
public class Bill {
    @Id
    @GeneratedValue
    private Long id;

    private long customerId;

    private String name;

    private String description;

    @OneToMany(mappedBy = "bill")
    @JsonManagedReference
    private List<ProductItem> productItems;

    @Transient
    private Customer customer;

}
