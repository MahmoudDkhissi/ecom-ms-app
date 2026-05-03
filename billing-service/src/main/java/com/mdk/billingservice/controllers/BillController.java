package com.mdk.billingservice.controllers;

import com.mdk.billingservice.entities.Bill;
import com.mdk.billingservice.entities.ProductItem;
import com.mdk.billingservice.models.Customer;
import com.mdk.billingservice.repositories.BillRepository;
import com.mdk.billingservice.repositories.ProductItemRepository;
import com.mdk.billingservice.restClients.CustomerRestClient;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BillController {

    BillRepository billRepository;
    CustomerRestClient customerRestClient;
    ProductItemController productItemController;
    ProductItemRepository productItemRepository;

    public BillController(BillRepository billRepository, CustomerRestClient customerRestClient,  ProductItemController productItemController, ProductItemRepository productItemRepository) {
        this.billRepository = billRepository;
        this.customerRestClient = customerRestClient;
        this.productItemController = productItemController;
        this.productItemRepository = productItemRepository;
    }

    @GetMapping("/bills")
    public List<Bill> getAllBills() {
        List<Bill> bills = billRepository.findAll();
        bills.forEach(bill -> {
            Customer customer = customerRestClient.findById(bill.getCustomerId());
            bill.setCustomer(customer);
        });
        return bills;
    }

    @GetMapping("/bills/customer/{customerId}")
    public List<Bill> getBillsByCustomer(@PathVariable long customerId) {
        List<Bill> bills = billRepository.findByCustomerId(customerId);
        bills.forEach(bill -> {
            Customer customer = customerRestClient.findById(bill.getCustomerId());
            bill.setCustomer(customer);
        });
        return bills;
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

    @GetMapping("/bills/my-bills")
    public List<Bill> getMyBills(@RequestHeader("X-User-Email") String email) {
        Customer customer = customerRestClient.findByEmail(email);
        if (customer == null) return List.of();
        return billRepository.findByCustomerId(customer.getId());
    }

    @PostMapping("/bills")
    public Bill createBill(@RequestBody Bill billRequest) {
        Customer customer = customerRestClient.findByEmail(billRequest.getEmail());
        if (customer == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found");
        }
        Bill bill = new Bill();
        bill.setCustomerId(customer.getId());
        bill.setName(billRequest.getName());
        bill.setDescription(billRequest.getDescription());
        Bill savedBill = billRepository.save(bill);

        billRequest.getProductItems().forEach(itemRequest -> {
            ProductItem productItem = new ProductItem();
            productItem.setProductId(itemRequest.getProductId());
            productItem.setQuantity(itemRequest.getQuantity());
            productItem.setBill(savedBill);
            productItemRepository.save(productItem);
        });

        return savedBill;
    }

    @DeleteMapping("/bills/{id}")
    public void deleteBill(@PathVariable Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bill not found"));
        productItemRepository.deleteAll(bill.getProductItems());
        billRepository.delete(bill);
    }
}
