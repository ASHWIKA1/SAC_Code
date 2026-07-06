package com.sac.erp.modules.fees.repository;

import com.sac.erp.modules.fees.entity.FeesDiscount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeesDiscountRepository extends JpaRepository<FeesDiscount, Long> {
    List<FeesDiscount> findByActiveStatus(Integer activeStatus);
}
