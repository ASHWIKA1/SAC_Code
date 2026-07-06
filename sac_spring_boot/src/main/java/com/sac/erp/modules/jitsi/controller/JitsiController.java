package com.sac.erp.modules.jitsi.controller;

import com.sac.erp.modules.jitsi.entity.*;
import com.sac.erp.modules.jitsi.service.JitsiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/jitsi")
@RequiredArgsConstructor
public class JitsiController {

    private final JitsiService jitsiService;

    @GetMapping("/settings")
    public ResponseEntity<JitsiSetting> getSettings() {
        return ResponseEntity.ok(jitsiService.getJitsiSetting());
    }

    @PostMapping("/settings")
    public ResponseEntity<JitsiSetting> saveSettings(@RequestBody JitsiSetting settings) {
        return ResponseEntity.ok(jitsiService.saveJitsiSetting(settings));
    }

    @GetMapping("/meetings")
    public ResponseEntity<List<JitsiMeeting>> getMeetings() {
        return ResponseEntity.ok(jitsiService.getAllMeetings());
    }

    @PostMapping("/meetings")
    public ResponseEntity<JitsiMeeting> createMeeting(@RequestBody JitsiMeeting meeting) {
        return ResponseEntity.ok(jitsiService.scheduleMeeting(meeting));
    }

    @GetMapping("/classes")
    public ResponseEntity<List<JitsiVirtualClass>> getClasses(
            @RequestParam Integer classId,
            @RequestParam String sectionId) {
        return ResponseEntity.ok(jitsiService.getVirtualClasses(classId, sectionId));
    }

    @PostMapping("/classes")
    public ResponseEntity<JitsiVirtualClass> createClass(@RequestBody JitsiVirtualClass virtualClass) {
        return ResponseEntity.ok(jitsiService.scheduleVirtualClass(virtualClass));
    }
}
