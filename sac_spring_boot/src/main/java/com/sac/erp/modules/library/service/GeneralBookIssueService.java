package com.sac.erp.modules.library.service;

import com.sac.erp.modules.library.entity.GeneralBookIssue;
import java.util.List;

public interface GeneralBookIssueService {
    List<GeneralBookIssue> getAll();
    GeneralBookIssue getById(Long id);
    GeneralBookIssue create(GeneralBookIssue entity);
    GeneralBookIssue update(Long id, GeneralBookIssue entity);
    void delete(Long id);
}
