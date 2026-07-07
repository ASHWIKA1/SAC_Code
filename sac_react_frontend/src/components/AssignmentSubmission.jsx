import React, { useState, useEffect } from 'react';
import { PageHeader, WhiteCard, FormGroup, Alert } from './UI';
import { BookOpen, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

/**
 * AssignmentSubmission Component
 * Handles selected course, selected subject, and assignment title with state management,
 * mock API integrations with fallback, and real-time character limit/special character validation.
 */
export default function AssignmentSubmission() {
  // --- State Management ---
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');

  // --- UI/Status States ---
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- API Integration: Fetch Active Courses ---
  useEffect(() => {
    let active = true;
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const response = await api.get('/api/v1/academics/classes');
        if (active) {
          const rawList = response.data?.data || response.data || [];
          const coursesList = rawList.map(c => ({
            id: String(c.id),
            name: c.className || c.name || `Class ${c.id}`
          }));
          setCourses(coursesList);
        }
      } catch (err) {
        console.warn("API GET /api/v1/academics/classes failed. Falling back to active mock courses.", err);
        // Fallback mock courses for demo stability
        if (active) {
          setCourses([
            { id: '1', name: 'Computer Science (CS-101)' },
            { id: '2', name: 'Advanced Mathematics (MATH-302)' },
            { id: '3', name: 'Mechanical Engineering (ME-205)' },
            { id: '4', name: 'General Physics (PHY-110)' }
          ]);
        }
      } finally {
        if (active) setCoursesLoading(false);
      }
    };

    fetchCourses();
    return () => { active = false; };
  }, []);

  // --- API Integration: Fetch Subjects by Course ID ---
  useEffect(() => {
    // Reset selected subject and subjects list when course changes
    setSelectedSubject('');
    setSubjects([]);
    setValidationError('');

    if (!selectedCourse) return;

    let active = true;
    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      try {
        const response = await api.get('/api/v1/academics/subjects');
        if (active) {
          const rawList = response.data?.data || response.data || [];
          const subjectsList = rawList.map(s => ({
            id: String(s.id),
            name: s.subjectName || s.name || `Subject ${s.id}`
          }));
          setSubjects(subjectsList);
        }
      } catch (err) {
        console.warn("API GET /api/v1/academics/subjects failed. Falling back to mock subjects.", err);
        // Fallback mock subjects based on course
        if (active) {
          const mockSubjectsMap = {
            '1': [
              { id: '101', name: 'Data Structures & Algorithms' },
              { id: '102', name: 'Web Programming' },
              { id: '103', name: 'Database Management Systems' }
            ],
            '2': [
              { id: '201', name: 'Linear Algebra' },
              { id: '202', name: 'Multivariable Calculus' },
              { id: '203', name: 'Discrete Mathematics' }
            ],
            '3': [
              { id: '301', name: 'Thermodynamics' },
              { id: '302', name: 'Fluid Mechanics' },
              { id: '303', name: 'Kinematics of Machinery' }
            ],
            '4': [
              { id: '401', name: 'Classical Mechanics' },
              { id: '402', name: 'Electromagnetism' },
              { id: '403', name: 'Quantum Optics' }
            ]
          };
          setSubjects(mockSubjectsMap[selectedCourse] || []);
        }
      } finally {
        if (active) setSubjectsLoading(false);
      }
    };

    fetchSubjects();
    return () => { active = false; };
  }, [selectedCourse]);

  // --- Validation Helper for Assignment Title ---
  const validateTitle = (val) => {
    if (val.length > 50) {
      return 'Assignment title cannot exceed 50 characters.';
    }

    // Regex check: Alphanumeric and spaces only
    const regex = /^[a-zA-Z0-9 ]*$/;
    if (!regex.test(val)) {
      return 'Assignment title cannot contain special characters (letters, numbers, and spaces only).';
    }

    return '';
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setAssignmentTitle(val);
    setValidationError(validateTitle(val));
  };

  // --- Submission Handler ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // Final Validation Check
    if (!selectedCourse) {
      setValidationError('Please select a course.');
      return;
    }

    if (!selectedSubject) {
      setValidationError('Please select a subject.');
      return;
    }

    if (!assignmentTitle.trim()) {
      setValidationError('Assignment title is required.');
      return;
    }

    const titleError = validateTitle(assignmentTitle);
    if (titleError) {
      setValidationError(titleError);
      return;
    }

    // Successful validation logic
    setValidationError('');
    setIsSubmitting(true);

    const submissionData = {
      course_id: selectedCourse,
      subject_id: selectedSubject,
      assignment_title: assignmentTitle.trim(),
      submitted_at: new Date().toISOString()
    };

    // Log the gathered data to the console as requested
    console.log("=== Assignment Submitted ===");
    console.log("Course ID:", submissionData.course_id);
    console.log("Subject ID:", submissionData.subject_id);
    console.log("Assignment Title:", submissionData.assignment_title);
    console.log("Submission Payload:", submissionData);
    console.log("============================");

    // Simulate server write success
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(`Assignment "${submissionData.assignment_title}" has been submitted successfully!`);
      
      // Reset Form State
      setSelectedCourse('');
      setSelectedSubject('');
      setAssignmentTitle('');
      
      // Auto-clear success alert after 4 seconds
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 800);
  };

  const hasValidationError = !!validationError;
  const isTitleLengthNearLimit = assignmentTitle.length >= 40;

  return (
    <>
      <PageHeader 
        title="Submit Assignment" 
        breadcrumbs={[{ label: 'Homework' }, { label: 'Submit Assignment' }]} 
      />

      <div className="row" style={{ justifyContent: 'center' }}>
        <div className="col-12 col-lg-8">
          <WhiteCard title="Create New Submission" bodyPadding={true}>
            {/* Success Alert */}
            {successMsg && (
              <div className="mb-4">
                <Alert type="success" msg={successMsg} onClose={() => setSuccessMsg('')} />
              </div>
            )}

            {/* Error Alert */}
            {validationError && (
              <div className="mb-4">
                <Alert type="danger" msg={validationError} onClose={() => setValidationError('')} />
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              
              {/* Course Selection */}
              <FormGroup label="Course" required={true}>
                <div style={{ position: 'relative' }}>
                  <select
                    id="courseSelect"
                    className="form-control"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    disabled={coursesLoading || isSubmitting}
                    style={{ paddingRight: '40px' }}
                  >
                    <option value="">-- Choose an Active Course --</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  {coursesLoading && (
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                      <Loader2 className="animate-spin text-muted" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                  )}
                </div>
              </FormGroup>

              {/* Subject Selection */}
              <FormGroup label="Subject" required={true}>
                <div style={{ position: 'relative' }}>
                  <select
                    id="subjectSelect"
                    className="form-control"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={!selectedCourse || subjectsLoading || isSubmitting}
                    style={{ paddingRight: '40px' }}
                  >
                    {!selectedCourse ? (
                      <option value="">-- Select a course first --</option>
                    ) : (
                      <option value="">-- Choose a Subject --</option>
                    )}
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {subjectsLoading && (
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                      <Loader2 className="animate-spin text-muted" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                  )}
                </div>
                {selectedCourse && subjects.length === 0 && !subjectsLoading && (
                  <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    No subjects found for this course.
                  </small>
                )}
              </FormGroup>

              {/* Assignment Title */}
              <FormGroup label="Assignment Title" required={true}>
                <div style={{ position: 'relative' }}>
                  <input
                    id="assignmentTitle"
                    type="text"
                    className={`form-control ${hasValidationError ? 'is-invalid' : ''}`}
                    placeholder="e.g. Midterm Lab Report"
                    value={assignmentTitle}
                    onChange={handleTitleChange}
                    disabled={isSubmitting}
                    style={{
                      borderColor: hasValidationError ? 'var(--danger)' : undefined,
                      paddingRight: '80px'
                    }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    fontSize: '11px',
                    color: hasValidationError ? 'var(--danger)' : (isTitleLengthNearLimit ? 'var(--warning)' : 'var(--text-light)'),
                    fontWeight: isTitleLengthNearLimit ? 600 : 400,
                    pointerEvents: 'none'
                  }}>
                    {assignmentTitle.length} / 50
                  </div>
                </div>
                <small className="text-muted" style={{ marginTop: '4px', display: 'block' }}>
                  Alphanumeric characters and spaces only. Max 50 characters.
                </small>
              </FormGroup>

              {/* Submit Button & Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn-secondary-outline"
                  onClick={() => {
                    setSelectedCourse('');
                    setSelectedSubject('');
                    setAssignmentTitle('');
                    setValidationError('');
                  }}
                  disabled={isSubmitting || (!selectedCourse && !selectedSubject && !assignmentTitle)}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="primary_btn"
                  disabled={isSubmitting || hasValidationError || !selectedCourse || !selectedSubject || !assignmentTitle.trim()}
                  style={{
                    opacity: (isSubmitting || hasValidationError || !selectedCourse || !selectedSubject || !assignmentTitle.trim()) ? 0.6 : 1,
                    cursor: (isSubmitting || hasValidationError || !selectedCourse || !selectedSubject || !assignmentTitle.trim()) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', marginRight: '6px' }} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} style={{ marginRight: '6px' }} />
                      Submit Assignment
                    </>
                  )}
                </button>
              </div>
            </form>
          </WhiteCard>
        </div>
      </div>

      {/* Embedded CSS for custom inline keyframes and input focus styling */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .form-control.is-invalid:focus {
          border-color: var(--danger) !important;
          box-shadow: 0 0 0 3px rgba(239, 95, 95, 0.15) !important;
        }
      `}</style>
    </>
  );
}
