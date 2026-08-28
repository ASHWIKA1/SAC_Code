package com.sac.erp.config.datasource;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DataSourceConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.core")
    public DataSourceProperties coreProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource coreDataSource() {
        return coreProperties().initializeDataSourceBuilder().build();
    }

    @Bean
    @ConfigurationProperties("spring.datasource.canteen")
    public DataSourceProperties canteenProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource canteenDataSource() {
        return canteenProperties().initializeDataSourceBuilder().build();
    }

    @Bean
    @ConfigurationProperties("spring.datasource.academic")
    public DataSourceProperties academicProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource academicDataSource() {
        return academicProperties().initializeDataSourceBuilder().build();
    }

    @Bean
    @ConfigurationProperties("spring.datasource.student")
    public DataSourceProperties studentProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource studentDataSource() {
        return studentProperties().initializeDataSourceBuilder().build();
    }

    @Bean
    @ConfigurationProperties("spring.datasource.fees")
    public DataSourceProperties feesProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource feesDataSource() {
        return feesProperties().initializeDataSourceBuilder().build();
    }

    @Bean
    @ConfigurationProperties("spring.datasource.hr")
    public DataSourceProperties hrProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource hrDataSource() {
        return hrProperties().initializeDataSourceBuilder().build();
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        RoutingDataSource routing = new RoutingDataSource();
        
        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put("core", coreDataSource());
        targetDataSources.put("canteen", canteenDataSource());
        targetDataSources.put("academic", academicDataSource());
        targetDataSources.put("student", studentDataSource());
        targetDataSources.put("fees", feesDataSource());
        targetDataSources.put("hr", hrDataSource());
        
        routing.setTargetDataSources(targetDataSources);
        routing.setDefaultTargetDataSource(coreDataSource());
        
        return routing;
    }
}
