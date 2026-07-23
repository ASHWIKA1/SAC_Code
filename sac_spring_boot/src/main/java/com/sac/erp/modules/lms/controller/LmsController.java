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

    // --- Quiz Endpoints ---

    @GetMapping("/quizzes")
    public ResponseEntity<List<LmsQuiz>> getAllQuizzes() {
        log.info("REST request to get all LMS quizzes");
        return ResponseEntity.ok(lmsService.getAllQuizzes());
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<LmsQuiz> getQuizById(@PathVariable Long id) {
        log.info("REST request to get LMS quiz : {}", id);
        return ResponseEntity.ok(lmsService.getQuizById(id));
    }

    @PostMapping("/quizzes")
    public ResponseEntity<LmsQuiz> createQuiz(@RequestBody LmsQuiz quiz) {
        log.info("REST request to create LMS quiz : {}", quiz.getTitle());
        return ResponseEntity.ok(lmsService.createQuiz(quiz));
    }

    @PutMapping("/quizzes/{id}")
    public ResponseEntity<LmsQuiz> updateQuiz(@PathVariable Long id, @RequestBody LmsQuiz quiz) {
        log.info("REST request to update LMS quiz : {}", id);
        return ResponseEntity.ok(lmsService.updateQuiz(id, quiz));
    }

    @DeleteMapping("/quizzes/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        log.info("REST request to delete LMS quiz : {}", id);
        lmsService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<List<LmsQuizQuestion>> getQuestionsForQuiz(@PathVariable Long quizId) {
        log.info("REST request to get questions for quiz : {}", quizId);
        return ResponseEntity.ok(lmsService.getQuestionsForQuiz(quizId));
    }

    @PostMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<LmsQuizQuestion> addQuestionToQuiz(@PathVariable Long quizId, @RequestBody LmsQuizQuestion question) {
        log.info("REST request to add question to quiz : {}", quizId);
        return ResponseEntity.ok(lmsService.addQuestionToQuiz(quizId, question));
    }

    @PostMapping("/quizzes/attempts")
    public ResponseEntity<LmsQuizAttempt> submitQuizAttempt(@RequestBody LmsQuizAttempt attempt) {
        log.info("REST request student {} submits attempt for quiz", attempt.getStudentId());
        return ResponseEntity.ok(lmsService.submitQuizAttempt(attempt));
    }

    @GetMapping("/quizzes/{quizId}/attempts")
    public ResponseEntity<List<LmsQuizAttempt>> getAttemptsForQuiz(@PathVariable Long quizId) {
        log.info("REST request to get attempts list for quiz : {}", quizId);
        return ResponseEntity.ok(lmsService.getAttemptsForQuiz(quizId));
    }

    @GetMapping("/quizzes/attempts/student/{studentId}")
    public ResponseEntity<List<LmsQuizAttempt>> getAttemptsForStudent(@PathVariable Long studentId) {
        log.info("REST request to get quiz attempts for student : {}", studentId);
        return ResponseEntity.ok(lmsService.getAttemptsForStudent(studentId));
    }

    // --- Discussion Forum Endpoints ---

    @GetMapping("/forums")
    public ResponseEntity<List<LmsForum>> getAllForums() {
        log.info("REST request to get all discussion forums");
        return ResponseEntity.ok(lmsService.getAllForums());
    }

    @PostMapping("/forums")
    public ResponseEntity<LmsForum> createForum(@RequestBody LmsForum forum) {
        log.info("REST request to create discussion forum : {}", forum.getName());
        return ResponseEntity.ok(lmsService.createForum(forum));
    }

    @GetMapping("/forums/{forumId}/posts")
    public ResponseEntity<List<LmsForumPost>> getPostsForForum(@PathVariable Long forumId) {
        log.info("REST request to get posts/messages for forum : {}", forumId);
        return ResponseEntity.ok(lmsService.getPostsForForum(forumId));
    }

    @PostMapping("/forums/{forumId}/posts")
    public ResponseEntity<LmsForumPost> createForumPost(@PathVariable Long forumId, @RequestBody LmsForumPost post) {
        log.info("REST request to post message in forum : {}", forumId);
        // Ensure forum association is set appropriately
        if (post.getForum() == null) {
            LmsForum forum = new LmsForum();
            forum.setId(forumId);
            post.setForum(forum);
        } else {
            post.getForum().setId(forumId);
        }
        return ResponseEntity.ok(lmsService.createForumPost(post));
    }

    // --- Live Class Endpoints ---

    @GetMapping("/live-classes")
    public ResponseEntity<List<LmsLiveClass>> getAllLiveClasses() {
        log.info("REST request to get all live classes");
        return ResponseEntity.ok(lmsService.getAllLiveClasses());
    }

    @PostMapping("/live-classes")
    public ResponseEntity<LmsLiveClass> createLiveClass(@RequestBody LmsLiveClass liveClass) {
        log.info("REST request to create live class : {}", liveClass.getTitle());
        return ResponseEntity.ok(lmsService.createLiveClass(liveClass));
    }

    @PutMapping("/live-classes/{id}")
    public ResponseEntity<LmsLiveClass> updateLiveClass(@PathVariable Long id, @RequestBody LmsLiveClass liveClass) {
        log.info("REST request to update live class : {}", id);
        return ResponseEntity.ok(lmsService.updateLiveClass(id, liveClass));
    }

    @DeleteMapping("/media/{id}")
    public ResponseEntity<Void> deleteMediaContent(@PathVariable Long id) {
        log.info("REST request to delete media content: {}", id);
        lmsService.deleteMediaContent(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/forums/{id}")
    public ResponseEntity<Void> deleteForum(@PathVariable Long id) {
        log.info("REST request to delete discussion forum: {}", id);
        lmsService.deleteForum(id);
        return ResponseEntity.noContent().build();
    }
}
