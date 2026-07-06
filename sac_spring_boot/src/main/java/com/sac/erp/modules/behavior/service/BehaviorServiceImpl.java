package com.sac.erp.modules.behavior.service;

import com.sac.erp.modules.behavior.entity.BehaviorSetting;
import com.sac.erp.modules.behavior.entity.StudentBehavior;
import com.sac.erp.modules.behavior.repository.BehaviorSettingRepository;
import com.sac.erp.modules.behavior.repository.StudentBehaviorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BehaviorServiceImpl implements BehaviorService {

    private final BehaviorSettingRepository settingRepository;
    private final StudentBehaviorRepository behaviorRepository;

    @Override
    public List<StudentBehavior> getBehaviorsByStudentId(Long studentId) {
        return behaviorRepository.findByStudentId(studentId);
    }

    @Override
    public StudentBehavior addBehaviorRecord(StudentBehavior behavior) {
        return behaviorRepository.save(behavior);
    }

    @Override
    public BehaviorSetting getBehaviorSetting() {
        return settingRepository.findAll().stream().findFirst().orElseGet(() -> {
            BehaviorSetting bs = new BehaviorSetting();
            return settingRepository.save(bs);
        });
    }

    @Override
    public BehaviorSetting saveBehaviorSetting(BehaviorSetting setting) {
        return settingRepository.save(setting);
    }
}
