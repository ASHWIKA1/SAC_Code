package com.sac.erp.modules.admin.repository;

import com.sac.erp.modules.admin.entity.PostalLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostalLogRepository extends JpaRepository<PostalLog, Long> {
    List<PostalLog> findByActiveStatus(Integer activeStatus);
}
