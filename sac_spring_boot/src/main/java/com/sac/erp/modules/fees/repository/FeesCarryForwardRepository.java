package com.sac.erp.modules.fees.repository;

import com.sac.erp.modules.fees.entity.FeesCarryForward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeesCarryForwardRepository extends JpaRepository<FeesCarryForward, Long> {
    List<FeesCarryForward> findByActiveStatus(Integer activeStatus);
}
