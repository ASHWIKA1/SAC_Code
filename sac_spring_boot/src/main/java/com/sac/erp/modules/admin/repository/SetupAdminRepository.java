package com.sac.erp.modules.admin.repository;

import com.sac.erp.modules.admin.entity.SetupAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SetupAdminRepository extends JpaRepository<SetupAdmin, Long> {
    List<SetupAdmin> findByActiveStatus(Integer activeStatus);
}
