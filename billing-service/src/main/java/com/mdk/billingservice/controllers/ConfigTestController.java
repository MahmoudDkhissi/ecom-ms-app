package com.mdk.billingservice.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope
@RequestMapping("/config")
public class ConfigTestController {

    @Value("${custom.message}")
    private String message;

    @GetMapping
    public String message(){
        return message;
    }
}
