package com.sac.erp.modules.academic.service;

import com.sac.erp.modules.academic.entity.StudentPromotion;
import java.util.List;

public interface StudentPromotionService {
    List<StudentPromotion> getAll();
    StudentPromotion getById(Long id);
    StudentPromotion create(StudentPromotion entity);
    StudentPromotion update(Long id, StudentPromotion entity);
    void delete(Long id);
}
