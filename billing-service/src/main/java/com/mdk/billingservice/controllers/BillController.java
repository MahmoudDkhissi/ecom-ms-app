package com.mdk.billingservice.controllers;

import com.mdk.billingservice.entities.Bill;
import com.mdk.billingservice.entities.ProductItem;
import com.mdk.billingservice.models.Customer;
import com.mdk.billingservice.repositories.BillRepository;
import com.mdk.billingservice.restClients.CustomerRestClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BillController {

    BillRepository billRepository;
    CustomerRestClient customerRestClient;
    ProductItemController productItemController;

    public BillController(BillRepository billRepository, CustomerRestClient customerRestClient,  ProductItemController productItemController) {
        this.billRepository = billRepository;
        this.customerRestClient = customerRestClient;
        this.productItemController = productItemController;
    }

    @GetMapping("/bills/{id}")
    public Bill getBill(@PathVariable Long id) {
        Bill bill = billRepository.findById(id).get();
        Customer customer = customerRestClient.findById(bill.getCustomerId());
        bill.setCustomer(customer);
        List<ProductItem> productItems = bill.getProductItems();
        List<ProductItem> newProductItems = new ArrayList<>();
        productItems.forEach(productItem -> {
            newProductItems.add(productItemController.getProductItem(productItem.getId()));
        });
        bill.setProductItems(newProductItems);
        return bill;
    }
}
