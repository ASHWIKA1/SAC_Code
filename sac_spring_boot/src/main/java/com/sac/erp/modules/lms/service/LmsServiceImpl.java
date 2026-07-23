package com.sac.erp.modules.lms.service;

import com.sac.erp.modules.lms.entity.*;
import com.sac.erp.modules.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LmsServiceImpl implements LmsService {

    private final MediaTypeRepository mediaTypeRepository;
    private final MediaContentRepository mediaContentRepository;
    private final StudentMediaContentRepository studentMediaContentRepository;
    private final AssignmentStatusRepository assignmentStatusRepository;
    private final AssignmentDetailsRepository assignmentDetailsRepository;
    private final StudentAssignmentRepository studentAssignmentRepository;
    private final StudentAssignmentReviewRepository studentAssignmentReviewRepository;
    private final AssignmentEvaluationRepository assignmentEvaluationRepository;
    private final AiQuestionHistoryRepository aiQuestionHistoryRepository;
    private final GeneratedQuestionRepository generatedQuestionRepository;
    private final LmsQuizRepository lmsQuizRepository;
    private final LmsQuizQuestionRepository lmsQuizQuestionRepository;
    private final LmsQuizAttemptRepository lmsQuizAttemptRepository;
    private final LmsForumRepository lmsForumRepository;
    private final LmsForumPostRepository lmsForumPostRepository;
    private final LmsLiveClassRepository lmsLiveClassRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MediaType> getAllMediaTypes() {
        return mediaTypeRepository.findAll();
    }

    @Override
    @Transactional
    public MediaType createMediaType(MediaType mediaType) {
        return mediaTypeRepository.save(mediaType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaContent> getAllMediaContents() {
        return mediaContentRepository.findByIsDeleted(0);
    }

    @Override
    @Transactional
    public MediaContent createMediaContent(MediaContent mediaContent) {
        if (mediaContent.getMediaType() != null && mediaContent.getMediaType().getId() != null) {
            MediaType mediaType = mediaTypeRepository.findById(mediaContent.getMediaType().getId())
                    .orElseThrow(() -> new RuntimeException("Media Type not found"));
            mediaContent.setMediaType(mediaType);
        }
        mediaContent.setIsDeleted(0);
        return mediaContentRepository.save(mediaContent);
    }

    @Override
    @Transactional
    public StudentMediaContent trackMediaAccess(Long studentId, Long mediaContentId) {
        MediaContent mediaContent = mediaContentRepository.findById(mediaContentId)
                .orElseThrow(() -> new RuntimeException("Media Content not found"));

        StudentMediaContent access = new StudentMediaContent();
        access.setStudentId(studentId);
        access.setMediaContent(mediaContent);
        access.setIsDeleted(0);
        return studentMediaContentRepository.save(access);
    }

    @Override
    @Transactional
    public AssignmentStatus createAssignmentStatus(AssignmentStatus status) {
        return assignmentStatusRepository.save(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDetails> getAllAssignments() {
        return assignmentDetailsRepository.findByIsDeleted(0);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDetails> getAssignmentsByCourse(Long courseId) {
        return assignmentDetailsRepository.findByCourseIdAndIsDeleted(courseId, 0);
    }

    @Override
    @Transactional
    public AssignmentDetails createAssignment(AssignmentDetails assignment) {
        if (assignment.getStatus() != null && assignment.getStatus().getId() != null) {
            AssignmentStatus status = assignmentStatusRepository.findById(assignment.getStatus().getId())
                    .orElseThrow(() -> new RuntimeException("Assignment Status not found"));
            assignment.setStatus(status);
        } else {
            // default to status ID 1
            AssignmentStatus status = assignmentStatusRepository.findById(1L)
                    .orElseGet(() -> {
                        AssignmentStatus defaultStatus = new AssignmentStatus();
                        defaultStatus.setStatusName("Active");
                        defaultStatus.setIsDeleted(0);
                        return assignmentStatusRepository.save(defaultStatus);
                    });
            assignment.setStatus(status);
        }
        assignment.setIsDeleted(0);
        return assignmentDetailsRepository.save(assignment);
    }

    @Override
    @Transactional
    public StudentAssignment submitAssignment(Long assignmentId, Long studentId) {
        AssignmentDetails assignment = assignmentDetailsRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment details not found"));

        StudentAssignment sub = studentAssignmentRepository.findByAssignmentIdAndStudentIdAndIsDeleted(assignmentId, studentId, 0)
                .orElse(new StudentAssignment());

        sub.setAssignment(assignment);
        sub.setStudentId(studentId);
        sub.setSubmittedDate(LocalDateTime.now());
        sub.setIsDeleted(0);

        AssignmentStatus status = assignmentStatusRepository.findByStatusNameIgnoreCase("Submitted")
                .orElseGet(() -> {
                    AssignmentStatus defaultStatus = new AssignmentStatus();
                    defaultStatus.setStatusName("Submitted");
                    defaultStatus.setIsDeleted(0);
                    return assignmentStatusRepository.save(defaultStatus);
                });
        sub.setStatus(status);

        return studentAssignmentRepository.save(sub);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAssignment> getSubmissionsByAssignment(Long assignmentId) {
        return studentAssignmentRepository.findByAssignmentIdAndIsDeleted(assignmentId, 0);
    }

    @Override
    @Transactional
    public StudentAssignmentReview reviewSubmission(Long studentAssignmentId, String remarks, Long facultyId) {
        StudentAssignment sub = studentAssignmentRepository.findById(studentAssignmentId)
                .orElseThrow(() -> new RuntimeException("Student assignment submission not found"));

        StudentAssignmentReview review = new StudentAssignmentReview();
        review.setStudentAssignment(sub);
        review.setRemarks(remarks);
        review.setFacultyId(facultyId);
        review.setIsDeleted(0);

        AssignmentStatus status = assignmentStatusRepository.findByStatusNameIgnoreCase("Evaluated")
                .orElseGet(() -> {
                    AssignmentStatus defaultStatus = new AssignmentStatus();
                    defaultStatus.setStatusName("Evaluated");
                    defaultStatus.setIsDeleted(0);
                    return assignmentStatusRepository.save(defaultStatus);
                });
        sub.setStatus(status);
        studentAssignmentRepository.save(sub);

        return studentAssignmentReviewRepository.save(review);
    }

    @Override
    @Transactional
    public AssignmentEvaluation evaluateAssignment(Long studentAssignmentId, Integer score, String remarks, Integer needsResubmission) {
        StudentAssignment sub = studentAssignmentRepository.findById(studentAssignmentId)
                .orElseThrow(() -> new RuntimeException("Student assignment submission not found"));

        AssignmentEvaluation eval = assignmentEvaluationRepository.findByStudentAssignmentId(studentAssignmentId)
                .orElse(new AssignmentEvaluation());

        eval.setStudentAssignment(sub);
        eval.setScore(score);
        eval.setRemarks(remarks);
        eval.setNeedsResubmission(needsResubmission);

        String statusName = (needsResubmission == 1) ? "Resubmit" : "Evaluated";
        AssignmentStatus status = assignmentStatusRepository.findByStatusNameIgnoreCase(statusName)
                .orElseGet(() -> {
                    AssignmentStatus defaultStatus = new AssignmentStatus();
                    defaultStatus.setStatusName(statusName);
                    defaultStatus.setIsDeleted(0);
                    return assignmentStatusRepository.save(defaultStatus);
                });
        sub.setStatus(status);
        studentAssignmentRepository.save(sub);

        return assignmentEvaluationRepository.save(eval);
    }

    @Override
    @Transactional
    public AiQuestionHistory saveAiGenerationRequest(String subject, String topic, String difficulty, String bloomLevel, String questionType, List<GeneratedQuestion> questions) {
        AiQuestionHistory history = new AiQuestionHistory();
        history.setSubject(subject);
        history.setTopic(topic);
        history.setDifficulty(difficulty);
        history.setBloomLevel(bloomLevel);
        history.setQuestionType(questionType);
        AiQuestionHistory savedHistory = aiQuestionHistoryRepository.save(history);

        for (GeneratedQuestion q : questions) {
            q.setHistory(savedHistory);
            generatedQuestionRepository.save(q);
        }

        return savedHistory;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AiQuestionHistory> getAiGenerationHistory() {
        return aiQuestionHistoryRepository.findAll();
    }

    // Quiz operations implementation
    @Override
    @Transactional(readOnly = true)
    public List<LmsQuiz> getAllQuizzes() {
        return lmsQuizRepository.findByIsDeleted(0);
    }

    @Override
    @Transactional(readOnly = true)
    public LmsQuiz getQuizById(Long id) {
        return lmsQuizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
    }

    @Override
    @Transactional
    public LmsQuiz createQuiz(LmsQuiz quiz) {
        quiz.setIsDeleted(0);
        return lmsQuizRepository.save(quiz);
    }

    @Override
    @Transactional
    public LmsQuiz updateQuiz(Long id, LmsQuiz quizDetails) {
        LmsQuiz quiz = getQuizById(id);
        quiz.setTitle(quizDetails.getTitle());
        quiz.setStartDate(quizDetails.getStartDate());
        quiz.setEndDate(quizDetails.getEndDate());
        quiz.setDuration(quizDetails.getDuration());
        quiz.setStatus(quizDetails.getStatus());
        quiz.setAssignedClass(quizDetails.getAssignedClass());
        quiz.setAssignedSection(quizDetails.getAssignedSection());
        return lmsQuizRepository.save(quiz);
    }

    @Override
    @Transactional
    public void deleteQuiz(Long id) {
        LmsQuiz quiz = getQuizById(id);
        quiz.setIsDeleted(1);
        lmsQuizRepository.save(quiz);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LmsQuizQuestion> getQuestionsForQuiz(Long quizId) {
        return lmsQuizQuestionRepository.findByQuizId(quizId);
    }

    @Override
    @Transactional
    public LmsQuizQuestion addQuestionToQuiz(Long quizId, LmsQuizQuestion question) {
        LmsQuiz quiz = getQuizById(quizId);
        question.setQuiz(quiz);
        return lmsQuizQuestionRepository.save(question);
    }

    @Override
    @Transactional
    public LmsQuizAttempt submitQuizAttempt(LmsQuizAttempt attempt) {
        if (attempt.getQuiz() != null && attempt.getQuiz().getId() != null) {
            LmsQuiz quiz = getQuizById(attempt.getQuiz().getId());
            attempt.setQuiz(quiz);
        }
        attempt.setSubmittedDate(LocalDateTime.now());
        return lmsQuizAttemptRepository.save(attempt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LmsQuizAttempt> getAttemptsForQuiz(Long quizId) {
        return lmsQuizAttemptRepository.findByQuizId(quizId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LmsQuizAttempt> getAttemptsForStudent(Long studentId) {
        return lmsQuizAttemptRepository.findByStudentId(studentId);
    }

    // Forum operations implementation
    @Override
    @Transactional(readOnly = true)
    public List<LmsForum> getAllForums() {
        return lmsForumRepository.findAll();
    }

    @Override
    @Transactional
    public LmsForum createForum(LmsForum forum) {
        return lmsForumRepository.save(forum);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LmsForumPost> getPostsForForum(Long forumId) {
        return lmsForumPostRepository.findByForumId(forumId);
    }

    @Override
    @Transactional
    public LmsForumPost createForumPost(LmsForumPost post) {
        if (post.getForum() != null && post.getForum().getId() != null) {
            LmsForum forum = lmsForumRepository.findById(post.getForum().getId())
                    .orElseThrow(() -> new RuntimeException("Forum not found"));
            post.setForum(forum);
        }
        return lmsForumPostRepository.save(post);
    }

    // Live Class operations implementation
    @Override
    @Transactional(readOnly = true)
    public List<LmsLiveClass> getAllLiveClasses() {
        return lmsLiveClassRepository.findAll();
    }

    @Override
    @Transactional
    public LmsLiveClass createLiveClass(LmsLiveClass liveClass) {
        return lmsLiveClassRepository.save(liveClass);
    }

    @Override
    @Transactional
    public LmsLiveClass updateLiveClass(Long id, LmsLiveClass liveClassDetails) {
        LmsLiveClass liveClass = lmsLiveClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Live Class not found with id: " + id));
        liveClass.setTitle(liveClassDetails.getTitle());
        liveClass.setDateTime(liveClassDetails.getDateTime());
        liveClass.setDuration(liveClassDetails.getDuration());
        liveClass.setStatus(liveClassDetails.getStatus());
        liveClass.setMeetingUrl(liveClassDetails.getMeetingUrl());
        liveClass.setRecordingUrl(liveClassDetails.getRecordingUrl());
        return lmsLiveClassRepository.save(liveClass);
    }

    @Override
    @Transactional
    public void deleteMediaContent(Long id) {
        MediaContent mediaContent = mediaContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media Content not found"));
        mediaContent.setIsDeleted(1);
        mediaContentRepository.save(mediaContent);
    }

    @Override
    @Transactional
    public void deleteForum(Long id) {
        LmsForum forum = lmsForumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Forum not found"));
        lmsForumRepository.delete(forum);
    }
}
