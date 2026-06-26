package com.sac.erp.modules.zoom.controller;

import com.sac.erp.modules.zoom.entity.ZoomMeeting;
import com.sac.erp.modules.zoom.entity.ZoomSetting;
import com.sac.erp.modules.zoom.entity.ZoomVirtualClass;
import com.sac.erp.modules.zoom.service.ZoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/zoom")
@RequiredArgsConstructor
@Tag(name = "Zoom", description = "Zoom Meeting & Virtual Class Management APIs")
public class ZoomController {

    private final ZoomService zoomService;

    // ── Meetings ──────────────────────────────────────────────────────────
    @GetMapping("/meetings")
    @Operation(summary = "Get all Zoom meetings")
    public ResponseEntity<List<ZoomMeeting>> getAllMeetings() {
        return ResponseEntity.ok(zoomService.getAllMeetings());
    }

    @GetMapping("/meetings/{id}")
    @Operation(summary = "Get meeting by ID")
    public ResponseEntity<ZoomMeeting> getMeeting(@PathVariable Long id) {
        return ResponseEntity.ok(zoomService.getMeetingById(id));
    }

    @PostMapping("/meetings")
    @Operation(summary = "Create a new Zoom meeting")
    public ResponseEntity<ZoomMeeting> createMeeting(@RequestBody ZoomMeeting meeting) {
        return ResponseEntity.ok(zoomService.createMeeting(meeting));
    }

    @PutMapping("/meetings/{id}")
    @Operation(summary = "Update an existing Zoom meeting")
    public ResponseEntity<ZoomMeeting> updateMeeting(@PathVariable Long id, @RequestBody ZoomMeeting meeting) {
        return ResponseEntity.ok(zoomService.updateMeeting(id, meeting));
    }

    @DeleteMapping("/meetings/{id}")
    @Operation(summary = "Delete a Zoom meeting")
    public ResponseEntity<Void> deleteMeeting(@PathVariable Long id) {
        zoomService.deleteMeeting(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/meetings/class/{classId}/section/{sectionId}")
    @Operation(summary = "Get meetings by class and section")
    public ResponseEntity<List<ZoomMeeting>> getMeetingsByClassSection(
            @PathVariable Long classId, @PathVariable Long sectionId) {
        return ResponseEntity.ok(zoomService.getMeetingsByClassSection(classId, sectionId));
    }

    // ── Virtual Classes ───────────────────────────────────────────────────
    @GetMapping("/virtual-classes")
    @Operation(summary = "Get all virtual classes")
    public ResponseEntity<List<ZoomVirtualClass>> getAllVirtualClasses() {
        return ResponseEntity.ok(zoomService.getAllVirtualClasses());
    }

    @GetMapping("/virtual-classes/{id}")
    @Operation(summary = "Get virtual class by ID")
    public ResponseEntity<ZoomVirtualClass> getVirtualClass(@PathVariable Long id) {
        return ResponseEntity.ok(zoomService.getVirtualClassById(id));
    }

    @PostMapping("/virtual-classes")
    @Operation(summary = "Create a new virtual class")
    public ResponseEntity<ZoomVirtualClass> createVirtualClass(@RequestBody ZoomVirtualClass vc) {
        return ResponseEntity.ok(zoomService.createVirtualClass(vc));
    }

    @PutMapping("/virtual-classes/{id}")
    @Operation(summary = "Update a virtual class")
    public ResponseEntity<ZoomVirtualClass> updateVirtualClass(@PathVariable Long id, @RequestBody ZoomVirtualClass vc) {
        return ResponseEntity.ok(zoomService.updateVirtualClass(id, vc));
    }

    @DeleteMapping("/virtual-classes/{id}")
    @Operation(summary = "Delete a virtual class")
    public ResponseEntity<Void> deleteVirtualClass(@PathVariable Long id) {
        zoomService.deleteVirtualClass(id);
        return ResponseEntity.noContent().build();
    }

    // ── Settings ──────────────────────────────────────────────────────────
    @GetMapping("/settings")
    @Operation(summary = "Get Zoom API settings")
    public ResponseEntity<ZoomSetting> getSettings() {
        return ResponseEntity.ok(zoomService.getSettings());
    }

    @PostMapping("/settings")
    @Operation(summary = "Save Zoom API settings")
    public ResponseEntity<ZoomSetting> saveSettings(@RequestBody ZoomSetting setting) {
        return ResponseEntity.ok(zoomService.saveSettings(setting));
    }
}
