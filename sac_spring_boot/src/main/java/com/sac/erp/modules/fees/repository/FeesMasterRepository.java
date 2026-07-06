package com.sac.erp.modules.fees.repository;

import com.sac.erp.modules.fees.entity.FeesMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeesMasterRepository extends JpaRepository<FeesMaster, Long> {
    List<FeesMaster> findByActiveStatus(Integer activeStatus);
    List<FeesMaster> findByFeesGroupIdAndActiveStatus(Long feesGroupId, Integer activeStatus);
}
