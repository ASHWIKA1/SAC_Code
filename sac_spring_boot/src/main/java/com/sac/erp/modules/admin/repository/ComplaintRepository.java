package com.sac.erp.modules.admin.repository;

import com.sac.erp.modules.admin.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByActiveStatus(Integer activeStatus);
}
