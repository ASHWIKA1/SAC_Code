package com.sac.erp.modules.exam.service;

import com.sac.erp.modules.exam.entity.QuestionBankMuOption;
import java.util.List;

public interface QuestionBankMuOptionService {
    List<QuestionBankMuOption> getAll();
    QuestionBankMuOption getById(Long id);
    QuestionBankMuOption create(QuestionBankMuOption entity);
    QuestionBankMuOption update(Long id, QuestionBankMuOption entity);
    void delete(Long id);
}
