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
}
