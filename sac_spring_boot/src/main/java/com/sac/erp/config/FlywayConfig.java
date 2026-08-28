package com.sac.erp.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.List;

/**
 * Programmatic Flyway runner that migrates all active module databases on startup,
 * solving the multi-datasource routing schema and seeding requirement.
 */
@Configuration
public class FlywayConfig {

    @Bean
    @org.springframework.core.annotation.Order(1)
    public CommandLineRunner migrateAllDataSources(
            @org.springframework.beans.factory.annotation.Qualifier("coreDataSource") DataSource coreDataSource,
            @org.springframework.beans.factory.annotation.Qualifier("canteenDataSource") DataSource canteenDataSource,
            @org.springframework.beans.factory.annotation.Qualifier("academicDataSource") DataSource academicDataSource,
            @org.springframework.beans.factory.annotation.Qualifier("studentDataSource") DataSource studentDataSource,
            @org.springframework.beans.factory.annotation.Qualifier("feesDataSource") DataSource feesDataSource,
            @org.springframework.beans.factory.annotation.Qualifier("hrDataSource") DataSource hrDataSource) {
        return args -> {
            List<DataSource> dataSources = List.of(
                    coreDataSource,
                    canteenDataSource,
                    academicDataSource,
                    studentDataSource,
                    feesDataSource,
                    hrDataSource
            );

            for (DataSource ds : dataSources) {
                try {
                    if (ds instanceof com.zaxxer.hikari.HikariDataSource) {
                        System.out.println("DEBUG: Migrating Datasource with URL: " + ((com.zaxxer.hikari.HikariDataSource) ds).getJdbcUrl());
                    } else {
                        System.out.println("DEBUG: Migrating Datasource: " + ds.getClass().getName());
                    }
                    
                    // Drop existing history table to force fresh baseline at version 23
                    try (java.sql.Connection conn = ds.getConnection();
                         java.sql.Statement stmt = conn.createStatement()) {
                        stmt.execute("DROP TABLE IF EXISTS flyway_schema_history");
                    } catch (Exception dropEx) {
                        System.err.println("Could not drop flyway history table: " + dropEx.getMessage());
                    }

                    Flyway flyway = Flyway.configure()
                            .dataSource(ds)
                            .baselineOnMigrate(true)
                            .baselineVersion("23")
                            .locations("classpath:db/migration")
                            .load();
                    flyway.repair();
                    flyway.migrate();
                } catch (Exception e) {
                    System.err.println("Failed to run Flyway migration on datasource: " + e.getMessage());
                }
            }
        };
    }
}
