package com.sac.erp.modules.exam.repository;

import com.sac.erp.modules.exam.entity.QuestionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionGroupRepository extends JpaRepository<QuestionGroup, Long> {
    List<QuestionGroup> findByActiveStatus(Integer activeStatus);
}
