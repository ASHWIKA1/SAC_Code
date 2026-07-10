package com.sac.erp.modules.lms.controller;

import com.sac.erp.modules.lms.entity.*;
import com.sac.erp.modules.lms.service.LmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/lms")
@RequiredArgsConstructor
public class LmsController {

    private final LmsService lmsService;

    @GetMapping("/media/types")
    public ResponseEntity<List<MediaType>> getMediaTypes() {
        log.info("REST request to get all LMS Media Types");
        return ResponseEntity.ok(lmsService.getAllMediaTypes());
    }

    @PostMapping("/media/types")
    public ResponseEntity<MediaType> createMediaType(@RequestBody MediaType mediaType) {
        log.info("REST request to create LMS Media Type: {}", mediaType.getName());
        return ResponseEntity.ok(lmsService.createMediaType(mediaType));
    }

    @GetMapping("/media")
    public ResponseEntity<List<MediaContent>> getMediaContents() {
        log.info("REST request to get all LMS Media Content items");
        return ResponseEntity.ok(lmsService.getAllMediaContents());
    }

    @PostMapping("/media")
    public ResponseEntity<MediaContent> createMediaContent(@RequestBody MediaContent mediaContent) {
        log.info("REST request to create LMS Media Content: {}", mediaContent.getTitle());
        return ResponseEntity.ok(lmsService.createMediaContent(mediaContent));
    }

    @PostMapping("/media/access")
    public ResponseEntity<StudentMediaContent> trackMediaAccess(
            @RequestParam Long studentId,
            @RequestParam Long mediaContentId) {
        log.info("REST request to track student {} accessing media content {}", studentId, mediaContentId);
        return ResponseEntity.ok(lmsService.trackMediaAccess(studentId, mediaContentId));
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<AssignmentDetails>> getAssignments() {
        log.info("REST request to get all LMS Assignments");
        return ResponseEntity.ok(lmsService.getAllAssignments());
    }

    @GetMapping("/assignments/course/{courseId}")
    public ResponseEntity<List<AssignmentDetails>> getAssignmentsByCourse(@PathVariable Long courseId) {
        log.info("REST request to get LMS Assignments for course {}", courseId);
        return ResponseEntity.ok(lmsService.getAssignmentsByCourse(courseId));
    }

    @PostMapping("/assignments")
    public ResponseEntity<AssignmentDetails> createAssignment(@RequestBody AssignmentDetails assignment) {
        log.info("REST request to create LMS Assignment: {}", assignment.getTitle());
        return ResponseEntity.ok(lmsService.createAssignment(assignment));
    }

    @PostMapping("/assignments/submit")
    public ResponseEntity<StudentAssignment> submitAssignment(
            @RequestParam Long assignmentId,
            @RequestParam Long studentId) {
        log.info("REST request to submit LMS Assignment {} for student {}", assignmentId, studentId);
        return ResponseEntity.ok(lmsService.submitAssignment(assignmentId, studentId));
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<List<StudentAssignment>> getSubmissions(@PathVariable Long assignmentId) {
        log.info("REST request to get submissions list for LMS assignment {}", assignmentId);
        return ResponseEntity.ok(lmsService.getSubmissionsByAssignment(assignmentId));
    }

    @PostMapping("/submissions/review")
    public ResponseEntity<StudentAssignmentReview> reviewSubmission(
            @RequestParam Long studentAssignmentId,
            @RequestParam String remarks,
            @RequestParam Long facultyId) {
        log.info("REST request faculty {} reviews submission {}", facultyId, studentAssignmentId);
        return ResponseEntity.ok(lmsService.reviewSubmission(studentAssignmentId, remarks, facultyId));
    }

    @PostMapping("/assignments/evaluate")
    public ResponseEntity<AssignmentEvaluation> evaluateAssignment(
            @RequestParam Long studentAssignmentId,
            @RequestParam Integer score,
            @RequestParam String remarks,
            @RequestParam Integer needsResubmission) {
        log.info("REST request to evaluate submission {} with score {} and remarks '{}', needsResubmission={}", 
                studentAssignmentId, score, remarks, needsResubmission);
        return ResponseEntity.ok(lmsService.evaluateAssignment(studentAssignmentId, score, remarks, needsResubmission));
    }

    @PostMapping("/ai/generate")
    public ResponseEntity<AiQuestionHistory> saveAiGenerationRequest(
            @RequestParam String subject,
            @RequestParam String topic,
            @RequestParam String difficulty,
            @RequestParam String bloomLevel,
            @RequestParam String questionType,
            @RequestBody List<GeneratedQuestion> questions) {
        log.info("REST request to save AI generation history log for topic: {}", topic);
        return ResponseEntity.ok(lmsService.saveAiGenerationRequest(subject, topic, difficulty, bloomLevel, questionType, questions));
    }

    @GetMapping("/ai/history")
    public ResponseEntity<List<AiQuestionHistory>> getAiGenerationHistory() {
        log.info("REST request to get all AI generation history request records");
        return ResponseEntity.ok(lmsService.getAiGenerationHistory());
    }
}
