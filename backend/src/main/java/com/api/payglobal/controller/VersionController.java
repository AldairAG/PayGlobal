package com.api.payglobal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/version")
public class VersionController {
    
    @GetMapping
    public String getVersion() {
        return "1.0.0";
    }

}
