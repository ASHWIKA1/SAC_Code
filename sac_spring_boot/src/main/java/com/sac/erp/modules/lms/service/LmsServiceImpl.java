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
}
