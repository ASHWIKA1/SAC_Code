package com.sac.erp.modules.exam.service;

import com.sac.erp.modules.exam.entity.QuestionGroup;
import java.util.List;

public interface QuestionGroupService {
    List<QuestionGroup> getAll();
    QuestionGroup getById(Long id);
    QuestionGroup create(QuestionGroup entity);
    QuestionGroup update(Long id, QuestionGroup entity);
    void delete(Long id);
}
