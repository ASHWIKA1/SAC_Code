package com.sac.erp.modules.library.repository;

import com.sac.erp.modules.library.entity.GeneralBookIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GeneralBookIssueRepository extends JpaRepository<GeneralBookIssue, Long> {
    List<GeneralBookIssue> findByActiveStatus(Integer activeStatus);
}
