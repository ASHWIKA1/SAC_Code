package com.sac.erp.modules.exam.repository;

import com.sac.erp.modules.exam.entity.QuestionBankMuOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionBankMuOptionRepository extends JpaRepository<QuestionBankMuOption, Long> {
    List<QuestionBankMuOption> findByActiveStatus(Integer activeStatus);
}
