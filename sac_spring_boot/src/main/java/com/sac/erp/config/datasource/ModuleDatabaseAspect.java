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
        String packageName = resolvePackageName(joinPoint);
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

    private String resolvePackageName(ProceedingJoinPoint joinPoint) {
        // 1. Try interfaces (for dynamic JDK proxy objects representing Spring repositories)
        if (joinPoint.getTarget() != null) {
            for (Class<?> iface : joinPoint.getTarget().getClass().getInterfaces()) {
                if (iface.getPackageName().startsWith("com.sac.erp.modules.")) {
                    return iface.getPackageName();
                }
            }
            // 2. Try target class package
            String pkg = joinPoint.getTarget().getClass().getPackageName();
            if (pkg.startsWith("com.sac.erp.modules.")) {
                return pkg;
            }
        }
        // 3. Fall back to method signature declaring type package
        return joinPoint.getSignature().getDeclaringType().getPackageName();
    }

    private boolean isValidModuleKey(String module) {
        return "canteen".equals(module) || 
               "academic".equals(module) || 
               "student".equals(module) || 
               "fees".equals(module) || 
               "hr".equals(module);
    }
}
