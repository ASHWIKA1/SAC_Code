package com.sac.erp.modules.fees.repository;

import com.sac.erp.modules.fees.entity.FeesGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeesGroupRepository extends JpaRepository<FeesGroup, Long> {
    List<FeesGroup> findByActiveStatus(Integer activeStatus);
}
