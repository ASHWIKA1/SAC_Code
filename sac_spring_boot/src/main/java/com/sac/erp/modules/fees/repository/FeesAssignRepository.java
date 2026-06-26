package com.sac.erp.modules.fees.repository;

import com.sac.erp.modules.fees.entity.FeesAssign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeesAssignRepository extends JpaRepository<FeesAssign, Long> {
    List<FeesAssign> findByActiveStatus(Integer activeStatus);
}
