package com.sac.erp.modules.admin.repository;

import com.sac.erp.modules.admin.entity.BaseGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BaseGroupRepository extends JpaRepository<BaseGroup, Long> {
    List<BaseGroup> findByActiveStatus(Integer activeStatus);
}
