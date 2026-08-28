import React, { useState, useEffect } from 'react';
import { PageHeader, WhiteCard, FormGroup, Alert } from './UI';
import { BookOpen, FileText, CheckCircle, AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import api from '../utils/api';

// --- Static Default Data for School and College ---
const DEFAULT_COURSES = [
  // School Level
  { id: 'school_10', name: 'Class 10th - Secondary School' },
  { id: 'school_11', name: 'Class 11th - Higher Secondary' },
  { id: 'school_12', name: 'Class 12th - Higher Secondary' },
  // College Level
  { id: 'college_cs', name: 'Computer Science (B.Tech / B.Sc)' },
  { id: 'college_math', name: 'Advanced Mathematics (B.Sc / M.Sc)' },
  { id: 'college_me', name: 'Mechanical Engineering (B.Tech)' },
  { id: 'college_phy', name: 'General Physics (B.Sc)' }
];

const DEFAULT_SUBJECTS_MAP = {
  // Legacy / Backend Fallbacks (standard courses 1-4)
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
  ],
  // School Courses
  'school_10': [
    { id: 's10_math', name: 'Mathematics (Algebra, Geometry, Trigonometry)' },
    { id: 's10_science', name: 'Science (Physics, Chemistry, Biology)' },
    { id: 's10_english', name: 'English Literature & Grammar' },
    { id: 's10_social', name: 'Social Studies (History, Civics, Geography)' }
  ],
  'school_11': [
    { id: 's11_physics', name: 'Physics (Mechanics, Waves, Thermodynamics)' },
    { id: 's11_chemistry', name: 'Chemistry (Organic, Inorganic, Physical)' },
    { id: 's11_math', name: 'Mathematics (Calculus, Trigonometry, Vectors)' },
    { id: 's11_biology', name: 'Biology (Botany, Zoology, Genetics)' }
  ],
  'school_12': [
    { id: 's12_physics', name: 'Physics (Electromagnetism, Optics, Modern Physics)' },
    { id: 's12_chemistry', name: 'Chemistry (Electrochemistry, Kinetics, Coordination)' },
    { id: 's12_math', name: 'Mathematics (Probability, Integration, Matrices)' },
    { id: 's12_biology', name: 'Biology (Ecology, Physiology, Biotechnology)' }
  ],
  // College Courses
  'college_cs': [
    { id: 'c_ds', name: 'Data Structures & Algorithms (CS-101)' },
    { id: 'c_web', name: 'Web Development & Javascript (CS-102)' },
    { id: 'c_db', name: 'Database Management Systems (CS-103)' },
    { id: 'c_os', name: 'Operating Systems & Architecture (CS-104)' }
  ],
  'college_math': [
    { id: 'c_la', name: 'Linear Algebra & Matrices (MATH-302)' },
    { id: 'c_calc', name: 'Multivariable Calculus & Real Analysis (MATH-303)' },
    { id: 'c_discrete', name: 'Discrete Mathematics & Graph Theory (MATH-304)' }
  ],
  'college_me': [
    { id: 'c_thermo', name: 'Thermodynamics & Heat Transfer (ME-205)' },
    { id: 'c_fluid', name: 'Fluid Mechanics & Hydraulics (ME-206)' },
    { id: 'c_kin', name: 'Kinematics & Dynamics of Machinery (ME-207)' }
  ],
  'college_phy': [
    { id: 'c_classic', name: 'Classical Mechanics & Relativity (PHY-110)' },
    { id: 'c_em', name: 'Electromagnetism & Maxwell Equations (PHY-111)' },
    { id: 'c_quantum', name: 'Quantum Physics & Wave Mechanics (PHY-112)' }
  ]
};

