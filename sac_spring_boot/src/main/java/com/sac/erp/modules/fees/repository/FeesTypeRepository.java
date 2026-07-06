package com.sac.erp.modules.fees.repository;

import com.sac.erp.modules.fees.entity.FeesType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeesTypeRepository extends JpaRepository<FeesType, Long> {
    List<FeesType> findByActiveStatus(Integer activeStatus);
    List<FeesType> findByFeesGroupIdAndActiveStatus(Long feesGroupId, Integer activeStatus);
}
