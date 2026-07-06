package com.sac.erp.modules.exam.repository;

import com.sac.erp.modules.exam.entity.QuestionBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionBankRepository extends JpaRepository<QuestionBank, Long> {
    List<QuestionBank> findByActiveStatus(Integer activeStatus);
}
