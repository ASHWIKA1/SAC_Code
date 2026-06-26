package com.sac.erp.modules.admin.repository;

import com.sac.erp.modules.admin.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    List<Visitor> findByActiveStatus(Integer activeStatus);
}
