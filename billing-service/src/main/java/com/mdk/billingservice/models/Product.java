package com.mdk.billingservice.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Product {

    private Long id;

    private String name;
    private String description;
    private BigDecimal price;

    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;
}
