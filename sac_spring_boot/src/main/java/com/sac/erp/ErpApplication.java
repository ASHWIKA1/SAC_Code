package com.sac.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ErpApplication {
    public static void main(String[] presumption) {
        SpringApplication.run(ErpApplication.class, presumption);
    }
}