export default function AssignmentSubmission() {
  // --- Main State Management ---
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');

  // --- Custom Courses & Subjects State (LocalStorage Persistent) ---
  const [customCourses, setCustomCourses] = useState(() => {
    const saved = localStorage.getItem('custom_courses');
    return saved ? JSON.parse(saved) : [];
  });
  const [customSubjects, setCustomSubjects] = useState(() => {
    const saved = localStorage.getItem('custom_subjects');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Inline Form State for adding custom items ---
  const [newCourseName, setNewCourseName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCourseId, setNewSubjectCourseId] = useState('');

  // --- UI Alerts & Status States ---
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom Card Alerts
  const [customError, setCustomError] = useState('');
  const [customSuccess, setCustomSuccess] = useState('');

  // --- API Integration: Fetch Active Courses ---
  useEffect(() => {
    let active = true;
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const response = await api.get('/api/v1/academics/classes');
        if (active) {
          const rawList = response.data?.data || response.data || [];
          if (rawList.length > 0) {
            const coursesList = rawList.map(c => ({
              id: String(c.id),
              name: c.className || c.name || `Class ${c.id}`
            }));
            setCourses(coursesList);
          } else {
            setCourses(DEFAULT_COURSES);
          }
        }
      } catch (err) {
        console.warn("API GET /api/v1/academics/classes failed. Falling back to active mock courses.", err);
        if (active) {
          setCourses(DEFAULT_COURSES);
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
    setSelectedSubject('');
    setSubjects([]);
    setValidationError('');

    if (!selectedCourse || selectedCourse === 'ADD_CUSTOM_COURSE') return;

    // If it's a custom-added course, do not fetch standard subjects from the backend
    if (selectedCourse.startsWith('custom_c_')) {
      setSubjects([]);
      return;
    }

    let active = true;
    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      try {
        const response = await api.get('/api/v1/academics/subjects');
        if (active) {
          const rawList = response.data?.data || response.data || [];
          if (rawList.length > 0) {
            const subjectsList = rawList.map(s => ({
              id: String(s.id),
              name: s.subjectName || s.name || `Subject ${s.id}`
            }));
            setSubjects(subjectsList);
          } else {
            setSubjects(DEFAULT_SUBJECTS_MAP[selectedCourse] || []);
          }
        }
      } catch (err) {
        console.warn("API GET /api/v1/academics/subjects failed. Falling back to mock subjects.", err);
        if (active) {
          setSubjects(DEFAULT_SUBJECTS_MAP[selectedCourse] || []);
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

  // --- Submit Main Assignment Submission ---
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCourse || selectedCourse === 'ADD_CUSTOM_COURSE') {
      setValidationError('Please select a course.');
      return;
    }
    if (!selectedSubject || selectedSubject === 'ADD_CUSTOM_SUBJECT') {
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

    setValidationError('');
    setIsSubmitting(true);

    const submissionData = {
      course_id: selectedCourse,
      subject_id: selectedSubject,
      assignment_title: assignmentTitle.trim(),
      submitted_at: new Date().toISOString()
    };

    console.log("=== Assignment Submitted ===");
    console.log("Course ID:", submissionData.course_id);
    console.log("Subject ID:", submissionData.subject_id);
    console.log("Assignment Title:", submissionData.assignment_title);
    console.log("Submission Payload:", submissionData);
    console.log("============================");

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(`Assignment "${submissionData.assignment_title}" has been submitted successfully!`);
      setSelectedCourse('');
      setSelectedSubject('');
      setAssignmentTitle('');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 800);
  };

  // --- Add Custom Course ---
  const handleAddCustomCourse = (e) => {
    e.preventDefault();
    setCustomError('');
    setCustomSuccess('');
    const trimmed = newCourseName.trim();

    if (!trimmed) {
      setCustomError('Course name cannot be empty.');
      return;
    }
    if (trimmed.length > 55) {
      setCustomError('Course name cannot exceed 55 characters.');
      return;
    }

    const isDuplicate = [...courses, ...customCourses].some(
      c => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setCustomError('A course with this name already exists.');
      return;
    }

    const newCourseId = 'custom_c_' + Date.now();
    const newCourse = {
      id: newCourseId,
      name: trimmed
    };

    const updated = [...customCourses, newCourse];
    setCustomCourses(updated);
    localStorage.setItem('custom_courses', JSON.stringify(updated));
    setNewCourseName('');
    setCustomSuccess(`Course "${trimmed}" added successfully!`);
    setTimeout(() => setCustomSuccess(''), 4000);
    return newCourseId;
  };

  // --- Add Custom Subject ---
  const handleAddCustomSubject = (e) => {
    e.preventDefault();
    setCustomError('');
    setCustomSuccess('');
    const trimmed = newSubjectName.trim();

    if (!newSubjectCourseId) {
      setCustomError('Please select a course for this subject.');
      return;
    }
    if (!trimmed) {
      setCustomError('Subject name cannot be empty.');
      return;
    }
    if (trimmed.length > 55) {
      setCustomError('Subject name cannot exceed 55 characters.');
      return;
    }

    // Check duplicates inside the same course
    const standardSubs = DEFAULT_SUBJECTS_MAP[newSubjectCourseId] || [];
    const customSubs = customSubjects.filter(s => s.courseId === newSubjectCourseId);
    const isDuplicate = [...standardSubs, ...customSubs].some(
      s => s.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setCustomError('This subject already exists in the selected course.');
      return;
    }

    const newSubId = 'custom_s_' + Date.now();
    const newSubject = {
      id: newSubId,
      courseId: newSubjectCourseId,
      name: trimmed
    };

    const updated = [...customSubjects, newSubject];
    setCustomSubjects(updated);
    localStorage.setItem('custom_subjects', JSON.stringify(updated));
    setNewSubjectName('');
    setCustomSuccess(`Subject "${trimmed}" added successfully!`);
    setTimeout(() => setCustomSuccess(''), 4000);
    return newSubId;
  };

  // --- Inline Custom Course Save (Dropdown Shortcut) ---
  const handleSaveCustomCourseInline = (e) => {
    e.preventDefault();
    setValidationError('');
    const trimmed = newCourseName.trim();

    if (!trimmed) {
      setValidationError('Custom course name cannot be empty.');
      return;
    }
    if (trimmed.length > 55) {
      setValidationError('Custom course name cannot exceed 55 characters.');
      return;
    }

    const isDuplicate = [...courses, ...customCourses].some(
      c => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setValidationError('A course with this name already exists.');
      return;
    }

    const newCourseId = 'custom_c_' + Date.now();
    const newCourse = {
      id: newCourseId,
      name: trimmed
    };

    const updated = [...customCourses, newCourse];
    setCustomCourses(updated);
    localStorage.setItem('custom_courses', JSON.stringify(updated));
    setNewCourseName('');
    
    // Select the new custom course immediately
    setSelectedCourse(newCourseId);
    setSuccessMsg(`Custom course "${trimmed}" created and selected!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // --- Inline Custom Subject Save (Dropdown Shortcut) ---
  const handleSaveCustomSubjectInline = (e) => {
    e.preventDefault();
    setValidationError('');
    const trimmed = newSubjectName.trim();

    if (!selectedCourse || selectedCourse === 'ADD_CUSTOM_COURSE') {
      setValidationError('Please select a valid course first.');
      return;
    }
    if (!trimmed) {
      setValidationError('Custom subject name cannot be empty.');
      return;
    }
    if (trimmed.length > 55) {
      setValidationError('Custom subject name cannot exceed 55 characters.');
      return;
    }

    // Check duplicates inside the same course
    const standardSubs = DEFAULT_SUBJECTS_MAP[selectedCourse] || [];
    const customSubs = customSubjects.filter(s => s.courseId === selectedCourse);
    const isDuplicate = [...standardSubs, ...customSubs].some(
      s => s.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setValidationError('This subject already exists in this course.');
      return;
    }

    const newSubId = 'custom_s_' + Date.now();
    const newSubject = {
      id: newSubId,
      courseId: selectedCourse,
      name: trimmed
    };

    const updated = [...customSubjects, newSubject];
    setCustomSubjects(updated);
    localStorage.setItem('custom_subjects', JSON.stringify(updated));
    setNewSubjectName('');
    
    // Select the new custom subject immediately
    setSelectedSubject(newSubId);
    setSuccessMsg(`Custom subject "${trimmed}" created and selected!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // --- Delete Custom Course ---
  const handleDeleteCustomCourse = (courseId, courseName) => {
    const updatedCourses = customCourses.filter(c => c.id !== courseId);
    setCustomCourses(updatedCourses);
    localStorage.setItem('custom_courses', JSON.stringify(updatedCourses));

    // Also remove subjects belonging to this course
    const updatedSubs = customSubjects.filter(s => s.courseId !== courseId);
    setCustomSubjects(updatedSubs);
    localStorage.setItem('custom_subjects', JSON.stringify(updatedSubs));

    if (selectedCourse === courseId) {
      setSelectedCourse('');
      setSelectedSubject('');
    }
    setCustomSuccess(`Deleted Course: "${courseName}"`);
    setTimeout(() => setCustomSuccess(''), 3000);
  };

  // --- Delete Custom Subject ---
  const handleDeleteCustomSubject = (subId, subName) => {
    const updatedSubs = customSubjects.filter(s => s.id !== subId);
    setCustomSubjects(updatedSubs);
    localStorage.setItem('custom_subjects', JSON.stringify(updatedSubs));

    if (selectedSubject === subId) {
      setSelectedSubject('');
    }
    setCustomSuccess(`Deleted Subject: "${subName}"`);
    setTimeout(() => setCustomSuccess(''), 3000);
  };

  const hasValidationError = !!validationError;
  const isTitleLengthNearLimit = assignmentTitle.length >= 40;

  // Filter custom subjects belonging to the currently selected course
  const customSubjectsForCourse = customSubjects.filter(s => s.courseId === selectedCourse);

  return (
    <>
      <PageHeader 
        title="Submit Assignment" 
        breadcrumbs={[{ label: 'Homework' }, { label: 'Submit Assignment' }]} 
      />

      <div className="row">
        {/* Left Side: Submit Assignment Form */}
        <div className="col-12 col-lg-7 col-xl-8">
          <WhiteCard title="Create New Submission" bodyPadding={true}>
            {successMsg && (
              <div className="mb-4">
                <Alert type="success" msg={successMsg} onClose={() => setSuccessMsg('')} />
              </div>
            )}

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
                    
                    {/* Render Standard Courses */}
                    {courses.length > 0 && (
                      <optgroup label="Standard Courses">
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {/* Render Custom Courses */}
                    {customCourses.length > 0 && (
                      <optgroup label="Custom Added Courses">
                        {customCourses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    <option value="ADD_CUSTOM_COURSE" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                      + Add New Custom Course...
                    </option>
                  </select>
                  {coursesLoading && (
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                      <Loader2 className="animate-spin text-muted" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                  )}
                </div>

                {/* Inline Add Course Input */}
                {selectedCourse === 'ADD_CUSTOM_COURSE' && (
                  <div className="mt-2 p-3" style={{ background: '#f8fafc', borderRadius: '4px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Enter New Course Name
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Class IX - Physics"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="primary_btn"
                        onClick={handleSaveCustomCourseInline}
                        style={{ padding: '0 16px', height: '42px' }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn-secondary-outline"
                        onClick={() => setSelectedCourse('')}
                        style={{ padding: '0 16px', height: '42px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </FormGroup>

              {/* Subject Selection */}
              <FormGroup label="Subject" required={true}>
                <div style={{ position: 'relative' }}>
                  <select
                    id="subjectSelect"
                    className="form-control"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={!selectedCourse || selectedCourse === 'ADD_CUSTOM_COURSE' || subjectsLoading || isSubmitting}
                    style={{ paddingRight: '40px' }}
                  >
                    {!selectedCourse ? (
                      <option value="">-- Select a course first --</option>
                    ) : (
                      <>
                        <option value="">-- Choose a Subject --</option>
                        
                        {/* Standard Subjects */}
                        {subjects.length > 0 && (
                          <optgroup label="Standard Subjects">
                            {subjects.map((subject) => (
                              <option key={subject.id} value={subject.id}>
                                {subject.name}
                              </option>
                            ))}
                          </optgroup>
                        )}

                        {/* Custom Added Subjects */}
                        {customSubjectsForCourse.length > 0 && (
                          <optgroup label="Custom Added Subjects">
                            {customSubjectsForCourse.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </optgroup>
                        )}

                        <option value="ADD_CUSTOM_SUBJECT" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                          + Add New Custom Subject...
                        </option>
                      </>
                    )}
                  </select>
                  {subjectsLoading && (
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                      <Loader2 className="animate-spin text-muted" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                  )}
                </div>

                {/* Inline Add Subject Input */}
                {selectedSubject === 'ADD_CUSTOM_SUBJECT' && (
                  <div className="mt-2 p-3" style={{ background: '#f8fafc', borderRadius: '4px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Enter New Subject Name for Selected Course
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Inorganic Lab Session"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="primary_btn"
                        onClick={handleSaveCustomSubjectInline}
                        style={{ padding: '0 16px', height: '42px' }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn-secondary-outline"
                        onClick={() => setSelectedSubject('')}
                        style={{ padding: '0 16px', height: '42px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {selectedCourse && selectedCourse !== 'ADD_CUSTOM_COURSE' && subjects.length === 0 && customSubjectsForCourse.length === 0 && !subjectsLoading && (
                  <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    No subjects found for this course. Choose "+ Add New Custom Subject..." from the dropdown to add one!
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

        {/* Right Side: Manage Custom Options Card */}
        <div className="col-12 col-lg-5 col-xl-4">
          <WhiteCard title="Custom Courses & Subjects" bodyPadding={true}>
            {customError && (
              <div className="mb-3">
                <Alert type="danger" msg={customError} onClose={() => setCustomError('')} />
              </div>
            )}
            {customSuccess && (
              <div className="mb-3">
                <Alert type="success" msg={customSuccess} onClose={() => setCustomSuccess('')} />
              </div>
            )}

            {/* Custom Course Form */}
            <form onSubmit={handleAddCustomCourse} className="mb-4 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Create Custom Course
              </div>
              <FormGroup label="Course Name" required={true}>
                <div className="input-group" style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Class IX - Chemistry"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="primary_btn" style={{ padding: '0 16px', height: '42px' }}>
                    <Plus size={18} />
                  </button>
                </div>
              </FormGroup>
            </form>

            {/* Custom Subject Form */}
            <form onSubmit={handleAddCustomSubject} className="mb-4 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Create Custom Subject
              </div>
              
              <FormGroup label="Select Course" required={true}>
                <select
                  className="form-control"
                  value={newSubjectCourseId}
                  onChange={(e) => setNewSubjectCourseId(e.target.value)}
                >
                  <option value="">-- Choose Course --</option>
                  {courses.length > 0 && (
                    <optgroup label="Standard Courses">
                      {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </optgroup>
                  )}
                  {customCourses.length > 0 && (
                    <optgroup label="Custom Added Courses">
                      {customCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </optgroup>
                  )}
                </select>
              </FormGroup>

              <FormGroup label="Subject Name" required={true}>
                <div className="input-group" style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Organic Chemistry Lab"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="primary_btn" style={{ padding: '0 16px', height: '42px' }}>
                    <Plus size={18} />
                  </button>
                </div>
              </FormGroup>
            </form>

            {/* Custom Items Manager List */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '12px', textTransform: 'uppercase' }}>
                Manage Added Custom Items
              </div>
              {customCourses.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                  No custom courses added yet.
                </div>
              ) : (
                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                  {customCourses.map(cc => {
                    const subs = customSubjects.filter(s => s.courseId === cc.id);
                    return (
                      <div key={cc.id} style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>{cc.name}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomCourse(cc.id, cc.name)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Delete Course & its subjects"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {subs.length > 0 && (
                          <div style={{ marginTop: '6px', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                            {subs.map(cs => (
                              <div key={cs.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', padding: '2px 0 2px 8px' }}>
                                <span>• {cs.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCustomSubject(cs.id, cs.name)}
                                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                                  title="Delete Subject"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
        .stat-list-item {
          transition: all 0.2s ease;
        }
        .stat-list-item:hover {
          background-color: #f1f5f9;
        }
      `}</style>
    </>
  );
}
