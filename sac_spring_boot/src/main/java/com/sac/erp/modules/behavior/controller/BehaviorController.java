package com.sac.erp.modules.behavior.controller;

import com.sac.erp.modules.behavior.entity.BehaviorSetting;
import com.sac.erp.modules.behavior.entity.StudentBehavior;
import com.sac.erp.modules.behavior.service.BehaviorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/behavior")
@RequiredArgsConstructor
public class BehaviorController {

    private final BehaviorService behaviorService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentBehavior>> getStudentBehaviors(@PathVariable Long studentId) {
        return ResponseEntity.ok(behaviorService.getBehaviorsByStudentId(studentId));
    }

    @PostMapping("/student")
    public ResponseEntity<StudentBehavior> addStudentBehavior(@RequestBody StudentBehavior behavior) {
        return ResponseEntity.ok(behaviorService.addBehaviorRecord(behavior));
    }

    @GetMapping("/settings")
    public ResponseEntity<BehaviorSetting> getSettings() {
        return ResponseEntity.ok(behaviorService.getBehaviorSetting());
    }

    @PostMapping("/settings")
    public ResponseEntity<BehaviorSetting> saveSettings(@RequestBody BehaviorSetting settings) {
        return ResponseEntity.ok(behaviorService.saveBehaviorSetting(settings));
    }
}
