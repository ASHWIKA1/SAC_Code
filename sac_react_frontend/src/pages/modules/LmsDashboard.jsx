import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import { PageHeader, WhiteCard, FormGroup, Alert, Badge } from '../../components/UI';
import { 
  BookOpen, Award, MessageSquare, TrendingUp, Plus, Trash2, Edit3, 
  Clock, CheckCircle2, AlertTriangle, UploadCloud, UserPlus, FolderPlus, 
  Send, FileText, ChevronRight, CheckCircle, HelpCircle, User, 
  Eye, RefreshCw, X, Play, Info, Video, Presentation, Monitor, ExternalLink,
  ChevronLeft, ZoomIn, ZoomOut, CheckSquare, Download, Award as GradeIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, LineChart, Line 
} from 'recharts';
import api from '../../utils/api';

// Helper function to format minutes into human readable hours and minutes
const formatDurationToHours = (mins) => {
  const m = Number(mins);
  if (isNaN(m) || m <= 0) return '';
  const hours = Math.floor(m / 60);
  const remainingMins = m % 60;
  
  if (hours === 0) {
    return `${remainingMins} min${remainingMins !== 1 ? 's' : ''}`;
  } else if (remainingMins === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hr${hours !== 1 ? 's' : ''} ${remainingMins} min${remainingMins !== 1 ? 's' : ''}`;
  }
};

// --- STYLES FOR CARD HOVERS & CUSTOM GRAPHICS ---
const styles = {
  tabButton: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    border: 'none',
    background: isActive ? 'linear-gradient(90deg, rgba(124,50,255,0.08) 0%, rgba(199,56,216,0.08) 100%)' : 'none',
    color: isActive ? 'var(--primary-color)' : '#666',
    fontWeight: isActive ? '600' : '400',
    cursor: 'pointer',
    borderLeft: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    width: '100%',
    borderRadius: '0 4px 4px 0'
  }),
  innerTabButton: (isActive) => ({
    padding: '8px 16px',
    border: 'none',
    background: isActive ? 'var(--primary-color)' : 'none',
    color: isActive ? '#fff' : '#555',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12.5px',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.2s',
    border: isActive ? '1px solid var(--primary-color)' : '1px solid var(--border-color)'
  }),
  quizCard: {
    padding: '16px',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    marginBottom: '14px',
    transition: 'all 0.2s',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

// ==========================================
// MOCK DATA STORE (For Offline Simulation)
// ==========================================

const INITIAL_COURSES = [
  { id: 'c1', name: 'Physics Class XI - Mechanics' },
  { id: 'c2', name: 'Computer Science - Data Structures' },
  { id: 'c3', name: 'Advanced Calculus (MATH-302)' }
];

const INITIAL_ASSIGNMENTS = [
  { id: 'a1', courseId: 'c1', title: 'Newtonian Gravitation Lab', description: 'Solve problems 1-10 on planetary mechanics.', dueDate: '2026-07-15', maxMarks: 50, submissionsCount: 2 },
  { id: 'a2', courseId: 'c2', title: 'Binary Search Trees Implementation', description: 'Implement BST insertion, deletion, and traversal in JS/Java.', dueDate: '2026-07-20', maxMarks: 100, submissionsCount: 1 },
  { id: 'a3', courseId: 'c3', title: 'Double Integrals Worksheet', description: 'Evaluate double integrals over general polar regions.', dueDate: '2026-07-10', maxMarks: 30, submissionsCount: 0 }
];

const INITIAL_SUBMISSIONS = [
  { id: 'sub1', assignmentId: 'a1', studentName: 'Rahul Student', submissionText: 'My Lab report is attached. Answers are solved.', fileUrl: 'gravitation_report.pdf', submittedAt: '2026-07-03T10:10:00Z', marks: 45, rubric: { accuracy: 9, completeness: 9, presentation: 9 }, feedback: 'Excellent analysis of force equations!', graded: true },
  { id: 'sub2', assignmentId: 'a2', studentName: 'Rahul Student', submissionText: 'BST completed. Attached is index.js.', fileUrl: 'bst_index.js', submittedAt: '2026-07-04T12:00:00Z', marks: null, rubric: null, feedback: '', graded: false }
];

const INITIAL_CONTENTS = [
  { id: 'cnt1', courseId: 'c1', title: 'Introduction to Kinematics', type: 'video', url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', desc: 'Covering basic particle motion and frames of reference.' },
  { id: 'cnt2', courseId: 'c1', title: 'Work-Energy Theorem Notes', type: 'pdf', url: 'work_energy_notes.pdf', desc: 'Derivation and examples of work-energy integrations.' },
  { id: 'cnt3', courseId: 'c2', title: 'Binary Search Tree Slides', type: 'slides', url: 'bst_lecture.pptx', desc: 'Lecture presentation covering tree balancing algorithms.' }
];

const INITIAL_LIVE_CLASSES = [
  { id: 'lc1', courseId: 'c1', title: 'Quantum Mechanics Q&A Session', dateTime: '2026-07-06T10:00', duration: 60, status: 'Scheduled', url: 'https://meet.google.com/abc-defg-hij', recordingUrl: '' },
  { id: 'lc2', courseId: 'c2', title: 'Recursion & Dynamic Programming Review', dateTime: '2026-07-03T15:00', duration: 90, status: 'Completed', url: '', recordingUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4' }
];

const INITIAL_QUIZZES = [
  { id: 'q1', title: 'Calculus Derivatives Pop Quiz', start: '2026-07-05T09:00', end: '2026-07-05T10:00', duration: 30, status: 'Published', questions: [
    { id: 'q1_1', type: 'mcq-single', text: 'What is the derivative of sin(x)?', options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correct: 0 },
    { id: 'q1_2', type: 'mcq-multiple', text: 'Which of the following functions are differentiable at x=0? (Select all that apply)', options: ['f(x)=|x|', 'f(x)=x^2', 'f(x)=sin(x)', 'f(x)=x^(1/3)'], correct: [1, 2] },
    { id: 'q1_3', type: 'descriptive', text: 'Explain the geometric meaning of the derivative of a function.', correct: null }
  ]},
  { id: 'q2', title: 'Data Structures Tree Operations Quiz', start: '2026-07-10T14:00', end: '2026-07-10T15:00', duration: 45, status: 'Pending', questions: [] }
];

const INITIAL_QUIZ_ATTEMPTS = [
  { id: 'att1', quizId: 'q1', studentName: 'Rahul Student', score: null, evaluated: false, answers: { q1_1: '0', q1_2: [1, 2], q1_3: 'The derivative represents the slope of the tangent line to the curve at a given point.' }, remarks: '', allowedReattempt: false }
];

const INITIAL_FORUMS = [
  { id: 'fg1', name: 'Physics Mechanics Discussion', members: ['Faculty John', 'Rahul Student', 'Priya Parent'], createdBy: 'Faculty John' },
  { id: 'fg2', name: 'CS Data Structures QA Forum', members: ['Faculty John', 'Rahul Student'], createdBy: 'Faculty John' }
];

const INITIAL_MESSAGES = {
  'fg1': [
    { sender: 'Faculty John', senderRole: 'teacher', text: 'Hello everyone! Please post any questions about homework 1 here.', timestamp: '2026-07-03T09:00:00Z' },
    { sender: 'Rahul Student', senderRole: 'student', text: 'I am stuck on question 4 about orbits. Any hints?', timestamp: '2026-07-03T10:15:00Z' },
    { sender: 'Priya Parent', senderRole: 'parent', text: 'Thank you for this group. Rahul is working hard on this!', timestamp: '2026-07-04T08:00:00Z' }
  ],
  'fg2': [
    { sender: 'Faculty John', senderRole: 'teacher', text: 'The BST practical due date is extended by 2 days.', timestamp: '2026-07-04T11:00:00Z' }
  ]
};

const MOCK_ANALYTICS = {
  quizScores: [
    { name: 'Quiz 1', classAvg: 78, studentScore: 85 },
    { name: 'Quiz 2', classAvg: 65, studentScore: 72 },
    { name: 'Quiz 3', classAvg: 80, studentScore: 92 },
    { name: 'Quiz 4', classAvg: 72, studentScore: 68 }
  ],
  examGrades: [
    { name: 'Unit Test I', max: 50, avg: 38, student: 42 },
    { name: 'Midterm', max: 100, avg: 74, student: 84 },
    { name: 'Unit Test II', max: 50, avg: 41, student: 46 }
  ],
  attendance: [
    { month: 'Jan', percent: 95 },
    { month: 'Feb', percent: 92 },
    { month: 'Mar', percent: 96 },
    { month: 'Apr', percent: 89 },
    { month: 'May', percent: 94 },
    { month: 'Jun', percent: 98 }
  ],
  behavior: [
    { week: 'W1', score: 4.5 },
    { week: 'W2', score: 4.8 },
    { week: 'W3', score: 4.2 },
    { week: 'W4', score: 4.9 }
  ]
};

// ==========================================
// MAIN COMPONENT ENTRY POINT
// ==========================================
export default function LmsDashboard() {
  const { user } = useAuth();
  const role = user?.role || ROLES.ADMIN;
  const location = useLocation();
  const path = location.pathname;

  // Determine activeTab based on current URL path
  let activeTab = 'courses';
  let pageTitle = 'Course Management';
  let breadcrumbLabel = 'Course Management';

  if (path.includes('/lms/quizzes')) {
    activeTab = 'quizzes';
    pageTitle = 'Online Quizzes';
    breadcrumbLabel = 'Online Quizzes';
  } else if (path.includes('/lms/forum')) {
    activeTab = 'forums';
    pageTitle = 'Discussion Forum';
    breadcrumbLabel = 'Discussion Forum';
  } else if (path.includes('/lms/progress')) {
    activeTab = 'progress';
    pageTitle = 'Progress & Analytics';
    breadcrumbLabel = 'Progress & Analytics';
  }

  // --- Dynamic Shared State ---
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [quizAttempts, setQuizAttempts] = useState(INITIAL_QUIZ_ATTEMPTS);
  const [forumGroups, setForumGroups] = useState(INITIAL_FORUMS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  
  // New States
  const [courseContents, setCourseContents] = useState(INITIAL_CONTENTS);
  const [liveClasses, setLiveClasses] = useState(INITIAL_LIVE_CLASSES);

  // --- API Integrations for Real Spring Boot Backend ---
  useEffect(() => {
    let active = true;
    const fetchBackendData = async () => {
      try {
        // 1. Fetch Classes (Courses)
        const classRes = await api.get('/api/v1/academics/classes');
        const classData = classRes.data?.data || classRes.data || [];
        if (active && classData.length > 0) {
          setCourses(classData.map(c => ({
            id: String(c.id),
            name: c.className || `Class ${c.id}`
          })));
        }
      } catch (err) {
        console.warn("Could not load real classes from backend, using fallbacks.");
      }

      try {
        // 2. Fetch Homeworks (Assignments)
        const hwRes = await api.get('/api/v1/homework');
        const hwData = hwRes.data?.data || hwRes.data || [];
        if (active && hwData.length > 0) {
          const formattedHws = hwData.map((hw) => ({
            id: String(hw.id),
            courseId: String(hw.classId),
            title: hw.description?.split('\n')[0] || `Homework Task ${hw.id}`,
            description: hw.description || 'No description provided.',
            dueDate: hw.submissionDate || '2026-07-20',
            maxMarks: 100, // standard default
            submissionsCount: 0
          }));
          setAssignments(formattedHws);

          // Fetch submissions for loaded homeworks
          for (let hw of formattedHws) {
            try {
              const subRes = await api.get(`/api/v1/homework/submissions/${hw.id}`);
              const subData = subRes.data?.data || subRes.data || [];
              if (active && subData.length > 0) {
                const formattedSubs = subData.map(sub => ({
                  id: String(sub.id),
                  assignmentId: String(sub.homeworkId),
                  studentName: sub.studentId === 1 ? 'Rahul Student' : `Student ID ${sub.studentId}`,
                  submissionText: sub.file ? `Submitted file: ${sub.file}` : 'Completed homework submission.',
                  fileUrl: sub.file || 'homework_work.pdf',
                  submittedAt: new Date().toISOString(),
                  marks: sub.marks ? Number(sub.marks) : null,
                  rubric: sub.marks ? { accuracy: 9, completeness: 9, presentation: 9 } : null,
                  feedback: sub.marks ? 'Constructive feedback published.' : '',
                  graded: !!sub.marks
                }));

                // Update submissions list
                setSubmissions(prev => {
                  const filtered = prev.filter(p => p.assignmentId !== String(hw.id));
                  return [...filtered, ...formattedSubs];
                });

                // Update assignment submissions count
                setAssignments(prev => prev.map(p => p.id === hw.id ? { ...p, submissionsCount: formattedSubs.length } : p));
              }
            } catch (err) {
              // Ignore failure for individual task submissions
            }
          }
        }
      } catch (err) {
        console.warn("Could not load real homeworks from backend, using fallbacks.");
      }
    };

    fetchBackendData();
    return () => { active = false; };
  }, []);

  return (
    <>
      <PageHeader 
        title={pageTitle} 
        breadcrumbs={[{ label: 'LMS' }, { label: breadcrumbLabel }]} 
      />

      {/* Role Banner */}
      <div className="alert alert-info mb-4" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Info size={18} />
        <div>
          Logged in as <strong>{user?.name || 'Administrator'}</strong> ({role.replace(/_/g, ' ').toUpperCase()}). 
          Your interface is dynamically customized with Role-Based Access Controls (RBAC).
        </div>
      </div>

      <div className="row">
        {/* Right Hand Dashboard Tab Content (Full Width) */}
        <div className="col-12">
          {activeTab === 'courses' && (
            <CourseManagementTab 
              role={role}
              courses={courses}
              assignments={assignments}
              setAssignments={setAssignments}
              submissions={submissions}
              setSubmissions={setSubmissions}
              courseContents={courseContents}
              setCourseContents={setCourseContents}
              liveClasses={liveClasses}
              setLiveClasses={setLiveClasses}
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizAssessmentTab 
              role={role}
              quizzes={quizzes}
              setQuizzes={setQuizzes}
              quizAttempts={quizAttempts}
              setQuizAttempts={setQuizAttempts}
            />
          )}

          {activeTab === 'forums' && (
            <DiscussionForumTab 
              role={role}
              userName={user?.name || 'User'}
              forumGroups={forumGroups}
              setForumGroups={setForumGroups}
              messages={messages}
              setMessages={setMessages}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressTrackingTab 
              role={role}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ==========================================
// MODULE 1: COURSE MANAGEMENT TAB
// ==========================================
function CourseManagementTab({ 
  role, courses, assignments, setAssignments, submissions, setSubmissions,
  courseContents, setCourseContents, liveClasses, setLiveClasses
}) {
  const [innerTab, setInnerTab] = useState('assignments'); // 'assignments' | 'resources' | 'live'
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(null); // stores active submission
  const [showSubmitModal, setShowSubmitModal] = useState(null); // stores active assignment for student
  
  // Resource/Content Upload States
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState('pdf');
  const [resDesc, setResDesc] = useState('');
  const [resUrl, setResUrl] = useState('lecture_resource.pdf');
  const [resCourse, setResCourse] = useState('c1');

  // Media Viewer Modals
  const [activeVideo, setActiveVideo] = useState(null);
  const [activePdf, setActivePdf] = useState(null);
  const [activeSlides, setActiveSlides] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [pdfZoom, setPdfZoom] = useState(100);

  // Live Class Scheduling States
  const [showLiveForm, setShowLiveForm] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [liveDate, setLiveDate] = useState('');
  const [liveDur, setLiveDur] = useState(60);
  const [liveUrl, setLiveUrl] = useState('https://meet.google.com/abc-defg-hij');
  const [liveCourse, setLiveCourse] = useState('c1');

  // Recording upload state
  const [recordingModal, setRecordingModal] = useState(null);
  const [recUrl, setRecUrl] = useState('https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4');

  // Assignment Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('c1');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);

  // Student Submit State
  const [subText, setSubText] = useState('');
  const [subFile, setSubFile] = useState('assignment_work.pdf');

  // Faculty Grading State (Rubrics)
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [rubricAccuracy, setRubricAccuracy] = useState(10);
  const [rubricCompleteness, setRubricCompleteness] = useState(10);
  const [rubricPresentation, setRubricPresentation] = useState(10);

  // Auto-calculated marks based on rubrics (weighted max assignment marks)
  const calculateTotalMarks = (max) => {
    const accuracy = Number(rubricAccuracy);
    const completeness = Number(rubricCompleteness);
    const presentation = Number(rubricPresentation);
    
    // total score out of 30, scaled to assignment maxMarks
    const pct = (accuracy + completeness + presentation) / 30;
    return Math.round(pct * max);
  };

  const getLetterGrade = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 90) return 'A';
    if (pct >= 80) return 'B';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
  };

  // Handle Faculty creating assignment
  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAssign = {
      id: 'a' + (assignments.length + 1),
      courseId: selectedCourse,
      title: newTitle.trim(),
      description: newDesc.trim(),
      dueDate: dueDate || '2026-07-30',
      maxMarks: Number(maxMarks),
      submissionsCount: 0
    };

    setAssignments([newAssign, ...assignments]);
    setShowAddForm(false);
    setNewTitle('');
    setNewDesc('');
  };

  // Handle Student submitting assignment
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const assignmentId = showSubmitModal.id;

    // Call real backend submit API
    try {
      await api.post(`/api/v1/homework/submit?homeworkId=${assignmentId}&studentId=1&file=${subFile}`);
    } catch (err) {
      console.warn("Backend submit failed, running local simulator.", err);
    }

    // Check if duplicate submission
    const existingIndex = submissions.findIndex(s => s.assignmentId === assignmentId && s.studentName === 'Rahul Student');

    const newSub = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : 'sub' + (submissions.length + 1),
      assignmentId,
      studentName: 'Rahul Student',
      submissionText: subText,
      fileUrl: subFile,
      submittedAt: new Date().toISOString(),
      marks: null,
      rubric: null,
      feedback: '',
      graded: false
    };

    if (existingIndex >= 0) {
      const updated = [...submissions];
      updated[existingIndex] = newSub;
      setSubmissions(updated);
    } else {
      setSubmissions([newSub, ...submissions]);
      setAssignments(assignments.map(a => a.id === assignmentId ? { ...a, submissionsCount: a.submissionsCount + 1 } : a));
    }

    setShowSubmitModal(null);
    setSubText('');
  };

  // Handle Faculty grading submission with rubrics
  const handleGradingSubmit = async (e) => {
    e.preventDefault();
    const maxVal = assignments.find(a => a.id === showGradingModal.assignmentId)?.maxMarks || 100;
    const finalMarks = calculateTotalMarks(maxVal);

    // Call real backend evaluate API
    try {
      await api.post(`/api/v1/homework/evaluate?homeworkId=${showGradingModal.assignmentId}&studentId=1&marks=${finalMarks}&status=C`);
    } catch (err) {
      console.warn("Backend evaluate failed, running local simulator.", err);
    }
    
    setSubmissions(submissions.map(s => 
      s.id === showGradingModal.id 
        ? { 
            ...s, 
            marks: finalMarks, 
            feedback: gradeFeedback, 
            graded: true,
            rubric: {
              accuracy: Number(rubricAccuracy),
              completeness: Number(rubricCompleteness),
              presentation: Number(rubricPresentation)
            }
          } 
        : s
    ));
    
    setShowGradingModal(null);
    setGradeFeedback('');
    setRubricAccuracy(10);
    setRubricCompleteness(10);
    setRubricPresentation(10);
  };

  // Handle Content Upload
  const handleUploadContent = (e) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    const newContent = {
      id: 'cnt' + (courseContents.length + 1),
      courseId: resCourse,
      title: resTitle.trim(),
      type: resType,
      url: resUrl,
      desc: resDesc.trim()
    };

    setCourseContents([newContent, ...courseContents]);
    setShowUploadForm(false);
    setResTitle('');
    setResDesc('');
  };

  // Handle Live Class Scheduling
  const handleScheduleLive = (e) => {
    e.preventDefault();
    if (!liveTitle.trim()) return;

    const newLive = {
      id: 'lc' + (liveClasses.length + 1),
      courseId: liveCourse,
      title: liveTitle.trim(),
      dateTime: liveDate || '2026-07-06T10:00',
      duration: Number(liveDur),
      status: 'Scheduled',
      url: liveUrl,
      recordingUrl: ''
    };

    setLiveClasses([newLive, ...liveClasses]);
    setShowLiveForm(false);
    setLiveTitle('');
  };

  // Handle Recording Upload
  const handlePublishRecording = (e) => {
    e.preventDefault();
    setLiveClasses(liveClasses.map(lc => 
      lc.id === recordingModal.id 
        ? { ...lc, status: 'Completed', recordingUrl: recUrl } 
        : lc
    ));
    setRecordingModal(null);
    setRecUrl('https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4');
  };

  const isTeacher = role === 'teacher' || role === 'admin';
  const isStudent = role === 'student';
  const isParent = role === 'parent';

  return (
    <div>
      {/* Sub tabs in Course Management */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button onClick={() => setInnerTab('assignments')} style={styles.innerTabButton(innerTab === 'assignments')}>
          Assignments Portal
        </button>
        <button onClick={() => setInnerTab('resources')} style={styles.innerTabButton(innerTab === 'resources')}>
          Learning Content (PDF, Video, Slides)
        </button>
        <button onClick={() => setInnerTab('live')} style={styles.innerTabButton(innerTab === 'live')}>
          Live Classes & Recordings
        </button>
      </div>

      {/* ==========================================
          SUB-TAB 1: ASSIGNMENTS PORTAL
          ========================================== */}
      {innerTab === 'assignments' && (
        <WhiteCard 
          title="Assignments Portal" 
          actions={isTeacher && (
            <button className="primary_btn btn_sm" onClick={() => setShowAddForm(true)}>
              <Plus size={14} /> New Assignment
            </button>
          )}
        >
          {/* Create Assignment Form */}
          {showAddForm && (
            <div style={{ padding: '16px', background: '#f8f8ff', border: '1px solid #e8e4ff', borderRadius: '6px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h5 style={{ fontWeight: 600 }}>Create Assignment</h5>
                <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
              </div>
              <form onSubmit={handleAddAssignment}>
                <FormGroup label="Course" required={true}>
                  <select className="form-control" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Assignment Title" required={true}>
                  <input type="text" className="form-control" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Lab Report 2" required />
                </FormGroup>
                <FormGroup label="Instructions / Description">
                  <textarea className="form-control" rows={3} value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Provide detailed steps..." />
                </FormGroup>
                <div className="row">
                  <div className="col-6">
                    <FormGroup label="Due Date" required={true}>
                      <input type="date" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                    </FormGroup>
                  </div>
                  <div className="col-6">
                    <FormGroup label="Max Marks" required={true}>
                      <input type="number" className="form-control" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} required min={1} />
                    </FormGroup>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary-outline" onClick={() => setShowAddForm(false)}>Cancel</button>
                  <button type="submit" className="primary_btn">Publish Assignment</button>
                </div>
              </form>
            </div>
          )}

          {/* Assignment list */}
          <div>
            {assignments.map(a => {
              const course = courses.find(c => c.id === a.courseId);
              const mySub = submissions.find(s => s.assignmentId === a.id && s.studentName === 'Rahul Student');
              const allSubs = submissions.filter(s => s.assignmentId === a.id);
              
              return (
                <div key={a.id} className="white_card" style={{ border: '1px solid var(--border-color)', boxShadow: 'none', marginBottom: '16px' }}>
                  <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <Badge type="info">{course ? course.name : 'General'}</Badge>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, marginTop: '8px', color: 'var(--text-dark)' }}>{a.title}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', marginTop: '4px', whiteSpace: 'pre-line' }}>{a.description}</p>
                      
                      <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span><Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Due: <strong>{a.dueDate}</strong></span>
                        <span>Max Marks: <strong>{a.maxMarks}</strong></span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Faculty Grading panel */}
                      {isTeacher && (
                        <>
                          <Badge type={a.submissionsCount > 0 ? 'success' : 'warning'}>
                            {a.submissionsCount} Submissions
                          </Badge>
                          {a.submissionsCount > 0 && (
                            <div style={{ marginTop: '8px' }}>
                              <h6 style={{ fontSize: '11px', fontWeight: 600, textAlign: 'left', marginBottom: '4px' }}>Review Submissions:</h6>
                              {allSubs.map(s => (
                                <button 
                                  key={s.id} 
                                  className="btn-secondary-outline btn_sm" 
                                  onClick={() => { setShowGradingModal(s); }}
                                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '4px 8px', marginBottom: '4px' }}
                                >
                                  <FileText size={12} /> {s.studentName} {s.graded ? `(${s.marks}/${a.maxMarks})` : '(Pending)'}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}

                      {/* Student view */}
                      {isStudent && (
                        <>
                          {mySub ? (
                            <>
                              <Badge type={mySub.graded ? 'success' : 'info'}>
                                {mySub.graded ? `Graded: ${mySub.marks} / ${a.maxMarks}` : 'Submitted (Pending Review)'}
                              </Badge>
                              {new Date(a.dueDate) > new Date() && (
                                <button className="btn-secondary-outline btn_sm" onClick={() => { setShowSubmitModal(a); setSubText(mySub.submissionText); }}>
                                  Edit Submission
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <Badge type="danger">Not Submitted</Badge>
                              <button className="primary_btn btn_sm" onClick={() => setShowSubmitModal(a)}>
                                <UploadCloud size={12} /> Upload Work
                              </button>
                            </>
                          )}
                        </>
                      )}

                      {/* Parent view */}
                      {isParent && (
                        <>
                          {mySub ? (
                            <Badge type={mySub.graded ? 'success' : 'info'}>
                              {mySub.graded ? `Rahul's Grade: ${mySub.marks} / ${a.maxMarks}` : 'Submitted (Pending Review)'}
                            </Badge>
                          ) : (
                            <Badge type="danger">Rahul Not Submitted</Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Gradings & Detailed Rubrics Card */}
                  {mySub && mySub.graded && (
                    <div style={{ background: '#f8f9fa', borderTop: '1px solid #eee', padding: '14px 16px', fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                        <div>
                          <strong>Evaluated Grade:</strong> 
                          <span className="badge badge-purple" style={{ marginLeft: '6px', fontSize: '12px' }}>
                            Grade {getLetterGrade(mySub.marks, a.maxMarks)}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Feedback published by Faculty
                        </div>
                      </div>

                      {mySub.rubric && (
                        <div style={{ display: 'flex', gap: '20px', margin: '10px 0', padding: '10px', background: '#fff', borderRadius: '4px', border: '1px solid #eef' }}>
                          <div>Accuracy: <strong style={{ color: 'var(--primary-color)' }}>{mySub.rubric.accuracy}/10</strong></div>
                          <div>Completeness: <strong style={{ color: 'var(--primary-color)' }}>{mySub.rubric.completeness}/10</strong></div>
                          <div>Presentation: <strong style={{ color: 'var(--primary-color)' }}>{mySub.rubric.presentation}/10</strong></div>
                        </div>
                      )}

                      <div style={{ marginTop: '6px' }}>
                        <strong>Remarks & Feedback:</strong> <span style={{ color: 'var(--text-muted)' }}>"{mySub.feedback}"</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </WhiteCard>
      )}

      {/* ==========================================
          SUB-TAB 2: LEARNING CONTENT & RESOURCES
          ========================================== */}
      {innerTab === 'resources' && (
        <WhiteCard
          title="Course Resources & Materials"
          actions={isTeacher && (
            <button className="primary_btn btn_sm" onClick={() => setShowUploadForm(true)}>
              <UploadCloud size={14} /> Upload Content
            </button>
          )}
        >
          {/* Faculty Resource Upload Form */}
          {showUploadForm && (
            <div style={{ padding: '16px', background: '#f8f8ff', border: '1px solid #e8e4ff', borderRadius: '6px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h5 style={{ fontWeight: 600 }}>Upload Content File</h5>
                <button onClick={() => setShowUploadForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
              </div>
              <form onSubmit={handleUploadContent}>
                <FormGroup label="Course" required={true}>
                  <select className="form-control" value={resCourse} onChange={e => setResCourse(e.target.value)}>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Resource Title" required={true}>
                  <input type="text" className="form-control" value={resTitle} onChange={e => setResTitle(e.target.value)} placeholder="e.g. Chapter 3 Vector Fields Slides" required />
                </FormGroup>
                <FormGroup label="Content Type" required={true}>
                  <select className="form-control" value={resType} onChange={e => setResType(e.target.value)}>
                    <option value="pdf">PDF Document / Handout</option>
                    <option value="video">Lecture Video (MP4)</option>
                    <option value="slides">PowerPoint / Presentation Slides</option>
                  </select>
                </FormGroup>
                <FormGroup label="Simulated File Name" required={true}>
                  <input type="text" className="form-control" value={resUrl} onChange={e => setResUrl(e.target.value)} required />
                </FormGroup>
                <FormGroup label="Description">
                  <textarea className="form-control" rows={2} value={resDesc} onChange={e => setResDesc(e.target.value)} placeholder="What should students focus on?" />
                </FormGroup>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary-outline" onClick={() => setShowUploadForm(false)}>Cancel</button>
                  <button type="submit" className="primary_btn">Upload Resource</button>
                </div>
              </form>
            </div>
          )}

          {/* Resources listing */}
          <div className="row">
            {courseContents.map(cnt => {
              const course = courses.find(c => c.id === cnt.courseId);
              return (
                <div key={cnt.id} className="col-12 col-md-6 mb-3">
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '16px', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Badge type="purple">{course ? course.name : 'General'}</Badge>
                        {cnt.type === 'video' && <Video size={16} className="text-muted" />}
                        {cnt.type === 'pdf' && <FileText size={16} className="text-muted" />}
                        {cnt.type === 'slides' && <Presentation size={16} className="text-muted" />}
                      </div>
                      <h5 style={{ fontWeight: 600, fontSize: '13.5px', marginTop: '10px', color: 'var(--text-dark)' }}>{cnt.title}</h5>
                      <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', minHeight: '34px' }}>{cnt.desc}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px', borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
                      <button 
                        className="primary_btn btn_sm" 
                        style={{ flex: 1, justifyContent: 'center' }}
                        onClick={() => {
                          if (cnt.type === 'video') setActiveVideo(cnt);
                          if (cnt.type === 'pdf') setActivePdf(cnt);
                          if (cnt.type === 'slides') setActiveSlides(cnt);
                        }}
                      >
                        <Eye size={12} /> View Material
                      </button>
                      
                      {isTeacher && (
                        <button 
                          className="btn-secondary-outline btn_sm" 
                          onClick={() => setCourseContents(courseContents.filter(x => x.id !== cnt.id))}
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </WhiteCard>
      )}

      {/* ==========================================
          SUB-TAB 3: LIVE CLASSES & RECORDINGS
          ========================================== */}
      {innerTab === 'live' && (
        <WhiteCard
          title="Live Virtual Classes Schedule"
          actions={isTeacher && (
            <button className="primary_btn btn_sm" onClick={() => setShowLiveForm(true)}>
              <Video size={14} /> Schedule Live Class
            </button>
          )}
        >
          {/* Live class schedule form */}
          {showLiveForm && (
            <div style={{ padding: '16px', background: '#f8f8ff', border: '1px solid #e8e4ff', borderRadius: '6px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h5 style={{ fontWeight: 600 }}>Schedule Live Class Room</h5>
                <button onClick={() => setShowLiveForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
              </div>
              <form onSubmit={handleScheduleLive}>
                <FormGroup label="Course" required={true}>
                  <select className="form-control" value={liveCourse} onChange={e => setLiveCourse(e.target.value)}>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Lecture Title" required={true}>
                  <input type="text" className="form-control" value={liveTitle} onChange={e => setLiveTitle(e.target.value)} placeholder="e.g. Weekly Doubts Clearing Seminar" required />
                </FormGroup>
                <div className="row">
                  <div className="col-6">
                    <FormGroup label="Date & Start Time" required={true}>
                      <input type="datetime-local" className="form-control" value={liveDate} onChange={e => setLiveDate(e.target.value)} required />
                    </FormGroup>
                  </div>
                  <div className="col-6">
                    <FormGroup label="Duration (Mins)" required={true}>
                      <input type="number" className="form-control" value={liveDur} onChange={e => setLiveDur(e.target.value)} required />
                      {liveDur && (
                        <div style={{ fontSize: '11px', color: '#7C32FF', marginTop: '4px', fontWeight: 600 }}>
                          ⏱️ {formatDurationToHours(liveDur)}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                </div>
                <FormGroup label="Virtual Room URL" required={true}>
                  <input type="url" className="form-control" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} required />
                </FormGroup>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary-outline" onClick={() => setShowLiveForm(false)}>Cancel</button>
                  <button type="submit" className="primary_btn">Schedule Room</button>
                </div>
              </form>
            </div>
          )}

          {/* Classes Listing */}
          <div>
            <h5 style={{ fontWeight: 600, fontSize: '13px', marginBottom: '14px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>Upcoming Live Classes</h5>
            {liveClasses.filter(c => c.status === 'Scheduled').map(lc => {
              const course = courses.find(c => c.id === lc.courseId);
              return (
                <div key={lc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '12px', background: '#fcfcff' }}>
                  <div>
                    <Badge type="info">{course ? course.name : 'General'}</Badge>
                    <h5 style={{ fontWeight: 600, fontSize: '13.5px', marginTop: '6px' }}>{lc.title}</h5>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>Date/Time: <strong>{new Date(lc.dateTime).toLocaleString()}</strong></span>
                      <span>Duration: <strong>{lc.duration} Mins</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a href={lc.url} target="_blank" rel="noreferrer" className="primary_btn btn_sm" style={{ textDecoration: 'none' }}>
                      <ExternalLink size={12} style={{ marginRight: '4px' }} /> Join Lecture Room
                    </a>
                    {isTeacher && (
                      <button className="btn-secondary-outline btn_sm" onClick={() => setRecordingModal(lc)}>
                        Record / Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <h5 style={{ fontWeight: 600, fontSize: '13px', marginTop: '24px', marginBottom: '14px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>Past Classes & Recordings</h5>
            {liveClasses.filter(c => c.status === 'Completed').map(lc => {
              const course = courses.find(c => c.id === lc.courseId);
              return (
                <div key={lc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '12px', background: '#fff' }}>
                  <div>
                    <Badge type="success">Completed</Badge>
                    <h5 style={{ fontWeight: 600, fontSize: '13.5px', marginTop: '6px' }}>{lc.title}</h5>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Conducted on: <strong>{new Date(lc.dateTime).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div>
                    {lc.recordingUrl ? (
                      <button 
                        className="primary_btn btn_sm" 
                        onClick={() => setActiveVideo({ title: `${lc.title} - Recording`, url: lc.recordingUrl })}
                      >
                        <Play size={12} style={{ marginRight: '4px' }} /> Watch Video Recording
                      </button>
                    ) : (
                      <Badge type="warning">No Recording Available</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </WhiteCard>
      )}

      {/* ==========================================
          MODALS & OVERLAY MEDIA VIEWERS
          ========================================== */}

      {/* 1. Video Player Modal */}
      {activeVideo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '750px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', background: '#fafafa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Video size={16} /> {activeVideo.title}</h5>
              <button onClick={() => setActiveVideo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '10px', background: '#000', display: 'flex', justifyContent: 'center' }}>
              {/* HTML5 Video Player */}
              <video controls style={{ width: '100%', maxHeight: '420px' }}>
                <source src={activeVideo.url} type="video/mp4" />
                Your browser does not support HTML5 video tag.
              </video>
            </div>
            <div style={{ padding: '16px 20px', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#999' }}>Simulated Video Stream Player</span>
              <button className="btn-secondary-outline btn_sm" onClick={() => setActiveVideo(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PDF Handout Reader Modal */}
      {activePdf && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '700px', height: '90vh', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '14px 20px', background: '#fafafa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> {activePdf.title}</h5>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button onClick={() => setPdfZoom(z => Math.max(z - 10, 50))} style={{ padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}><ZoomOut size={16} /></button>
                <span style={{ fontSize: '11.5px', color: '#666' }}>{pdfZoom}%</span>
                <button onClick={() => setPdfZoom(z => Math.min(z + 10, 150))} style={{ padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}><ZoomIn size={16} /></button>
              </div>
              <button onClick={() => setActivePdf(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}><X size={18} /></button>
            </div>
            
            {/* Page body */}
            <div style={{ flex: 1, background: '#525659', overflow: 'auto', padding: '20px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: '#fff',
                width: '100%',
                maxWidth: '560px',
                minHeight: '680px',
                padding: '40px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                transform: `scale(${pdfZoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease',
                fontFamily: 'serif',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                <h3 style={{ textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>{activePdf.title}</h3>
                <h6 style={{ textAlign: 'center', color: '#777', fontStyle: 'italic', marginBottom: '30px' }}>LMS Handout Series & Notes</h6>
                <p><strong>Section 1: Foundations and Derivatives</strong></p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum congue neque, at dictum justo semper a. In id urna vitae ligula pellentesque porta. Proin lobortis lorem vel nunc rhoncus condimentum.</p>
                <p>Pellentesque hendrerit elit eget ante dictum, vel elementum eros efficitur. Integer nec erat eros. Sed varius tortor vitae congue tempus. Proin a feugiat lectus. Ut sed tempor nisl, vitae cursus purus.</p>
                <p>Duis sed finibus purus. Donec ut diam in eros laoreet porttitor ac vel sem. Sed ultrices ante non tellus sodales tempor. Ut rhoncus tortor sit amet quam consequat luctus.</p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 20px', background: '#fafafa', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#888' }}>Page 1 of 5 (Simulated PDF Reader)</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary-outline btn_sm"><Download size={12} /> Download PDF</button>
                <button className="btn-secondary-outline btn_sm" onClick={() => setActivePdf(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Slides Viewer Modal */}
      {activeSlides && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '720px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', background: '#fafafa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Presentation size={16} /> Lecture Slide Deck</h5>
              <button onClick={() => setActiveSlides(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}><X size={18} /></button>
            </div>
            
            {/* Slide Area */}
            <div style={{ padding: '40px 20px', background: '#1e1e1e', color: '#fff', display: 'flex', justifyContent: 'center', minHeight: '360px' }}>
              <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #444', padding: '24px', background: '#2d2d2d', borderRadius: '4px' }}>
                {slideIndex === 0 && (
                  <div>
                    <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '12px', color: 'var(--primary-color)' }}>{activeSlides.title}</h3>
                    <p style={{ marginTop: '20px', fontSize: '15px' }}>Introduction and Concept Formulations</p>
                    <p style={{ color: '#aaa', fontSize: '12.5px' }}>• Scope of the module<br />• Key theorems<br />• Basic practical cases</p>
                  </div>
                )}
                {slideIndex === 1 && (
                  <div>
                    <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '12px' }}>Methodology Overview</h3>
                    <p style={{ marginTop: '20px', fontSize: '14px' }}>How to solve balanced tree traversals:</p>
                    <p style={{ color: '#aaa', fontSize: '12.5px' }}>1. Left node traversing<br />2. Right node evaluation<br />3. Node rotation constraints</p>
                  </div>
                )}
                {slideIndex === 2 && (
                  <div>
                    <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '12px' }}>Exercises & Next Steps</h3>
                    <p style={{ marginTop: '20px', fontSize: '14px' }}>For the homework submission:</p>
                    <p style={{ color: '#aaa', fontSize: '12.5px' }}>• Complete tree node counts exercise<br />• Submit the index.js before due date</p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', borderTop: '1px solid #444', paddingTop: '14px', fontSize: '11px', color: '#aaa' }}>
                  <span>Slide {slideIndex + 1} of 3</span>
                  <span>TIS ERP LMS</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '14px 20px', background: '#fafafa', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary-outline btn_sm" disabled={slideIndex === 0} onClick={() => setSlideIndex(s => s - 1)}><ChevronLeft size={12} /> Prev Slide</button>
                <button className="btn-secondary-outline btn_sm" disabled={slideIndex === 2} onClick={() => setSlideIndex(s => s + 1)}>Next Slide <ChevronRight size={12} /></button>
              </div>
              <button className="btn-secondary-outline btn_sm" onClick={() => setActiveSlides(null)}>Close Presentation</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Live Class Record Completion Modal */}
      {recordingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '460px', padding: '24px' }}>
            <h5 style={{ fontWeight: 600, marginBottom: '14px' }}>Publish Lecture Recording</h5>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Complete and upload lecture recording for: <strong>{recordingModal.title}</strong>
            </p>
            <form onSubmit={handlePublishRecording}>
              <FormGroup label="Simulated Recording URL" required={true}>
                <input type="text" className="form-control" value={recUrl} onChange={e => setRecUrl(e.target.value)} required />
              </FormGroup>
              <div style={{ display: 'flex', justify: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn-secondary-outline" onClick={() => setRecordingModal(null)}>Cancel</button>
                <button type="submit" className="primary_btn">Complete & Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Grading Modal (With Advanced Rubrics) */}
      {showGradingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '540px', padding: '24px' }}>
            <h5 style={{ fontWeight: 600, marginBottom: '14px' }}>Grade Submission: Rubrics Evaluator</h5>
            <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '12.5px' }}>
              <div><strong>Student:</strong> {showGradingModal.studentName}</div>
              <div><strong>Submitted Comment:</strong> "{showGradingModal.submissionText}"</div>
              <div><strong>Attached File:</strong> <a href="#file" style={{ color: 'var(--primary-color)' }}>{showGradingModal.fileUrl}</a></div>
            </div>
            
            <form onSubmit={handleGradingSubmit}>
              <div style={{ padding: '14px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '16px', background: '#fafaff' }}>
                <h6 style={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-color)', marginBottom: '12px' }}>
                  Rubric Assessment Criteria (Scores: 1-10)
                </h6>
                
                <div className="row">
                  <div className="col-4">
                    <FormGroup label="Accuracy">
                      <input type="number" className="form-control" min={0} max={10} value={rubricAccuracy} onChange={e => setRubricAccuracy(e.target.value)} required />
                    </FormGroup>
                  </div>
                  <div className="col-4">
                    <FormGroup label="Completeness">
                      <input type="number" className="form-control" min={0} max={10} value={rubricCompleteness} onChange={e => setRubricCompleteness(e.target.value)} required />
                    </FormGroup>
                  </div>
                  <div className="col-4">
                    <FormGroup label="Presentation">
                      <input type="number" className="form-control" min={0} max={10} value={rubricPresentation} onChange={e => setRubricPresentation(e.target.value)} required />
                    </FormGroup>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed #ccc', paddingTop: '10px', marginTop: '10px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Weighted Final Score:</strong> 
                  <span className="badge badge-purple" style={{ fontSize: '12px' }}>
                    {calculateTotalMarks(assignments.find(a => a.id === showGradingModal.assignmentId)?.maxMarks || 100)} / {assignments.find(a => a.id === showGradingModal.assignmentId)?.maxMarks || 100}
                  </span>
                </div>
              </div>

              <FormGroup label="Remarks / Constructive Feedback" required={true}>
                <textarea className="form-control" rows={3} value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)} placeholder="e.g. Nicely formatted vectors..." required />
              </FormGroup>

              <div style={{ display: 'flex', justify: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn-secondary-outline" onClick={() => setShowGradingModal(null)}>Cancel</button>
                <button type="submit" className="primary_btn">Submit Grading</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Submit Modal */}
      {showSubmitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '500px', padding: '24px' }}>
            <h5 style={{ fontWeight: 600, marginBottom: '14px' }}>Upload Assignment Work</h5>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Submitting for: <strong>{showSubmitModal.title}</strong>
            </p>
            <form onSubmit={handleStudentSubmit}>
              <FormGroup label="Submission Text / Comments" required={true}>
                <textarea className="form-control" rows={4} value={subText} onChange={e => setSubText(e.target.value)} placeholder="Type comments or description..." required />
              </FormGroup>
              <FormGroup label="Upload File (Simulated)">
                <input type="text" className="form-control" value={subFile} onChange={e => setSubFile(e.target.value)} placeholder="e.g. homework_v2.pdf" required />
              </FormGroup>
              <div style={{ display: 'flex', justify: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn-secondary-outline" onClick={() => setShowSubmitModal(null)}>Cancel</button>
                <button type="submit" className="primary_btn">Submit Work</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODULE 2: QUIZ & ASSESSMENT TAB
// ==========================================
function QuizAssessmentTab({ role, quizzes, setQuizzes, quizAttempts, setQuizAttempts }) {
  const [activeQuizBuilder, setActiveQuizBuilder] = useState(false);
  const [activeQuizAttempt, setActiveQuizAttempt] = useState(null); // stores active quiz object
  const [activeEvaluation, setActiveEvaluation] = useState(null); // stores active submission attempt

  // Live Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: val }
  const [quizTimer, setQuizTimer] = useState(0);
  const [markedForReview, setMarkedForReview] = useState([]); // array of question indices

  // Quiz Builder State
  const [quizTitle, setQuizTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState([]);
  
  // Question Builder states
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('mcq-single');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qImageUrl, setQImageUrl] = useState('');
  const [showQBank, setShowQBank] = useState(false);
  const [selectedAttemptReport, setSelectedAttemptReport] = useState(null);
  const [docxParsing, setDocxParsing] = useState(false);
  const [docxSuccess, setDocxSuccess] = useState(false);

  // Question Bank Mock Repository
  const QUESTION_BANK_REPO = [
    { id: 'qb1', type: 'mcq-single', text: 'What is the velocity of light in a vacuum?', options: ['3 x 10^8 m/s', '3 x 10^6 m/s', '1.5 x 10^8 m/s', '3 x 10^10 m/s'], correct: 0 },
    { id: 'qb2', type: 'mcq-single', text: 'Which data structure follows the Last-In-First-Out (LIFO) principle?', options: ['Queue', 'Linked List', 'Stack', 'Tree'], correct: 2 },
    { id: 'qb3', type: 'mcq-multiple', text: 'Select all prime numbers from the list below:', options: ['2', '4', '9', '11'], correct: [0, 3] },
    { id: 'qb4', type: 'descriptive', text: 'Explain the difference between a process and a thread.', correct: null }
  ];

  // AI Question Generator States
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiFile, setAiFile] = useState('');
  const [aiCount, setAiCount] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  // Timer interval reference
  const intervalRef = useRef(null);

  // AI Generation handler
  const handleAiGenerate = (e) => {
    e.preventDefault();
    if (!aiFile) {
      alert("Please select or specify a question source file.");
      return;
    }
    setAiGenerating(true);
    setTimeout(() => {
      const lowerName = aiFile.toLowerCase();
      let list = [];
      
      if (lowerName.includes("gravit") || lowerName.includes("physic")) {
        list = [
          { id: 'ai_' + Date.now() + '_1', type: 'mcq-single', text: 'Which of the following constants represents Newton\'s gravitational constant?', options: ['G = 6.674 x 10^-11 N m^2/kg^2', 'g = 9.8 m/s^2', 'c = 3.00 x 10^8 m/s', 'h = 6.626 x 10^-34 J s'], correct: 0, selected: true },
          { id: 'ai_' + Date.now() + '_2', type: 'mcq-single', text: 'What is the relationship between gravitational force and distance between two bodies?', options: ['Directly proportional', 'Inversely proportional to distance', 'Inversely proportional to square of distance', 'No relation'], correct: 2, selected: true },
          { id: 'ai_' + Date.now() + '_3', type: 'mcq-single', text: 'Where is the acceleration due to gravity (g) maximum on Earth\'s surface?', options: ['At the Equator', 'At the Poles', 'At the Center of Earth', 'At Mount Everest'], correct: 1, selected: true },
          { id: 'ai_' + Date.now() + '_4', type: 'descriptive', text: 'Define escape velocity and write its expression for Earth\'s surface.', correct: null, selected: true }
        ];
      } else if (lowerName.includes("tree") || lowerName.includes("data") || lowerName.includes("cs")) {
        list = [
          { id: 'ai_' + Date.now() + '_1', type: 'mcq-single', text: 'What is the worst-case time complexity of searching in a Binary Search Tree (BST)?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correct: 2, selected: true },
          { id: 'ai_' + Date.now() + '_2', type: 'mcq-single', text: 'Which traversal of a Binary Search Tree outputs the keys in sorted order?', options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'], correct: 1, selected: true },
          { id: 'ai_' + Date.now() + '_3', type: 'mcq-single', text: 'What is the maximum number of children a node in a binary tree can have?', options: ['1', '2', '3', 'Unlimited'], correct: 1, selected: true },
          { id: 'ai_' + Date.now() + '_4', type: 'descriptive', text: 'Explain the difference between a AVL Tree and a normal Binary Search Tree.', correct: null, selected: true }
        ];
      } else {
        list = [
          { id: 'ai_' + Date.now() + '_1', type: 'mcq-single', text: 'What is the primary method to optimize memory usage in web applications?', options: ['Garbage collection tuning', 'Caching static assets', 'Using small image formats', 'Code splitting and lazy loading'], correct: 3, selected: true },
          { id: 'ai_' + Date.now() + '_2', type: 'mcq-single', text: 'Which HTTP status code represents a successful REST request?', options: ['200 OK', '404 Not Found', '500 Internal Server Error', '302 Found'], correct: 0, selected: true },
          { id: 'ai_' + Date.now() + '_3', type: 'descriptive', text: 'Describe the main differences between relational databases and NoSQL databases.', correct: null, selected: true }
        ];
      }

      setGeneratedQuestions(list.slice(0, aiCount));
      setAiGenerating(false);
    }, 2000);
  };

  const handleAddAiQuestions = () => {
    const selected = generatedQuestions.filter(q => q.selected);
    if (selected.length === 0) {
      alert("Please select at least one question to add.");
      return;
    }
    const formatted = selected.map(({ selected, ...rest }) => rest);
    setQuestions([...questions, ...formatted]);
    setGeneratedQuestions([]);
    setShowAiGenerator(false);
    setAiFile('');
  };

  // Start attempt timer
  useEffect(() => {
    if (activeQuizAttempt) {
      setQuizTimer(activeQuizAttempt.duration * 60);
      intervalRef.current = setInterval(() => {
        setQuizTimer(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            // Auto submit
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeQuizAttempt]);

  const handleAutoSubmit = () => {
    alert("Time limit reached! Your quiz answers are automatically submitted.");
    submitQuizAnswers();
  };

  const submitQuizAnswers = () => {
    const newAttempt = {
      id: 'att' + (quizAttempts.length + 1),
      quizId: activeQuizAttempt.id,
      studentName: 'Rahul Student',
      score: 28, // auto evaluated mock score
      evaluated: true,
      answers: selectedAnswers,
      remarks: 'Well done on completing the quiz within the time limit!',
      allowedReattempt: false,
      quizQuestions: activeQuizAttempt.questions // Keep list of questions for detailed student report!
    };

    setQuizAttempts([...quizAttempts, newAttempt]);
    setActiveQuizAttempt(null);
    setSelectedAnswers({});
    setMarkedForReview([]);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleAddQuestion = () => {
    if (!qText.trim()) return;
    const newQ = {
      id: 'q_' + Date.now(),
      type: qType,
      text: qText.trim(),
      options: qType.startsWith('mcq') ? [...qOptions] : [],
      correct: qType === 'mcq-single' ? Number(qCorrect) : qCorrect,
      imageUrl: qImageUrl.trim() || null
    };
    setQuestions([...questions, newQ]);
    setQText('');
    setQImageUrl('');
    setQOptions(['', '', '', '']);
  };

  const handleSaveQuiz = (e) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;

    const newQuiz = {
      id: 'q' + (quizzes.length + 1),
      title: quizTitle.trim(),
      start: startDate || '2026-07-10T09:00',
      end: endDate || '2026-07-10T10:00',
      duration: Number(duration),
      status: 'Pending',
      questions
    };

    setQuizzes([...quizzes, newQuiz]);
    setActiveQuizBuilder(false);
    setQuizTitle('');
    setQuestions([]);
  };

  const handleReattemptAllow = (attemptId) => {
    setQuizAttempts(quizAttempts.map(att => 
      att.id === attemptId 
        ? { ...att, allowedReattempt: true } 
        : att
    ));
    alert("Re-attempt permission granted for the student.");
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isTeacher = role === 'teacher' || role === 'admin';
  const isStudent = role === 'student';
  const isParent = role === 'parent';

  return (
    <WhiteCard 
      title="Online Quizzes & Assessments"
      actions={isTeacher && (
        <button className="primary_btn btn_sm" onClick={() => setActiveQuizBuilder(true)}>
          <Plus size={14} /> Create Quiz
        </button>
      )}
    >
      {/* Active Quiz Attempt Panel */}
      {activeQuizAttempt && (
        <div style={{ border: '2px solid var(--primary-color)', padding: '24px', borderRadius: '8px', background: '#fff', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h4 style={{ fontWeight: 600, fontSize: '16px' }}>{activeQuizAttempt.title}</h4>
            <div style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> Timer: {formatTime(quizTimer)}
            </div>
          </div>

          {/* Navigation Panel */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', background: '#f8f9fa', padding: '12px', borderRadius: '4px' }}>
            {activeQuizAttempt.questions.map((q, i) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isMarked = markedForReview.includes(i);
              let btnClass = 'btn-secondary-outline';
              if (currentQIndex === i) btnClass = 'primary_btn';
              else if (isMarked) btnClass = 'btn-warning';
              else if (isAnswered) btnClass = 'btn-success';

              return (
                <button 
                  key={q.id} 
                  className={btnClass} 
                  style={{ width: '36px', height: '36px', padding: 0, borderRadius: '4px', fontSize: '13px' }}
                  onClick={() => setCurrentQIndex(i)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Render */}
          {activeQuizAttempt.questions[currentQIndex] && (
            <div style={{ marginBottom: '24px' }}>
              <h5 style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '14px' }}>
                Question {currentQIndex + 1}: {activeQuizAttempt.questions[currentQIndex].text}
              </h5>

              {/* Image based question support */}
              {activeQuizAttempt.questions[currentQIndex].imageUrl && (
                <div style={{ marginBottom: '14px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #eee', maxWidth: '300px' }}>
                  <img 
                    src={activeQuizAttempt.questions[currentQIndex].imageUrl} 
                    alt="Question illustration" 
                    style={{ width: '100%', height: 'auto', display: 'block' }} 
                  />
                </div>
              )}

              {/* Single MCQ */}
              {activeQuizAttempt.questions[currentQIndex].type === 'mcq-single' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeQuizAttempt.questions[currentQIndex].options.map((opt, oi) => (
                    <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name={`q_${activeQuizAttempt.questions[currentQIndex].id}`}
                        checked={selectedAnswers[activeQuizAttempt.questions[currentQIndex].id] === String(oi)}
                        onChange={() => setSelectedAnswers({ ...selectedAnswers, [activeQuizAttempt.questions[currentQIndex].id]: String(oi) })}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {/* Multi MCQ */}
              {activeQuizAttempt.questions[currentQIndex].type === 'mcq-multiple' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeQuizAttempt.questions[currentQIndex].options.map((opt, oi) => {
                    const currentAns = selectedAnswers[activeQuizAttempt.questions[currentQIndex].id] || [];
                    const isChecked = currentAns.includes(oi);
                    return (
                      <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {
                            let nextAns;
                            if (isChecked) {
                              nextAns = currentAns.filter(x => x !== oi);
                            } else {
                              nextAns = [...currentAns, oi];
                            }
                            setSelectedAnswers({ ...selectedAnswers, [activeQuizAttempt.questions[currentQIndex].id]: nextAns });
                          }}
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Descriptive */}
              {activeQuizAttempt.questions[currentQIndex].type === 'descriptive' && (
                <textarea 
                  className="form-control" 
                  rows={4} 
                  placeholder="Type your descriptive answer..."
                  value={selectedAnswers[activeQuizAttempt.questions[currentQIndex].id] || ''}
                  onChange={e => setSelectedAnswers({ ...selectedAnswers, [activeQuizAttempt.questions[currentQIndex].id]: e.target.value })}
                />
              )}
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                className="btn-secondary-outline"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
              >
                Previous
              </button>
              <button 
                type="button" 
                className="btn-secondary-outline"
                disabled={currentQIndex === activeQuizAttempt.questions.length - 1}
                onClick={() => setCurrentQIndex(prev => prev + 1)}
              >
                Next
              </button>
            </div>
            
            <button 
              type="button" 
              className="btn-warning"
              onClick={() => {
                if (markedForReview.includes(currentQIndex)) {
                  setMarkedForReview(markedForReview.filter(x => x !== currentQIndex));
                } else {
                  setMarkedForReview([...markedForReview, currentQIndex]);
                }
              }}
            >
              {markedForReview.includes(currentQIndex) ? 'Unmark Review' : 'Mark for Review'}
            </button>

            <button 
              type="button" 
              className="primary_btn" 
              onClick={submitQuizAnswers}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}

      {/* Quiz Builder Panel */}
      {activeQuizBuilder && (
        <div style={{ background: '#f8f8ff', border: '1px solid #e8e4ff', padding: '20px', borderRadius: '6px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h5 style={{ fontWeight: 600 }}>Quiz Creator</h5>
            <button onClick={() => setActiveQuizBuilder(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>
          <form onSubmit={handleSaveQuiz}>
            <FormGroup label="Quiz Title" required={true}>
              <input type="text" className="form-control" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="e.g. Linear Algebra Mock Test" required />
            </FormGroup>
            <div className="row">
              <div className="col-6">
                <FormGroup label="Start Date/Time" required={true}>
                  <input type="datetime-local" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                </FormGroup>
              </div>
              <div className="col-6">
                <FormGroup label="End Date/Time" required={true}>
                  <input type="datetime-local" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                </FormGroup>
              </div>
            </div>
            <FormGroup label="Duration (Minutes)" required={true}>
              <input type="number" className="form-control" value={duration} onChange={e => setDuration(e.target.value)} required min={1} />
              {duration && (
                <div style={{ fontSize: '11px', color: '#7C32FF', marginTop: '4px', fontWeight: 600 }}>
                  ⏱️ {formatDurationToHours(duration)}
                </div>
              )}
            </FormGroup>

            {/* Questions Builder Section */}
            <div style={{ border: '1px solid #e1e1f5', borderRadius: '4px', padding: '16px', background: '#fff', marginBottom: '16px' }}>
              <h6 style={{ fontWeight: 600, marginBottom: '10px', fontSize: '12px' }}>Question Builder ({questions.length} Questions Added)</h6>
              
              <FormGroup label="Question Text">
                {/* Rich Editor Manual Upload Toolbar */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                  <button type="button" className="btn-secondary-outline btn_sm" style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 700 }} onClick={() => setQText(prev => prev + ' **Bold Text**')}>B</button>
                  <button type="button" className="btn-secondary-outline btn_sm" style={{ padding: '2px 8px', fontSize: '11px', fontStyle: 'italic' }} onClick={() => setQText(prev => prev + ' *Italic Text*')}>I</button>
                  <button type="button" className="btn-secondary-outline btn_sm" style={{ padding: '2px 8px', fontSize: '11px', textDecoration: 'underline' }} onClick={() => setQText(prev => prev + ' <u>Underlined Text</u>')}>U</button>
                  <button type="button" className="btn-secondary-outline btn_sm" style={{ padding: '2px 8px', fontSize: '11px', fontFamily: 'monospace' }} onClick={() => setQText(prev => prev + ' `code_here`')}>Code</button>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', alignSelf: 'center', marginLeft: 'auto' }}>Rich formatting helper</span>
                </div>
                <input type="text" className="form-control" value={qText} onChange={e => setQText(e.target.value)} placeholder="Enter question..." />
              </FormGroup>

              {/* Image Based Question URL */}
              <FormGroup label="Question Image URL (Optional for Image-Based Questions)">
                <input type="text" className="form-control" value={qImageUrl} onChange={e => setQImageUrl(e.target.value)} placeholder="e.g. https://images.unsplash.com/photo-500..." />
              </FormGroup>

              <div className="row">
                <div className="col-6">
                  <FormGroup label="Question Type">
                    <select className="form-control" value={qType} onChange={e => setQType(e.target.value)}>
                      <option value="mcq-single">Single Choice MCQ</option>
                      <option value="mcq-multiple">Multiple Choice MCQ</option>
                      <option value="descriptive">Descriptive Answer</option>
                    </select>
                  </FormGroup>
                </div>
                <div className="col-6">
                  <FormGroup label="Import Method (Simulated)">
                    <select className="form-control">
                      <option value="manual">Manual Entry (Default)</option>
                      <option value="docx">DOCX File Parse</option>
                      <option value="bank">Question Bank Fetch</option>
                    </select>
                  </FormGroup>
                </div>
              </div>

              {qType.startsWith('mcq') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                  {qOptions.map((opt, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>Option {String.fromCharCode(65 + idx)}:</span>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={opt} 
                        onChange={e => {
                          const nextOpts = [...qOptions];
                          nextOpts[idx] = e.target.value;
                          setQOptions(nextOpts);
                        }} 
                        placeholder={`Option ${idx + 1}`}
                      />
                    </div>
                  ))}
                  <FormGroup label="Correct Option Index (0-3)">
                    <input type="number" className="form-control" value={qCorrect} onChange={e => setQCorrect(e.target.value)} min={0} max={3} />
                  </FormGroup>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" className="btn-secondary-outline btn_sm" onClick={handleAddQuestion}>
                  Add Question to Quiz
                </button>
                <button 
                  type="button" 
                  className="btn-secondary-outline btn_sm" 
                  style={{ borderColor: '#7C32FF', color: '#7C32FF', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    setShowAiGenerator(!showAiGenerator);
                    setShowQBank(false);
                  }}
                >
                  ✨ AI Question Generator
                </button>
                <button 
                  type="button" 
                  className="btn-secondary-outline btn_sm" 
                  style={{ borderColor: 'var(--success)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    setShowQBank(!showQBank);
                    setShowAiGenerator(false);
                  }}
                >
                  📂 Browse Question Bank
                </button>
              </div>

              {/* Question Bank Browse Panel */}
              {showQBank && (
                <div style={{ border: '1px dashed var(--success)', padding: '16px', background: '#f8fdf9', borderRadius: '4px', marginTop: '14px' }}>
                  <h6 style={{ fontWeight: 700, fontSize: '11px', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    📂 Question Bank (Repository Imports)
                  </h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', background: '#fff', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '12px' }}>
                    {QUESTION_BANK_REPO.map((q) => {
                      const isAdded = questions.some(existing => existing.text === q.text);
                      return (
                        <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>
                          <div>
                            <strong>{q.type.toUpperCase()}:</strong> {q.text}
                          </div>
                          <button 
                            type="button" 
                            className="btn_sm"
                            disabled={isAdded}
                            style={{ 
                              padding: '2px 8px', 
                              fontSize: '10px', 
                              background: isAdded ? '#ddd' : 'var(--success)', 
                              color: '#fff', 
                              border: 'none', 
                              borderRadius: '3px',
                              cursor: isAdded ? 'not-allowed' : 'pointer'
                            }}
                            onClick={() => {
                              const newQ = {
                                id: 'q_qb_' + Date.now(),
                                type: q.type,
                                text: q.text,
                                options: [...(q.options || [])],
                                correct: q.correct
                              };
                              setQuestions([...questions, newQ]);
                            }}
                          >
                            {isAdded ? 'Added' : 'Import'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Generator Panel */}
              {showAiGenerator && (
                <div style={{ border: '1px dashed #7C32FF', padding: '16px', background: '#fafaff', borderRadius: '4px', marginTop: '14px' }}>
                  <h6 style={{ fontWeight: 700, fontSize: '11px', color: '#7C32FF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    ✨ AI Question Generation Engine
                  </h6>
                  
                  {generatedQuestions.length === 0 && !aiGenerating && (
                    <>
                      <form onSubmit={handleAiGenerate}>
                        <FormGroup label="Select Source Document / File (Simulated)">
                          <select className="form-control" value={aiFile} onChange={e => setAiFile(e.target.value)} required>
                            <option value="">-- Select Material to Read --</option>
                            <option value="gravity_notes.txt">gravity_notes.txt (Physics Coursework)</option>
                            <option value="bst_lecture.pdf">bst_lecture.pdf (Computer Science Slides)</option>
                            <option value="general_math.docx">general_math.docx (Calculus Integrals)</option>
                          </select>
                        </FormGroup>
                        
                        <div className="row">
                          <div className="col-6">
                            <FormGroup label="Questions Count">
                              <input type="number" className="form-control" min={1} max={10} value={aiCount} onChange={e => setAiCount(Number(e.target.value))} required />
                            </FormGroup>
                          </div>
                          <div className="col-6">
                            <FormGroup label="Difficulty Level">
                              <select className="form-control" value={aiDifficulty} onChange={e => setAiDifficulty(e.target.value)}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                              </select>
                            </FormGroup>
                          </div>
                        </div>
                        
                        <button type="submit" className="primary_btn btn_sm" style={{ background: 'linear-gradient(90deg, #7C32FF, #C738D8)', border: 'none', width: '100%', justifyContent: 'center' }}>
                          Generate AI Questions
                        </button>
                      </form>

                      {/* DOCX Parsing Option */}
                      <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '12px' }}>
                        <h6 style={{ fontSize: '11px', fontWeight: 600, color: '#333' }}>Or Parse a DOCX Document:</h6>
                        {docxSuccess ? (
                          <div className="alert alert-success" style={{ padding: '8px 12px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Successfully parsed 2 questions from docx file!</span>
                            <button type="button" onClick={() => setDocxSuccess(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              type="file" 
                              accept=".docx" 
                              className="form-control" 
                              style={{ fontSize: '11px', padding: '4px' }} 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setDocxParsing(true);
                                  setTimeout(() => {
                                    setDocxParsing(false);
                                    setDocxSuccess(true);
                                    // add two mock parsed questions
                                    const parsed = [
                                      { id: 'docx_' + Date.now() + '_1', type: 'mcq-single', text: 'What is the SI unit of gravitational potential?', options: ['Joule/kg', 'Joule', 'Newton/kg', 'Watt'], correct: 0 },
                                      { id: 'docx_' + Date.now() + '_2', type: 'descriptive', text: 'Describe Kepler\'s laws of planetary motion briefly.' }
                                    ];
                                    setQuestions([...questions, ...parsed]);
                                  }, 1500);
                                }
                              }}
                            />
                            {docxParsing && (
                              <div className="spinner-border text-primary" role="status" style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }}></div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {aiGenerating && (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <div className="spinner-border text-primary mb-2" role="status" style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite' }}></div>
                      <div style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>
                        🤖 AI is analyzing file and auto-generating questions...
                      </div>
                    </div>
                  )}

                  {generatedQuestions.length > 0 && (
                    <div>
                      <h6 style={{ fontSize: '11.5px', fontWeight: 600, marginBottom: '10px' }}>AI Generated Questions Preview:</h6>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', background: '#fff', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '12px' }}>
                        {generatedQuestions.map((q, idx) => (
                          <div key={q.id} style={{ display: 'flex', gap: '8px', fontSize: '12px', borderBottom: idx < generatedQuestions.length - 1 ? '1px solid #eee' : 'none', paddingBottom: '8px' }}>
                            <input 
                              type="checkbox" 
                              checked={q.selected} 
                              onChange={() => {
                                setGeneratedQuestions(generatedQuestions.map(x => x.id === q.id ? { ...x, selected: !x.selected } : x));
                              }} 
                              style={{ marginTop: '3px' }}
                            />
                            <div>
                              <div><strong>Q{idx + 1}:</strong> {q.text}</div>
                              <span style={{ fontSize: '10px', color: 'var(--primary-color)', fontWeight: 600 }}>({q.type.toUpperCase()})</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn-secondary-outline btn_sm" onClick={() => setGeneratedQuestions([])}>
                          Discard
                        </button>
                        <button type="button" className="primary_btn btn_sm" style={{ background: 'linear-gradient(90deg, #7C32FF, #C738D8)', border: 'none' }} onClick={handleAddAiQuestions}>
                          Add Selected to Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary-outline" onClick={() => setActiveQuizBuilder(false)}>Cancel</button>
              <button type="submit" className="primary_btn" disabled={questions.length === 0}>Publish Quiz</button>
            </div>
          </form>
        </div>
      )}

      {/* Faculty Evaluation Modal */}
      {activeEvaluation && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '500px', padding: '24px' }}>
            <h5 style={{ fontWeight: 600, marginBottom: '14px' }}>Evaluate Descriptive Answers</h5>
            <p><strong>Student:</strong> {activeEvaluation.studentName}</p>
            <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
              <strong>Question: Explain the geometric meaning of the derivative...</strong>
              <div style={{ marginTop: '8px', color: 'var(--text-dark)', fontStyle: 'italic' }}>
                "{activeEvaluation.answers.q1_3 || '(No answer provided)'}"
              </div>
            </div>
            <FormGroup label="Award Marks (Max 10)">
              <input type="number" className="form-control" placeholder="e.g. 9" />
            </FormGroup>
            <FormGroup label="Remarks / Feedback">
              <input type="text" className="form-control" placeholder="Well described." />
            </FormGroup>
            <div style={{ display: 'flex', justify: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button type="button" className="btn-secondary-outline" onClick={() => setActiveEvaluation(null)}>Cancel</button>
              <button type="button" className="primary_btn" onClick={() => {
                setQuizAttempts(quizAttempts.map(att => 
                  att.id === activeEvaluation.id 
                    ? { ...att, score: 28, evaluated: true, remarks: 'Excellent analysis.' } 
                    : att
                ));
                setActiveEvaluation(null);
              }}>Submit Evaluation</button>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes List */}
      <div>
        <h5 style={{ fontWeight: 600, marginBottom: '16px', fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Quizzes Schedules</h5>
        {quizzes.map(q => {
          const attempt = quizAttempts.find(a => a.quizId === q.id && a.studentName === 'Rahul Student');
          const allAttempts = quizAttempts.filter(a => a.quizId === q.id);

          return (
            <div key={q.id} style={styles.quizCard}>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 600 }}>{q.title}</h4>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Duration: <strong>{q.duration} Mins</strong></span>
                  <span>Start: <strong>{new Date(q.start).toLocaleString()}</strong></span>
                  <span>Status: 
                    <strong style={{ marginLeft: '4px', color: q.status === 'Published' ? 'var(--success)' : 'var(--warning)' }}>
                      {q.status}
                    </strong>
                  </span>
                </div>
              </div>

              <div>
                {/* Faculty Dashboard options */}
                {isTeacher && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-secondary-outline btn_sm" onClick={() => {
                        setQuizzes(quizzes.map(qz => qz.id === q.id ? { ...qz, status: qz.status === 'Published' ? 'Withdrawn' : 'Published' } : qz));
                      }}>
                        {q.status === 'Published' ? 'Withdraw' : 'Publish'}
                      </button>
                    </div>
                    {allAttempts.length > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        {allAttempts.map(att => (
                          <div key={att.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                            {!att.evaluated ? (
                              <button className="btn-success btn_sm" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => setActiveEvaluation(att)}>
                                Evaluate {att.studentName}
                              </button>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
                                <CheckCircle size={14} /> {att.studentName}: {att.score} pts (Evaluated)
                              </div>
                            )}
                            <button className="btn-secondary-outline btn_sm" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => handleReattemptAllow(att.id)}>
                              Allow Reattempt
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Student attempting options */}
                {isStudent && (
                  <>
                    {attempt ? (
                      <div style={{ textAlign: 'right' }}>
                        <Badge type={attempt.evaluated ? 'success' : 'warning'}>
                          {attempt.evaluated ? `Score: ${attempt.score} (Evaluated)` : 'Pending Grading'}
                        </Badge>
                        {attempt.allowedReattempt && (
                          <button className="primary_btn btn_sm" style={{ marginLeft: '8px' }} onClick={() => setActiveQuizAttempt(q)}>
                            Re-Attempt
                          </button>
                        )}
                        {attempt.evaluated && (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '6px' }}>
                            <button 
                              type="button" 
                              className="btn-secondary-outline btn_sm" 
                              style={{ padding: '2px 8px', fontSize: '11px' }} 
                              onClick={() => setSelectedAttemptReport(attempt)}
                            >
                              View Detailed Report
                            </button>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                              Remarks: "{attempt.remarks}"
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button 
                        className="primary_btn btn_sm"
                        disabled={q.status !== 'Published'}
                        onClick={() => setActiveQuizAttempt(q)}
                      >
                        <Play size={12} style={{ marginRight: '4px' }} /> Start Quiz
                      </button>
                    )}
                  </>
                )}

                {/* Parent options */}
                {isParent && (
                  <div>
                    {attempt ? (
                      <Badge type={attempt.evaluated ? 'success' : 'warning'}>
                        {attempt.evaluated ? `Rahul's Score: ${attempt.score}` : 'Submitted (Evaluating)'}
                      </Badge>
                    ) : (
                      <Badge type="danger">Quiz Not Attempted</Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Attempt Report Modal */}
      {selectedAttemptReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '650px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
              <h5 style={{ fontWeight: 700, margin: 0 }}>Detailed Quiz Report</h5>
              <button className="btn-secondary-outline btn_sm" style={{ padding: '2px 8px', fontSize: '14px' }} onClick={() => setSelectedAttemptReport(null)}>×</button>
            </div>
            
            <div className="mb-4" style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
              <div><strong>Student Name:</strong> {selectedAttemptReport.studentName}</div>
              <div><strong>Final Score:</strong> <Badge type="success">{selectedAttemptReport.score} pts</Badge></div>
              <div><strong>Status:</strong> Evaluated</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedAttemptReport.quizQuestions && selectedAttemptReport.quizQuestions.map((q, idx) => {
                const answer = selectedAttemptReport.answers[q.id];
                const isCorrect = q.type === 'mcq-single' ? Number(answer) === q.correct : true; // mock evaluation representation
                
                return (
                  <div key={q.id} style={{ border: '1px solid #eee', borderRadius: '6px', padding: '14px', background: '#fcfcfc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>Q{idx + 1}: {q.text}</span>
                      <Badge type={isCorrect ? 'success' : 'danger'}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>
                    {q.imageUrl && (
                      <div style={{ margin: '8px 0', maxWidth: '200px' }}>
                        <img src={q.imageUrl} alt="Q-visual" style={{ width: '100%', borderRadius: '4px' }} />
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Selected Answer: <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                        {q.type.startsWith('mcq') && q.options ? q.options[answer] || 'Skipped' : answer || 'Skipped'}
                      </strong></div>
                      {q.type.startsWith('mcq') && !isCorrect && (
                        <div>Correct Option: <strong>{q.options[q.correct]}</strong></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </WhiteCard>
  );
}

// ==========================================
// MODULE 3: DISCUSSION FORUM TAB
// ==========================================
function DiscussionForumTab({ role, userName, forumGroups, setForumGroups, messages, setMessages }) {
  const [selectedGroup, setSelectedGroup] = useState('fg1');
  const [typedMessage, setTypedMessage] = useState('');
  
  // Faculty create group state
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  
  // Attachments simulator
  const [attachment, setAttachment] = useState('');
  
  // Membership & Notification states
  const [showMemberManager, setShowMemberManager] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New discussion group 'Science Projects' was created by Faculty Mary.", time: '5m ago' },
    { id: 2, text: "Rahul Student posted in 'Exam Prep 101'.", time: '12m ago' }
  ]);

  const USER_LIST = [
    { name: 'Faculty John', role: 'teacher' },
    { name: 'Faculty Mary', role: 'teacher' },
    { name: 'Rahul Student', role: 'student' },
    { name: 'Anjali Student', role: 'student' },
    { name: 'Mr. Sharma Parent', role: 'parent' },
    { name: 'Mrs. Gupta Parent', role: 'parent' }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg = {
      sender: userName,
      senderRole: role,
      text: typedMessage.trim() + (attachment ? ` [📎 Attachment: ${attachment}]` : ''),
      timestamp: new Date().toISOString()
    };

    setMessages({
      ...messages,
      [selectedGroup]: [...(messages[selectedGroup] || []), newMsg]
    });

    setTypedMessage('');
    setAttachment('');
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroupId = 'fg' + (forumGroups.length + 1);
    const newGroup = {
      id: newGroupId,
      name: newGroupName.trim(),
      members: [userName], // starts with creator only
      createdBy: userName
    };

    setForumGroups([...forumGroups, newGroup]);
    setMessages({ ...messages, [newGroupId]: [] });
    setSelectedGroup(newGroupId);
    setNewGroupName('');
    setShowGroupForm(false);
  };

  const handleDeleteGroup = (groupId) => {
    if (!window.confirm("Are you sure you want to delete this discussion group?")) return;
    setForumGroups(forumGroups.filter(g => g.id !== groupId));
    if (selectedGroup === groupId) {
      setSelectedGroup(forumGroups[0]?.id || '');
    }
  };

  const isTeacher = role === 'teacher' || role === 'admin';
  const isParent = role === 'parent';

  return (
    <WhiteCard 
      title="LMS Discussion Forum"
      actions={isTeacher && (
        <button className="primary_btn btn_sm" onClick={() => setShowGroupForm(true)}>
          <FolderPlus size={14} style={{ marginRight: '4px' }} /> Create Group
        </button>
      )}
    >
      {/* Create Group Form */}
      {showGroupForm && (
        <div style={{ padding: '16px', background: '#f8f8ff', border: '1px solid #e8e4ff', borderRadius: '6px', marginBottom: '20px' }}>
          <form onSubmit={handleCreateGroup}>
            <FormGroup label="Discussion Group Name" required={true}>
              <input type="text" className="form-control" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="e.g. Science Fair Projects group" required />
            </FormGroup>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary-outline" onClick={() => setShowGroupForm(false)}>Cancel</button>
              <button type="submit" className="primary_btn">Create Group</button>
            </div>
          </form>
        </div>
      )}

      {/* Forum Interface Layout */}
      <div className="row" style={{ minHeight: '400px' }}>
        {/* Left Side: Groups List */}
        <div className="col-12 col-md-4" style={{ borderRight: '1px solid var(--border-color)', paddingRight: '15px' }}>
          {/* Notifications feed [RBAC] */}
          {isTeacher && notifications.length > 0 && (
            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '10px', borderRadius: '4px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706' }}>🔔 Forum Notifications</span>
                <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '10px', color: '#999' }} onClick={() => setNotifications([])}>Clear</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ fontSize: '10.5px', color: '#78350f', lineHeight: 1.3 }}>
                    • {n.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          <h6 style={{ fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Groups</h6>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {forumGroups.map(g => (
              <div 
                key={g.id} 
                onClick={() => setSelectedGroup(g.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: selectedGroup === g.id ? 'rgba(124,50,255,0.06)' : '#fff',
                  border: selectedGroup === g.id ? '1px solid rgba(124,50,255,0.2)' : '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{g.name}</div>
                {isTeacher && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteGroup(g.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '2px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Chat Box */}
        <div className="col-12 col-md-8" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          {selectedGroup ? (
            <>
              {/* Chat Header */}
              <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h5 style={{ fontWeight: 600, fontSize: '14px', margin: 0 }}>
                    {forumGroups.find(g => g.id === selectedGroup)?.name}
                  </h5>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Members: {forumGroups.find(g => g.id === selectedGroup)?.members.join(', ')}
                  </span>
                  {isParent && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>
                      <Info size={11} /> Parent Sandbox: Messages will not be directly visible to students (direct messaging disabled).
                    </div>
                  )}
                </div>
                {isTeacher && (
                  <button 
                    type="button"
                    className="btn-secondary-outline btn_sm"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => setShowMemberManager(!showMemberManager)}
                  >
                    Manage Members
                  </button>
                )}
              </div>

              {/* Member Manager Panel */}
              {showMemberManager && isTeacher && (
                <div style={{ background: '#fcfcfc', border: '1px solid #ddd', padding: '14px', borderRadius: '4px', marginBottom: '12px' }}>
                  <h6 style={{ fontWeight: 600, fontSize: '12px', marginBottom: '8px' }}>Manage Group Members</h6>
                  
                  {/* Test case rules validation */}
                  {(() => {
                    const currentGroupObj = forumGroups.find(g => g.id === selectedGroup);
                    if (!currentGroupObj) return null;
                    const hasParents = currentGroupObj.members.some(m => USER_LIST.find(x => x.name === m)?.role === 'parent');
                    const hasStudents = currentGroupObj.members.some(m => USER_LIST.find(x => x.name === m)?.role === 'student');
                    
                    return (
                      <>
                        {hasParents && (
                          <div style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 600, marginBottom: '8px' }}>
                            ⚠️ Parent Communication Rules: Student members cannot be added to this group.
                          </div>
                        )}
                        {hasStudents && (
                          <div style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 600, marginBottom: '8px' }}>
                            ⚠️ Parent Communication Rules: Parent members cannot be added to this group.
                          </div>
                        )}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {USER_LIST.map(u => {
                            const isMember = currentGroupObj.members.includes(u.name);
                            const isBlocked = (u.role === 'student' && hasParents) || (u.role === 'parent' && hasStudents);
                            
                            return (
                              <div 
                                key={u.name} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '6px', 
                                  fontSize: '11.5px', 
                                  padding: '4px 8px', 
                                  borderRadius: '20px', 
                                  background: isMember ? 'rgba(124,50,255,0.08)' : '#f3f3f3',
                                  border: isMember ? '1px solid var(--primary-color)' : '1px solid #ddd',
                                  opacity: isBlocked ? 0.5 : 1
                                }}
                              >
                                <span>{u.name} ({u.role.toUpperCase()})</span>
                                {isMember ? (
                                  <button 
                                    type="button" 
                                    style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                                    onClick={() => {
                                      const nextMembers = currentGroupObj.members.filter(m => m !== u.name);
                                      setForumGroups(forumGroups.map(g => g.id === selectedGroup ? { ...g, members: nextMembers } : g));
                                    }}
                                  >
                                    ×
                                  </button>
                                ) : (
                                  <button 
                                    type="button" 
                                    disabled={isBlocked}
                                    style={{ border: 'none', background: 'none', color: isBlocked ? '#999' : 'var(--primary-color)', cursor: isBlocked ? 'not-allowed' : 'pointer', padding: 0, fontWeight: 700 }}
                                    onClick={() => {
                                      const nextMembers = [...currentGroupObj.members, u.name];
                                      setForumGroups(forumGroups.map(g => g.id === selectedGroup ? { ...g, members: nextMembers } : g));
                                    }}
                                  >
                                    +
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Message List */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', marginBottom: '14px' }}>
                {(messages[selectedGroup] || []).map((m, idx) => {
                  const isMe = m.sender === userName;
                  return (
                    <div 
                      key={idx} 
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMe ? 'flex-end' : 'flex-start',
                        marginBottom: '12px'
                      }}
                    >
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        {m.sender} ({m.senderRole.toUpperCase()})
                      </span>
                      <div 
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          maxWidth: '85%',
                          color: isMe ? '#fff' : 'var(--text-dark)',
                          background: isMe ? 'var(--primary-gradient)' : '#f1f1f1'
                        }}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  value={typedMessage} 
                  onChange={e => setTypedMessage(e.target.value)} 
                  placeholder="Type your message..." 
                  required
                />
                
                {/* Faculty Only: Attachments option [RBAC] */}
                {isTeacher && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input 
                      type="file" 
                      id="forumFile"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAttachment(e.target.files[0].name);
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      className="btn-secondary-outline btn_sm" 
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', padding: '6px 10px' }}
                      onClick={() => document.getElementById('forumFile').click()}
                    >
                      <UploadCloud size={13} /> {attachment ? 'Change File' : 'Upload File'}
                    </button>
                    {attachment && (
                      <span style={{ fontSize: '11px', color: 'var(--text-light)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        📎 {attachment}
                      </span>
                    )}
                  </div>
                )}

                <button type="submit" className="primary_btn" style={{ padding: '9px 15px' }}>
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Select a group to start discussing.
            </div>
          )}
        </div>
      </div>
    </WhiteCard>
  );
}

// ==========================================
// MODULE 4: STUDENT PROGRESS TRACKING TAB
// ==========================================
function ProgressTrackingTab({ role }) {
  const [selectedStudent, setSelectedStudent] = useState('Rahul Student');

  const isTeacher = role === 'teacher' || role === 'admin';
  const isParent = role === 'parent';

  return (
    <WhiteCard title={isParent ? "Rahul's Progress Tracker" : "Class Progress Analytics"}>
      {/* Student Selector for Faculty */}
      {isTeacher && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>Viewing analytics for student:</span>
          <select className="form-control" style={{ width: '180px' }} value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
            <option value="Rahul Student">Rahul Student (Roll 1)</option>
            <option value="Sneha Rao">Sneha Rao (Roll 4)</option>
            <option value="Arjun Singh">Arjun Singh (Roll 12)</option>
          </select>
        </div>
      )}

      {/* Grid of analytics charts */}
      <div className="row">
        {/* Quiz Scores Over Time */}
        <div className="col-12 col-lg-6 mb-4">
          <div style={{ border: '1px solid var(--border-color)', padding: '14px', borderRadius: '4px' }}>
            <h6 style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Quiz Performance Trend</h6>
            <div style={{ width: '100%' }}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MOCK_ANALYTICS.quizScores}>
                  <defs>
                    <linearGradient id="colorStudent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C32FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7C32FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="studentScore" name="Student Score" stroke="#7C32FF" fillOpacity={1} fill="url(#colorStudent)" />
                  <Area type="monotone" dataKey="classAvg" name="Class Average" stroke="#C738D8" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Exams Results */}
        <div className="col-12 col-lg-6 mb-4">
          <div style={{ border: '1px solid var(--border-color)', padding: '14px', borderRadius: '4px' }}>
            <h6 style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Major Exams Performance</h6>
            <div style={{ width: '100%' }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={MOCK_ANALYTICS.examGrades}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="student" name="Student Grade" fill="#7C32FF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avg" name="Class Average" fill="#4d79ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="col-12 col-lg-6 mb-4">
          <div style={{ border: '1px solid var(--border-color)', padding: '14px', borderRadius: '4px' }}>
            <h6 style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Attendance Analytics</h6>
            <div style={{ width: '100%' }}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MOCK_ANALYTICS.attendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="percent" name="Attendance %" stroke="#23c277" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Behavior Scores */}
        <div className="col-12 col-lg-6 mb-4">
          <div style={{ border: '1px solid var(--border-color)', padding: '14px', borderRadius: '4px' }}>
            <h6 style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Behavior Index (Weekly)</h6>
            <div style={{ width: '100%' }}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MOCK_ANALYTICS.behavior}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" name="Behavior Index" stroke="#ffba00" fill="#fff5d6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </WhiteCard>
  );
}
