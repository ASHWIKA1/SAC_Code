package com.sac.erp.modules.lms.service;

import com.sac.erp.modules.lms.entity.*;
import java.util.List;

public interface LmsService {
    // Media/Content operations
    List<MediaType> getAllMediaTypes();
    MediaType createMediaType(MediaType mediaType);
    List<MediaContent> getAllMediaContents();
    MediaContent createMediaContent(MediaContent mediaContent);
    StudentMediaContent trackMediaAccess(Long studentId, Long mediaContentId);

    // Assignment operations
    AssignmentStatus createAssignmentStatus(AssignmentStatus status);
    List<AssignmentDetails> getAllAssignments();
    List<AssignmentDetails> getAssignmentsByCourse(Long courseId);
    AssignmentDetails createAssignment(AssignmentDetails assignment);
    StudentAssignment submitAssignment(Long assignmentId, Long studentId);
    List<StudentAssignment> getSubmissionsByAssignment(Long assignmentId);
    StudentAssignmentReview reviewSubmission(Long studentAssignmentId, String remarks, Long facultyId);

    // Enhanced operations
    AssignmentEvaluation evaluateAssignment(Long studentAssignmentId, Integer score, String remarks, Integer needsResubmission);
    AiQuestionHistory saveAiGenerationRequest(String subject, String topic, String difficulty, String bloomLevel, String questionType, List<GeneratedQuestion> questions);
    List<AiQuestionHistory> getAiGenerationHistory();

    // Quiz operations
    List<LmsQuiz> getAllQuizzes();
    LmsQuiz getQuizById(Long id);
    LmsQuiz createQuiz(LmsQuiz quiz);
    LmsQuiz updateQuiz(Long id, LmsQuiz quiz);
    void deleteQuiz(Long id);
    List<LmsQuizQuestion> getQuestionsForQuiz(Long quizId);
    LmsQuizQuestion addQuestionToQuiz(Long quizId, LmsQuizQuestion question);
    LmsQuizAttempt submitQuizAttempt(LmsQuizAttempt attempt);
    List<LmsQuizAttempt> getAttemptsForQuiz(Long quizId);
    List<LmsQuizAttempt> getAttemptsForStudent(Long studentId);

    // Forum operations
    List<LmsForum> getAllForums();
    LmsForum createForum(LmsForum forum);
    List<LmsForumPost> getPostsForForum(Long forumId);
    LmsForumPost createForumPost(LmsForumPost post);

    // Live Class operations
    List<LmsLiveClass> getAllLiveClasses();
    LmsLiveClass createLiveClass(LmsLiveClass liveClass);
    LmsLiveClass updateLiveClass(Long id, LmsLiveClass liveClass);
}
