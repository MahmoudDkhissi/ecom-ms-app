package com.mdk.inventoryservice.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@NoArgsConstructor @AllArgsConstructor
@Data @Builder
@Table(name = "product")
public class Product {
    @Id @GeneratedValue
    private Long id;

    private String name;
    private String description;
    private BigDecimal price;
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

}
