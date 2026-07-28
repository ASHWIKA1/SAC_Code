package com.sac.erp.config.datasource;

public class ModuleDatabaseContext {

    private static final ThreadLocal<String> CONTEXT = new ThreadLocal<>();

    public static void setDatabaseKey(String key) {
        CONTEXT.set(key);
    }

    public static String getDatabaseKey() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
