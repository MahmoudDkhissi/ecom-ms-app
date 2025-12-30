package com.mdk.billingservice.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mdk.billingservice.models.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "productItem")
@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductItem {

    @Id
    @GeneratedValue
    private Long id;

    private long productId;
    private Long quantity;

    @ManyToOne
    @JsonBackReference
    private Bill bill;

    @Transient
    private Product product;



}
