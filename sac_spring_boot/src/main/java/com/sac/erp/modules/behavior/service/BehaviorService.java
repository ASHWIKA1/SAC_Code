package com.sac.erp.modules.behavior.service;

import com.sac.erp.modules.behavior.entity.BehaviorSetting;
import com.sac.erp.modules.behavior.entity.StudentBehavior;
import java.util.List;

public interface BehaviorService {
    List<StudentBehavior> getBehaviorsByStudentId(Long studentId);
    StudentBehavior addBehaviorRecord(StudentBehavior behavior);
    BehaviorSetting getBehaviorSetting();
    BehaviorSetting saveBehaviorSetting(BehaviorSetting setting);
}
