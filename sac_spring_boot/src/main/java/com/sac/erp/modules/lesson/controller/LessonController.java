package com.sac.erp.modules.lesson.controller;

import com.sac.erp.modules.lesson.entity.*;
import com.sac.erp.modules.lesson.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lessons")
@RequiredArgsConstructor
@Tag(name = "Lesson", description = "Lesson Plan & Planner Management APIs")
public class LessonController {

    private final LessonService lessonService;

    @GetMapping
    @Operation(summary = "Get lessons by class, section, subject, academic year")
    public ResponseEntity<List<SmLesson>> getLessons(
            @RequestParam Long classId, @RequestParam Long sectionId,
            @RequestParam Long subjectId, @RequestParam Long academicId) {
        return ResponseEntity.ok(lessonService.getLessons(classId, sectionId, subjectId, academicId));
    }

    @PostMapping
    @Operation(summary = "Create a lesson")
    public ResponseEntity<SmLesson> createLesson(@RequestBody SmLesson lesson) {
        return ResponseEntity.ok(lessonService.createLesson(lesson));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a lesson")
    public ResponseEntity<SmLesson> updateLesson(@PathVariable Long id, @RequestBody SmLesson lesson) {
        return ResponseEntity.ok(lessonService.updateLesson(id, lesson));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a lesson")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{lessonId}/details")
    @Operation(summary = "Get lesson details by lesson ID")
    public ResponseEntity<List<SmLessonDetail>> getLessonDetails(@PathVariable Long lessonId) {
        return ResponseEntity.ok(lessonService.getLessonDetails(lessonId));
    }

    @PostMapping("/details")
    @Operation(summary = "Create lesson detail")
    public ResponseEntity<SmLessonDetail> createLessonDetail(@RequestBody SmLessonDetail detail) {
        return ResponseEntity.ok(lessonService.createLessonDetail(detail));
    }

    @GetMapping("/{lessonId}/topics")
    @Operation(summary = "Get lesson topics by lesson ID")
    public ResponseEntity<List<SmLessonTopic>> getTopics(@PathVariable Long lessonId) {
        return ResponseEntity.ok(lessonService.getTopicsByLesson(lessonId));
    }

    @PostMapping("/topics")
    @Operation(summary = "Create a lesson topic")
    public ResponseEntity<SmLessonTopic> createTopic(@RequestBody SmLessonTopic topic) {
        return ResponseEntity.ok(lessonService.createTopic(topic));
    }

    @GetMapping("/topics/{topicId}/details")
    @Operation(summary = "Get topic details by topic ID")
    public ResponseEntity<List<SmLessonTopicDetail>> getTopicDetails(@PathVariable Long topicId) {
        return ResponseEntity.ok(lessonService.getTopicDetails(topicId));
    }

    @PostMapping("/topics/details")
    @Operation(summary = "Create topic detail")
    public ResponseEntity<SmLessonTopicDetail> createTopicDetail(@RequestBody SmLessonTopicDetail detail) {
        return ResponseEntity.ok(lessonService.createTopicDetail(detail));
    }

    @GetMapping("/planners")
    @Operation(summary = "Get lesson planners")
    public ResponseEntity<List<LessonPlanner>> getPlanners(
            @RequestParam Long teacherId, @RequestParam Long classId,
            @RequestParam Long sectionId, @RequestParam Long subjectId,
            @RequestParam Long academicId) {
        return ResponseEntity.ok(lessonService.getLessonPlanners(teacherId, classId, sectionId, subjectId, academicId));
    }

    @PostMapping("/planners")
    @Operation(summary = "Create a lesson planner entry")
    public ResponseEntity<LessonPlanner> createPlanner(@RequestBody LessonPlanner planner) {
        return ResponseEntity.ok(lessonService.createLessonPlanner(planner));
    }

    @PutMapping("/planners/{id}")
    @Operation(summary = "Update a lesson planner entry")
    public ResponseEntity<LessonPlanner> updatePlanner(@PathVariable Long id, @RequestBody LessonPlanner planner) {
        return ResponseEntity.ok(lessonService.updateLessonPlanner(id, planner));
    }

    @DeleteMapping("/planners/{id}")
    @Operation(summary = "Delete a lesson planner entry")
    public ResponseEntity<Void> deletePlanner(@PathVariable Long id) {
        lessonService.deleteLessonPlanner(id);
        return ResponseEntity.noContent().build();
    }
}
