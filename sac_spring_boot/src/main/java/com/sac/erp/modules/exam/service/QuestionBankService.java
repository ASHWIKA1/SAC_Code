package com.sac.erp.modules.exam.service;

import com.sac.erp.modules.exam.entity.QuestionBank;
import java.util.List;

public interface QuestionBankService {
    List<QuestionBank> getAll();
    QuestionBank getById(Long id);
    QuestionBank create(QuestionBank entity);
    QuestionBank update(Long id, QuestionBank entity);
    void delete(Long id);
}
