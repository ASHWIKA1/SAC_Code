package com.sac.erp.config.datasource;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class RoutingDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        String key = ModuleDatabaseContext.getDatabaseKey();
        return key != null ? key : "core";
    }
}
