package com.sac.erp.config.datasource;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Order(1)
public class ModuleDatabaseAspect {

    @Around("execution(* com.sac.erp.modules..*Repository.*(..)) || execution(* com.sac.erp.modules..*ServiceImpl.*(..))")
    public Object routeDatabase(ProceedingJoinPoint joinPoint) throws Throwable {
        String packageName = joinPoint.getTarget().getClass().getPackageName();
        String key = "core"; 

        if (packageName.startsWith("com.sac.erp.modules.")) {
            String sub = packageName.substring("com.sac.erp.modules.".length());
            int dotIdx = sub.indexOf('.');
            if (dotIdx > 0) {
                String module = sub.substring(0, dotIdx);
                if (isValidModuleKey(module)) {
                    key = module;
                }
            }
        }

        String oldKey = ModuleDatabaseContext.getDatabaseKey();
        ModuleDatabaseContext.setDatabaseKey(key);
        try {
            return joinPoint.proceed();
        } finally {
            if (oldKey != null) {
                ModuleDatabaseContext.setDatabaseKey(oldKey);
            } else {
                ModuleDatabaseContext.clear();
            }
        }
    }

    private boolean isValidModuleKey(String module) {
        return "canteen".equals(module) || 
               "academic".equals(module) || 
               "student".equals(module) || 
               "fees".equals(module) || 
               "hr".equals(module);
    }
}
