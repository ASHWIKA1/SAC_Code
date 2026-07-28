package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.LmsForum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LmsForumRepository extends JpaRepository<LmsForum, Long> {
}
