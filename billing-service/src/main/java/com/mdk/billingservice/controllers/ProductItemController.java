package com.mdk.billingservice.controllers;

import com.mdk.billingservice.entities.ProductItem;
import com.mdk.billingservice.models.Product;
import com.mdk.billingservice.repositories.ProductItemRepository;
import com.mdk.billingservice.restClients.ProductRestClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class ProductItemController {

    private final ProductRestClient productRestClient;
    private final ProductItemRepository productItemRepository;

    public  ProductItemController(ProductRestClient productRestClient, ProductItemRepository productItemRepository) {
        this.productRestClient = productRestClient;
        this.productItemRepository = productItemRepository;
    }

    @GetMapping("/productsItems/{id}")
    public ProductItem getProductItem(@PathVariable Long id) {
        ProductItem productItem = productItemRepository.findById(id).get();
        Product  product = productRestClient.findById(productItem.getProductId());
        productItem.setProduct(product);
        return productItem;
    }
}
