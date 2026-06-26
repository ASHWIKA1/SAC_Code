import React from 'react';
import GenericCrudPage from '../../components/GenericCrudPage';
import { Badge } from '../../components/UI';

// ═══ ACADEMICS SUB-MODULES ═══════════════════════════════════════════════════

export function ClassRoutinePage() {
  return <GenericCrudPage
    title="Class Routine" breadcrumbs={[{ label: 'Academics' }, { label: 'Class Routine' }]}
    apiPath="/api/v1/timetable"
    addLabel="Add Routine"
    columns={[
      { label: 'Class', key: 'className' },
      { label: 'Section', key: 'sectionName' },
      { label: 'Subject', key: 'subjectName' },
      { label: 'Day', key: 'dayOfWeek' },
      { label: 'Time', render: r => `${r.startTime || '09:00'} - ${r.endTime || '10:00'}` },
    ]}
    formFields={[
      { key: 'className', label: 'Class', required: true, placeholder: 'e.g. Class 10' },
      { key: 'sectionName', label: 'Section', required: true, placeholder: 'e.g. A' },
      { key: 'subjectName', label: 'SubjectName', required: true, placeholder: 'e.g. Mathematics' },
      { key: 'dayOfWeek', label: 'Day', type: 'select', required: true, options: [
        { value: 'Monday', label: 'Monday' }, { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' }, { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
      ]},
      { key: 'startTime', label: 'Start Time', required: true, placeholder: '09:00' },
      { key: 'endTime', label: 'End Time', required: true, placeholder: '10:00' },
    ]}
    mockData={[
      { id: 1, className: 'Class 10', sectionName: 'A', subjectName: 'Mathematics', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00' },
      { id: 2, className: 'Class 10', sectionName: 'A', subjectName: 'Science', dayOfWeek: 'Monday', startTime: '10:15', endTime: '11:15' },
    ]}
  />;
}

export function AssignSubjectsPage() {
  return <GenericCrudPage
    title="Assign Subjects" breadcrumbs={[{ label: 'Academics' }, { label: 'Assign Subjects' }]}
    apiPath="/api/v1/academics/assign-subjects"
    addLabel="Assign Subject"
    columns={[
      { label: 'Class', key: 'className' },
      { label: 'Section', key: 'sectionName' },
      { label: 'Subject', key: 'subjectName' },
      { label: 'Teacher', key: 'teacherName' },
    ]}
    formFields={[
      { key: 'className', label: 'Class', required: true },
      { key: 'sectionName', label: 'Section', required: true },
      { key: 'subjectName', label: 'Subject', required: true },
      { key: 'teacherName', label: 'Teacher Name', required: true },
    ]}
    mockData={[
      { id: 1, className: 'Class 10', sectionName: 'A', subjectName: 'Mathematics', teacherName: 'Mr. Suresh Nair' },
    ]}
  />;
}

export function ClassroomsPage() {
  return <GenericCrudPage
    title="Class Rooms" breadcrumbs={[{ label: 'Academics' }, { label: 'Class Rooms' }]}
    apiPath="/api/v1/academics/classrooms"
    addLabel="Add Class Room"
    columns={[
      { label: 'Room No', key: 'roomNo' },
      { label: 'Capacity', key: 'capacity' },
    ]}
    formFields={[
      { key: 'roomNo', label: 'Room Number', required: true },
      { key: 'capacity', label: 'Capacity', type: 'number', required: true },
    ]}
    mockData={[
      { id: 1, roomNo: 'Room 101', capacity: 40 },
      { id: 2, roomNo: 'Room 102', capacity: 35 },
    ]}
  />;
}

export function ShiftsPage() {
  return <GenericCrudPage
    title="Shifts" breadcrumbs={[{ label: 'Academics' }, { label: 'Shifts' }]}
    apiPath="/api/v1/academics/shifts"
    addLabel="Add Shift"
    columns={[
      { label: 'Shift Name', key: 'name' },
      { label: 'Start Time', key: 'startTime' },
      { label: 'End Time', key: 'endTime' },
    ]}
    formFields={[
      { key: 'name', label: 'Shift Name', required: true },
      { key: 'startTime', label: 'Start Time', required: true },
      { key: 'endTime', label: 'End Time', required: true },
    ]}
    mockData={[
      { id: 1, name: 'Morning Shift', startTime: '08:00', endTime: '12:30' },
      { id: 2, name: 'Day Shift', startTime: '13:00', endTime: '17:30' },
    ]}
  />;
}

// ═══ LESSON PLAN ═════════════════════════════════════════════════════════════

export function LessonPlansPage() {
  return <GenericCrudPage
    title="Lesson Plans" breadcrumbs={[{ label: 'Lesson Plan' }, { label: 'Plans' }]}
    apiPath="/api/v1/lessons"
    addLabel="Add Lesson Plan"
    columns={[
      { label: 'Class', key: 'className' },
      { label: 'Section', key: 'sectionName' },
      { label: 'Subject', key: 'subjectName' },
      { label: 'Lesson Name', key: 'lessonName' },
    ]}
    formFields={[
      { key: 'className', label: 'Class', required: true },
      { key: 'sectionName', label: 'Section', required: true },
      { key: 'subjectName', label: 'Subject', required: true },
      { key: 'lessonName', label: 'Lesson Name', required: true },
    ]}
    mockData={[
      { id: 1, className: 'Class 10', sectionName: 'A', subjectName: 'Mathematics', lessonName: 'Trigonometry Introduction' },
    ]}
  />;
}

export function LessonTopicsPage() {
  return <GenericCrudPage
    title="Lesson Topics" breadcrumbs={[{ label: 'Lesson Plan' }, { label: 'Topics' }]}
    apiPath="/api/v1/lessons/topics"
    addLabel="Add Topic"
    columns={[
      { label: 'Lesson', key: 'lessonName' },
      { label: 'Topic Name', key: 'topicName' },
    ]}
    formFields={[
      { key: 'lessonName', label: 'Lesson Name', required: true },
      { key: 'topicName', label: 'Topic Name', required: true },
    ]}
    mockData={[
      { id: 1, lessonName: 'Trigonometry Introduction', topicName: 'Sine and Cosine ratios' },
    ]}
  />;
}

// ═══ HOMEWORK ════════════════════════════════════════════════════════════════

export function HomeworkListPage() {
  return <GenericCrudPage
    title="Homework List" breadcrumbs={[{ label: 'Homework' }, { label: 'List' }]}
    apiPath="/api/v1/homework"
    addLabel="Add Homework"
    columns={[
      { label: 'Class', key: 'className' },
      { label: 'Section', key: 'sectionName' },
      { label: 'Subject', key: 'subjectName' },
      { label: 'Homework Date', key: 'homeworkDate' },
      { label: 'Submission Date', key: 'submissionDate' },
      { label: 'Marks', key: 'evaluationMarks' },
    ]}
    formFields={[
      { key: 'className', label: 'Class', required: true },
      { key: 'sectionName', label: 'Section', required: true },
      { key: 'subjectName', label: 'Subject', required: true },
      { key: 'homeworkDate', label: 'Homework Date', type: 'date', required: true },
      { key: 'submissionDate', label: 'Submission Date', type: 'date', required: true },
      { key: 'evaluationMarks', label: 'Marks', type: 'number', required: true },
    ]}
    mockData={[
      { id: 1, className: 'Class 10', sectionName: 'A', subjectName: 'Science', homeworkDate: '2026-06-20', submissionDate: '2026-06-25', evaluationMarks: 10 },
    ]}
  />;
}

// ═══ STUDENT SUB-MODULES ═════════════════════════════════════════════════════

export function StudentCategoriesPage() {
  return <GenericCrudPage
    title="Student Categories" breadcrumbs={[{ label: 'Student Info' }, { label: 'Categories' }]}
    apiPath="/api/v1/students/categories"
    addLabel="Add Category"
    columns={[{ label: 'Category Name', key: 'name' }]}
    formFields={[{ key: 'name', label: 'Category Name', required: true }]}
    mockData={[{ id: 1, name: 'General' }, { id: 2, name: 'OBC' }]}
  />;
}

export function StudentGroupsPage() {
  return <GenericCrudPage
    title="Student Groups" breadcrumbs={[{ label: 'Student Info' }, { label: 'Groups' }]}
    apiPath="/api/v1/students/groups"
    addLabel="Add Group"
    columns={[{ label: 'Group Name', key: 'name' }]}
    formFields={[{ key: 'name', label: 'Group Name', required: true }]}
    mockData={[{ id: 1, name: 'Science Club' }, { id: 2, name: 'Arts Club' }]}
  />;
}

export function StudentDocumentsPage() {
  return <GenericCrudPage
    title="Student Documents" breadcrumbs={[{ label: 'Student Info' }, { label: 'Documents' }]}
    apiPath="/api/v1/students/documents"
    addLabel="Upload Document"
    columns={[
      { label: 'Title', key: 'title' },
      { label: 'Student', key: 'studentName' },
      { label: 'Document File', key: 'file' },
    ]}
    formFields={[
      { key: 'title', label: 'Document Title', required: true },
      { key: 'studentName', label: 'Student Name', required: true },
      { key: 'file', label: 'File URL / Path', required: true },
    ]}
    mockData={[{ id: 1, title: 'Birth Certificate', studentName: 'Rahul Kumar', file: 'birth_cert.pdf' }]}
  />;
}

export function StudentIdCardsPage() {
  return <GenericCrudPage
    title="Student ID Cards" breadcrumbs={[{ label: 'Student Info' }, { label: 'ID Cards' }]}
    apiPath="/api/v1/students/id-cards"
    addLabel="Add ID Card Template"
    columns={[
      { label: 'Template Name', key: 'title' },
      { label: 'Layout', key: 'layout' },
    ]}
    formFields={[
      { key: 'title', label: 'Template Name', required: true },
      { key: 'layout', label: 'Layout', type: 'select', options: [{ value: 'Horizontal', label: 'Horizontal' }, { value: 'Vertical', label: 'Vertical' }] },
    ]}
    mockData={[{ id: 1, title: 'Standard ID Card', layout: 'Horizontal' }]}
  />;
}

export function TransferCertificatesPage() {
  return <GenericCrudPage
    title="Transfer Certificates" breadcrumbs={[{ label: 'Student Info' }, { label: 'Transfer Certificate' }]}
    apiPath="/api/v1/students/certificates"
    addLabel="Generate Certificate"
    columns={[
      { label: 'Student Name', key: 'studentName' },
      { label: 'Certificate No', key: 'certNo' },
      { label: 'Issue Date', key: 'issueDate' },
    ]}
    formFields={[
      { key: 'studentName', label: 'Student Name', required: true },
      { key: 'certNo', label: 'Certificate Number', required: true },
      { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
    ]}
    mockData={[{ id: 1, studentName: 'Rahul Kumar', certNo: 'TC-2026-042', issueDate: '2026-06-20' }]}
  />;
}

export function StudentPromotionPage() {
  return <GenericCrudPage
    title="Student Promotion" breadcrumbs={[{ label: 'Student Info' }, { label: 'Promotion' }]}
    apiPath="/api/v1/students/promote"
    addLabel="Promote Students"
    columns={[
      { label: 'Student', key: 'studentName' },
      { label: 'Current Class', key: 'currentClass' },
      { label: 'Promoted To Class', key: 'promoteClass' },
    ]}
    formFields={[
      { key: 'studentName', label: 'Student Name', required: true },
      { key: 'currentClass', label: 'Current Class', required: true },
      { key: 'promoteClass', label: 'Promote to Class', required: true },
    ]}
    mockData={[{ id: 1, studentName: 'Rahul Kumar', currentClass: 'Class 9', promoteClass: 'Class 10' }]}
  />;
}

export function StudentTimelinePage() {
  return <GenericCrudPage
    title="Student Timeline" breadcrumbs={[{ label: 'Student Info' }, { label: 'Timeline' }]}
    apiPath="/api/v1/students/timeline"
    addLabel="Add Timeline Event"
    columns={[
      { label: 'Student', key: 'studentName' },
      { label: 'Event Title', key: 'title' },
      { label: 'Date', key: 'date' },
    ]}
    formFields={[
      { key: 'studentName', label: 'Student Name', required: true },
      { key: 'title', label: 'Event Title', required: true },
      { key: 'date', label: 'Event Date', type: 'date', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
    ]}
    mockData={[{ id: 1, studentName: 'Rahul Kumar', title: 'Admitted into SAC College', date: '2026-06-01' }]}
  />;
}

// ═══ EXAMINATION ═════════════════════════════════════════════════════════════

export function ExamTypesPage() {
  return <GenericCrudPage
    title="Exam Types" breadcrumbs={[{ label: 'Examination' }, { label: 'Exam Types' }]}
    apiPath="/api/v1/exams/types"
    addLabel="Add Exam Type"
    columns={[{ label: 'Exam Name', key: 'name' }]}
    formFields={[{ key: 'name', label: 'Exam Name', required: true }]}
    mockData={[{ id: 1, name: 'First Term' }, { id: 2, name: 'Final Exam' }]}
  />;
}

export function ExamSetupPage() {
  return <GenericCrudPage
    title="Exam Setup" breadcrumbs={[{ label: 'Examination' }, { label: 'Setup' }]}
    apiPath="/api/v1/exams/setup"
    addLabel="Add Exam Setup"
    columns={[
      { label: 'Class', key: 'className' },
      { label: 'Exam Type', key: 'examType' },
      { label: 'Subject', key: 'subjectName' },
      { label: 'Passing Mark', key: 'passingMark' },
    ]}
    formFields={[
      { key: 'className', label: 'Class', required: true },
      { key: 'examType', label: 'Exam Type', required: true },
      { key: 'subjectName', label: 'Subject', required: true },
      { key: 'passingMark', label: 'Passing Mark', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, className: 'Class 10', examType: 'First Term', subjectName: 'Mathematics', passingMark: 40 }]}
  />;
}

export function ExamSchedulesPage() {
  return <GenericCrudPage
    title="Exam Schedules" breadcrumbs={[{ label: 'Examination' }, { label: 'Schedules' }]}
    apiPath="/api/v1/exams/schedules"
    addLabel="Add Schedule"
    columns={[
      { label: 'Exam', key: 'examName' },
      { label: 'Date', key: 'date' },
      { label: 'Room', key: 'roomNo' },
    ]}
    formFields={[
      { key: 'examName', label: 'Exam Name', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'roomNo', label: 'Room Number', required: true },
    ]}
    mockData={[{ id: 1, examName: 'Mathematics - First Term', date: '2026-07-10', roomNo: 'Room 101' }]}
  />;
}

export function MarksEntryPage() {
  return <GenericCrudPage
    title="Marks Entry" breadcrumbs={[{ label: 'Examination' }, { label: 'Marks Entry' }]}
    apiPath="/api/v1/exams/marks"
    addLabel="Add Marks"
    columns={[
      { label: 'Student', key: 'studentName' },
      { label: 'Subject', key: 'subjectName' },
      { label: 'Marks Obtained', key: 'marks' },
    ]}
    formFields={[
      { key: 'studentName', label: 'Student Name', required: true },
      { key: 'subjectName', label: 'Subject', required: true },
      { key: 'marks', label: 'Marks Obtained', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, studentName: 'Rahul Kumar', subjectName: 'Mathematics', marks: 85 }]}
  />;
}

export function ExamResultsPage() {
  return <GenericCrudPage
    title="Results" breadcrumbs={[{ label: 'Examination' }, { label: 'Results' }]}
    apiPath="/api/v1/exams/results"
    addLabel="Publish Result"
    columns={[
      { label: 'Student', key: 'studentName' },
      { label: 'GPA', key: 'gpa' },
      { label: 'Status', render: r => <Badge type="success">Passed</Badge> },
    ]}
    formFields={[
      { key: 'studentName', label: 'Student Name', required: true },
      { key: 'gpa', label: 'GPA', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, studentName: 'Rahul Kumar', gpa: 4.0 }]}
  />;
}

export function MarksGradesPage() {
  return <GenericCrudPage
    title="Marks Grades" breadcrumbs={[{ label: 'Examination' }, { label: 'Grades' }]}
    apiPath="/api/v1/exams/grades"
    addLabel="Add Grade"
    columns={[
      { label: 'Grade Name', key: 'name' },
      { label: 'GPA Point', key: 'gpaPoint' },
      { label: 'Min Percentage', key: 'minPercent' },
    ]}
    formFields={[
      { key: 'name', label: 'Grade Name (e.g. A+)', required: true },
      { key: 'gpaPoint', label: 'GPA Point', type: 'number', required: true },
      { key: 'minPercent', label: 'Min Percentage', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, name: 'A+', gpaPoint: 5, minPercent: 80 }]}
  />;
}

// ═══ ONLINE EXAMS ════════════════════════════════════════════════════════════

export function QuestionBanksPage() {
  return <GenericCrudPage
    title="Question Banks" breadcrumbs={[{ label: 'Online Exam' }, { label: 'Question Bank' }]}
    apiPath="/api/v1/exams/questions"
    addLabel="Add Question"
    columns={[
      { label: 'Group', key: 'group' },
      { label: 'Question', key: 'question' },
    ]}
    formFields={[
      { key: 'group', label: 'Question Group', required: true },
      { key: 'question', label: 'Question Text', type: 'textarea', required: true },
    ]}
    mockData={[{ id: 1, group: 'General Science', question: 'What is the speed of light?' }]}
  />;
}

export function QuestionGroupsPage() {
  return <GenericCrudPage
    title="Question Groups" breadcrumbs={[{ label: 'Online Exam' }, { label: 'Question Groups' }]}
    apiPath="/api/v1/exams/question-groups"
    addLabel="Add Group"
    columns={[{ label: 'Group Title', key: 'title' }]}
    formFields={[{ key: 'title', label: 'Group Title', required: true }]}
    mockData={[{ id: 1, title: 'Science Exam Questions' }]}
  />;
}

export function OnlineExamsPage() {
  return <GenericCrudPage
    title="Online Exams" breadcrumbs={[{ label: 'Online Exam' }, { label: 'Exams' }]}
    apiPath="/api/v1/exams/online"
    addLabel="Add Online Exam"
    columns={[
      { label: 'Exam Title', key: 'title' },
      { label: 'Subject', key: 'subject' },
      { label: 'Duration (Mins)', key: 'duration' },
    ]}
    formFields={[
      { key: 'title', label: 'Exam Title', required: true },
      { key: 'subject', label: 'Subject', required: true },
      { key: 'duration', label: 'Duration (Minutes)', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, title: 'Midterm Science Test', subject: 'Science', duration: 60 }]}
  />;
}

// ═══ FEES COLLECTION ═════════════════════════════════════════════════════════

export function FeeTypesPage() {
  return <GenericCrudPage
    title="Fee Types" breadcrumbs={[{ label: 'Fees' }, { label: 'Fee Types' }]}
    apiPath="/api/v1/fees/types"
    addLabel="Add Fee Type"
    columns={[
      { label: 'Fee Type', key: 'name' },
      { label: 'Description', key: 'description' },
    ]}
    formFields={[
      { key: 'name', label: 'Fee Type Name', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
    ]}
    mockData={[{ id: 1, name: 'Tuition Fee', description: 'Academic tuition charge' }]}
  />;
}

export function FeeAssignPage() {
  return <GenericCrudPage
    title="Fee Assign" breadcrumbs={[{ label: 'Fees' }, { label: 'Assign' }]}
    apiPath="/api/v1/fees/assign"
    addLabel="Assign Fee Group"
    columns={[
      { label: 'Group', key: 'groupName' },
      { label: 'Class', key: 'className' },
    ]}
    formFields={[
      { key: 'groupName', label: 'Fee Group', required: true },
      { key: 'className', label: 'Class', required: true },
    ]}
    mockData={[{ id: 1, groupName: 'Standard Fees', className: 'Class 10' }]}
  />;
}

export function FeeInvoicePage() {
  return <GenericCrudPage
    title="Fee Invoice" breadcrumbs={[{ label: 'Fees' }, { label: 'Invoice' }]}
    apiPath="/api/v1/fees/invoices"
    addLabel="Generate Invoice"
    columns={[
      { label: 'Invoice No', key: 'invoiceNo' },
      { label: 'Student', key: 'studentName' },
      { label: 'Due Date', key: 'dueDate' },
      { label: 'Amount (₹)', key: 'amount' },
    ]}
    formFields={[
      { key: 'invoiceNo', label: 'Invoice Number', required: true },
      { key: 'studentName', label: 'Student Name', required: true },
      { key: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { key: 'amount', label: 'Amount (₹)', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, invoiceNo: 'INV-2026-001', studentName: 'Rahul Kumar', dueDate: '2026-07-05', amount: 15000 }]}
  />;
}

export function FeePaymentsPage() {
  return <GenericCrudPage
    title="Fee Payments" breadcrumbs={[{ label: 'Fees' }, { label: 'Payments' }]}
    apiPath="/api/v1/fees/payments"
    addLabel="Record Payment"
    columns={[
      { label: 'Student', key: 'studentName' },
      { label: 'Paid Amount (₹)', key: 'amount' },
      { label: 'Date', key: 'date' },
    ]}
    formFields={[
      { key: 'studentName', label: 'Student Name', required: true },
      { key: 'amount', label: 'Paid Amount (₹)', type: 'number', required: true },
      { key: 'date', label: 'Payment Date', type: 'date', required: true },
    ]}
    mockData={[{ id: 1, studentName: 'Rahul Kumar', amount: 15000, date: '2026-06-21' }]}
  />;
}

export function FeeDiscountsPage() {
  return <GenericCrudPage
    title="Fee Discounts" breadcrumbs={[{ label: 'Fees' }, { label: 'Discounts' }]}
    apiPath="/api/v1/fees/discounts"
    addLabel="Add Discount"
    columns={[
      { label: 'Discount Name', key: 'name' },
      { label: 'Discount Code', key: 'code' },
      { label: 'Amount (₹)', key: 'amount' },
    ]}
    formFields={[
      { key: 'name', label: 'Discount Name', required: true },
      { key: 'code', label: 'Discount Code', required: true },
      { key: 'amount', label: 'Discount Amount (₹)', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, name: 'Sibling Discount', code: 'SIB20', amount: 3000 }]}
  />;
}

// ═══ ATTENDANCE ══════════════════════════════════════════════════════════════

export function StudentAttendancePage() {
  return <GenericCrudPage
    title="Student Attendance" breadcrumbs={[{ label: 'Attendance' }, { label: 'Student Attendance' }]}
    apiPath="/api/v1/attendance/students"
    addLabel="Mark Attendance"
    columns={[
      { label: 'Class', key: 'className' },
      { label: 'Section', key: 'sectionName' },
      { label: 'Date', key: 'date' },
    ]}
    formFields={[
      { key: 'className', label: 'Class', required: true },
      { key: 'sectionName', label: 'Section', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
    ]}
    mockData={[{ id: 1, className: 'Class 10', sectionName: 'A', date: '2026-06-23' }]}
  />;
}

export function StaffAttendancePage() {
  return <GenericCrudPage
    title="Staff Attendance" breadcrumbs={[{ label: 'Attendance' }, { label: 'Staff Attendance' }]}
    apiPath="/api/v1/attendance/staff"
    addLabel="Mark Staff Attendance"
    columns={[
      { label: 'Department', key: 'departmentName' },
      { label: 'Date', key: 'date' },
    ]}
    formFields={[
      { key: 'departmentName', label: 'Department', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
    ]}
    mockData={[{ id: 1, departmentName: 'Science Department', date: '2026-06-23' }]}
  />;
}

// ═══ LIBRARY ═════════════════════════════════════════════════════════════════

export function AllBooksPage() {
  return <GenericCrudPage
    title="All Books" breadcrumbs={[{ label: 'Library' }, { label: 'All Books' }]}
    apiPath="/api/v1/library/books"
    addLabel="Add Book"
    columns={[
      { label: 'Book Title', key: 'bookTitle' },
      { label: 'Author', key: 'authorName' },
      { label: 'Quantity', key: 'quantity' },
    ]}
    formFields={[
      { key: 'bookTitle', label: 'Book Title', required: true },
      { key: 'authorName', label: 'Author', required: true },
      { key: 'quantity', label: 'Quantity', type: 'number', required: true },
    ]}
    mockData={[
      { id: 1, bookTitle: 'Concepts of Physics', authorName: 'H.C. Verma', quantity: 15 },
      { id: 2, bookTitle: 'Higher Algebra', authorName: 'Hall & Knight', quantity: 8 },
    ]}
  />;
}

export function BookCategoriesPage() {
  return <GenericCrudPage
    title="Book Categories" breadcrumbs={[{ label: 'Library' }, { label: 'Categories' }]}
    apiPath="/api/v1/library/categories"
    addLabel="Add Category"
    columns={[{ label: 'Category Name', key: 'name' }]}
    formFields={[{ key: 'name', label: 'Category Name', required: true }]}
    mockData={[{ id: 1, name: 'Science' }, { id: 2, name: 'Mathematics' }]}
  />;
}

export function IssueBookPage() {
  return <GenericCrudPage
    title="Issue Book" breadcrumbs={[{ label: 'Library' }, { label: 'Issue Book' }]}
    apiPath="/api/v1/library/books/issue"
    addLabel="Issue Book"
    columns={[
      { label: 'Book Title', key: 'bookTitle' },
      { label: 'Member Card ID', key: 'memberCardId' },
      { label: 'Issue Date', key: 'issueDate' },
    ]}
    formFields={[
      { key: 'bookTitle', label: 'Book Title', required: true },
      { key: 'memberCardId', label: 'Member Card ID', required: true },
      { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
    ]}
    mockData={[{ id: 1, bookTitle: 'Concepts of Physics', memberCardId: 'LIB-STUD-201', issueDate: '2026-06-20' }]}
  />;
}

export function ReturnBookPage() {
  return <GenericCrudPage
    title="Return Book" breadcrumbs={[{ label: 'Library' }, { label: 'Return Book' }]}
    apiPath="/api/v1/library/books/return"
    addLabel="Return Book Record"
    columns={[
      { label: 'Book Title', key: 'bookTitle' },
      { label: 'Member Card ID', key: 'memberCardId' },
      { label: 'Return Date', key: 'returnDate' },
    ]}
    formFields={[
      { key: 'bookTitle', label: 'Book Title', required: true },
      { key: 'memberCardId', label: 'Member Card ID', required: true },
      { key: 'returnDate', label: 'Return Date', type: 'date', required: true },
    ]}
    mockData={[{ id: 1, bookTitle: 'Concepts of Physics', memberCardId: 'LIB-STUD-201', returnDate: '2026-06-23' }]}
  />;
}

// ═══ TRANSPORT ═══════════════════════════════════════════════════════════════

export function TransportRoutesPage() {
  return <GenericCrudPage
    title="Routes" breadcrumbs={[{ label: 'Transport' }, { label: 'Routes' }]}
    apiPath="/api/v1/transport/routes"
    addLabel="Add Route"
    columns={[
      { label: 'Route Title', key: 'routeTitle' },
      { label: 'Fare (₹)', key: 'fare' },
    ]}
    formFields={[
      { key: 'routeTitle', label: 'Route Title', required: true, placeholder: 'e.g. North Route' },
      { key: 'fare', label: 'Fare (₹)', type: 'number', required: true, placeholder: 'e.g. 500' },
    ]}
    mockData={[
      { id: 1, routeTitle: 'North Route', fare: 800 },
      { id: 2, routeTitle: 'South Route', fare: 600 },
    ]}
  />;
}

export function TransportVehiclesPage() {
  return <GenericCrudPage
    title="Vehicles" breadcrumbs={[{ label: 'Transport' }, { label: 'Vehicles' }]}
    apiPath="/api/v1/transport/vehicles"
    addLabel="Add Vehicle"
    columns={[
      { label: 'Vehicle No', key: 'vehicleNo' },
      { label: 'Model', key: 'vehicleModel' },
      { label: 'Driver Name', key: 'driverName' },
    ]}
    formFields={[
      { key: 'vehicleNo', label: 'Vehicle Number', required: true },
      { key: 'vehicleModel', label: 'Vehicle Model', required: true },
      { key: 'driverName', label: 'Driver Name', required: true },
    ]}
    mockData={[{ id: 1, vehicleNo: 'DL-01-A-1234', vehicleModel: 'Tata Starbus', driverName: 'Mohan Lal' }]}
  />;
}

export function AssignVehiclePage() {
  return <GenericCrudPage
    title="Assign Vehicle" breadcrumbs={[{ label: 'Transport' }, { label: 'Assign' }]}
    apiPath="/api/v1/transport/assign"
    addLabel="Assign Vehicle"
    columns={[
      { label: 'Route', key: 'routeTitle' },
      { label: 'Vehicle No', key: 'vehicleNo' },
    ]}
    formFields={[
      { key: 'routeTitle', label: 'Route Title', required: true },
      { key: 'vehicleNo', label: 'Vehicle Number', required: true },
    ]}
    mockData={[{ id: 1, routeTitle: 'North Route', vehicleNo: 'DL-01-A-1234' }]}
  />;
}

// ═══ DORMITORY (HOSTELS) ═════════════════════════════════════════════════════

export function HostelsPage() {
  return <GenericCrudPage
    title="Hostels" breadcrumbs={[{ label: 'Dormitory' }, { label: 'Hostels' }]}
    apiPath="/api/v1/dormitory/hostels"
    addLabel="Add Hostel"
    columns={[
      { label: 'Hostel Name', key: 'hostelName' },
      { label: 'Type', key: 'hostelType' },
      { label: 'Address', key: 'address' },
    ]}
    formFields={[
      { key: 'hostelName', label: 'Hostel Name', required: true },
      { key: 'hostelType', label: 'Hostel Type', type: 'select', required: true, options: [{ value: 'Boys', label: 'Boys' }, { value: 'Girls', label: 'Girls' }] },
      { key: 'address', label: 'Address', type: 'textarea' },
    ]}
    mockData={[{ id: 1, hostelName: 'Tagore Boys Hostel', hostelType: 'Boys', address: 'Campus Block B' }]}
  />;
}

export function RoomTypesPage() {
  return <GenericCrudPage
    title="Room Types" breadcrumbs={[{ label: 'Dormitory' }, { label: 'Room Types' }]}
    apiPath="/api/v1/dormitory/room-types"
    addLabel="Add Room Type"
    columns={[{ label: 'Room Type', key: 'name' }]}
    formFields={[{ key: 'name', label: 'Room Type Name', required: true }]}
    mockData={[{ id: 1, name: 'AC Single' }, { id: 2, name: 'Non-AC Sharing' }]}
  />;
}

export function DormitoryRoomsPage() {
  return <GenericCrudPage
    title="Rooms" breadcrumbs={[{ label: 'Dormitory' }, { label: 'Rooms' }]}
    apiPath="/api/v1/dormitory/rooms"
    addLabel="Add Room"
    columns={[
      { label: 'Room Number', key: 'roomNo' },
      { label: 'Hostel', key: 'hostelName' },
      { label: 'Number of Beds', key: 'numberOfBeds' },
    ]}
    formFields={[
      { key: 'roomNo', label: 'Room Number', required: true },
      { key: 'hostelName', label: 'Hostel Name', required: true },
      { key: 'numberOfBeds', label: 'Number of Beds', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, roomNo: 'Room 203', hostelName: 'Tagore Boys Hostel', numberOfBeds: 3 }]}
  />;
}

// ═══ HUMAN RESOURCE (HR) ═════════════════════════════════════════════════════

export function AllStaffPage() {
  return <GenericCrudPage
    title="All Staff" breadcrumbs={[{ label: 'Human Resource' }, { label: 'All Staff' }]}
    apiPath="/api/v1/hr/staffs"
    addLabel="Add Staff"
    columns={[
      { label: 'Name', key: 'fullName' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'mobile' },
      { label: 'Status', render: () => <Badge type="success">Active</Badge> },
    ]}
    formFields={[
      { key: 'fullName', label: 'Full Name', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'mobile', label: 'Phone Number', required: true },
    ]}
    mockData={[{ id: 1, fullName: 'Ram Singh', email: 'ram@school.com', mobile: '9811224455' }]}
  />;
}

export function DepartmentsPage() {
  return <GenericCrudPage
    title="Departments" breadcrumbs={[{ label: 'Human Resource' }, { label: 'Departments' }]}
    apiPath="/api/v1/hr/departments"
    addLabel="Add Department"
    columns={[{ label: 'Department Name', key: 'name' }]}
    formFields={[{ key: 'name', label: 'Department Name', required: true }]}
    mockData={[{ id: 1, name: 'Science' }, { id: 2, name: 'Administration' }]}
  />;
}

export function DesignationsPage() {
  return <GenericCrudPage
    title="Designations" breadcrumbs={[{ label: 'Human Resource' }, { label: 'Designations' }]}
    apiPath="/api/v1/hr/designations"
    addLabel="Add Designation"
    columns={[{ label: 'Designation Name', key: 'name' }]}
    formFields={[{ key: 'name', label: 'Designation Name', required: true }]}
    mockData={[{ id: 1, name: 'Senior Teacher' }, { id: 2, name: 'Office Assistant' }]}
  />;
}

export function LeaveRequestsPage() {
  return <GenericCrudPage
    title="Leave Requests" breadcrumbs={[{ label: 'Human Resource' }, { label: 'Leave Requests' }]}
    apiPath="/api/v1/hr/leaves"
    addLabel="Apply Leave"
    columns={[
      { label: 'Staff Name', key: 'staffName' },
      { label: 'Start Date', key: 'startDate' },
      { label: 'Status', render: () => <Badge type="warning">Pending</Badge> },
    ]}
    formFields={[
      { key: 'staffName', label: 'Staff Name', required: true },
      { key: 'startDate', label: 'Start Date', type: 'date', required: true },
      { key: 'endDate', label: 'End Date', type: 'date', required: true },
      { key: 'reason', label: 'Reason', type: 'textarea' },
    ]}
    mockData={[{ id: 1, staffName: 'Ram Singh', startDate: '2026-06-25' }]}
  />;
}

export function PayrollPage() {
  return <GenericCrudPage
    title="Payroll" breadcrumbs={[{ label: 'Human Resource' }, { label: 'Payroll' }]}
    apiPath="/api/v1/hr/payroll"
    addLabel="Generate Payroll"
    columns={[
      { label: 'Staff Name', key: 'staffName' },
      { label: 'Net Salary', key: 'netSalary' },
      { label: 'Status', render: () => <Badge type="success">Paid</Badge> },
    ]}
    formFields={[
      { key: 'staffName', label: 'Staff Name', required: true },
      { key: 'netSalary', label: 'Net Salary (₹)', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, staffName: 'Ram Singh', netSalary: 35000 }]}
  />;
}

// ═══ FINANCE & ACCOUNTS ══════════════════════════════════════════════════════

export function ChartOfAccountsPage() {
  return <GenericCrudPage
    title="Chart of Accounts" breadcrumbs={[{ label: 'Accounts' }, { label: 'Chart of Accounts' }]}
    apiPath="/api/v1/finance/accounts"
    addLabel="Add Account"
    columns={[
      { label: 'Account Name', key: 'name' },
      { label: 'Type', key: 'type' },
    ]}
    formFields={[
      { key: 'name', label: 'Account Name', required: true },
      { key: 'type', label: 'Account Type', type: 'select', required: true, options: [{ value: 'Income', label: 'Income' }, { value: 'Expense', label: 'Expense' }] },
    ]}
    mockData={[{ id: 1, name: 'Tuition Fee Income', type: 'Income' }, { id: 2, name: 'Staff Salary Expense', type: 'Expense' }]}
  />;
}

export function IncomePage() {
  return <GenericCrudPage
    title="Income" breadcrumbs={[{ label: 'Accounts' }, { label: 'Income' }]}
    apiPath="/api/v1/finance/incomes"
    addLabel="Add Income"
    columns={[
      { label: 'Name', key: 'name' },
      { label: 'Amount (₹)', key: 'amount' },
      { label: 'Date', key: 'date' },
    ]}
    formFields={[
      { key: 'name', label: 'Income Source', required: true },
      { key: 'amount', label: 'Amount (₹)', type: 'number', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
    ]}
    mockData={[{ id: 1, name: 'Donation Received', amount: 50000, date: '2026-06-20' }]}
  />;
}

export function ExpensesPage() {
  return <GenericCrudPage
    title="Expenses" breadcrumbs={[{ label: 'Accounts' }, { label: 'Expenses' }]}
    apiPath="/api/v1/finance/expenses"
    addLabel="Add Expense"
    columns={[
      { label: 'Name', key: 'name' },
      { label: 'Amount (₹)', key: 'amount' },
      { label: 'Date', key: 'date' },
    ]}
    formFields={[
      { key: 'name', label: 'Expense Name', required: true },
      { key: 'amount', label: 'Amount (₹)', type: 'number', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
    ]}
    mockData={[{ id: 1, name: 'Internet Bill', amount: 3500, date: '2026-06-23' }]}
  />;
}

export function BankAccountsPage() {
  return <GenericCrudPage
    title="Bank Accounts" breadcrumbs={[{ label: 'Accounts' }, { label: 'Bank Accounts' }]}
    apiPath="/api/v1/finance/banks"
    addLabel="Add Bank Account"
    columns={[
      { label: 'Bank Name', key: 'bankName' },
      { label: 'Account Name', key: 'accountName' },
      { label: 'Balance (₹)', key: 'balance' },
    ]}
    formFields={[
      { key: 'bankName', label: 'Bank Name', required: true },
      { key: 'accountName', label: 'Account Name', required: true },
      { key: 'balance', label: 'Opening Balance (₹)', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, bankName: 'State Bank of India', accountName: 'School Operational A/C', balance: 450000 }]}
  />;
}

// ═══ INVENTORY ═══════════════════════════════════════════════════════════════

export function InventoryItemsPage() {
  return <GenericCrudPage
    title="Items" breadcrumbs={[{ label: 'Inventory' }, { label: 'Items' }]}
    apiPath="/api/v1/inventory/items"
    addLabel="Add Item"
    columns={[
      { label: 'Item Name', key: 'itemName' },
      { label: 'Quantity', key: 'quantity' },
    ]}
    formFields={[
      { key: 'itemName', label: 'Item Name', required: true },
      { key: 'quantity', label: 'Quantity', type: 'number', required: true },
    ]}
    mockData={[{ id: 1, itemName: 'Desk Bench Sets', quantity: 150 }, { id: 2, itemName: 'Marker Pens', quantity: 200 }]}
  />;
}

export function InventorySuppliersPage() {
  return <GenericCrudPage
    title="Suppliers" breadcrumbs={[{ label: 'Inventory' }, { label: 'Suppliers' }]}
    apiPath="/api/v1/inventory/suppliers"
    addLabel="Add Supplier"
    columns={[
      { label: 'Supplier Name', key: 'name' },
      { label: 'Phone', key: 'phone' },
    ]}
    formFields={[
      { key: 'name', label: 'Supplier Name', required: true },
      { key: 'phone', label: 'Phone', required: true },
    ]}
    mockData={[{ id: 1, name: 'Vikas Furniture Works', phone: '9844332211' }]}
  />;
}

// ═══ COMMUNICATE & NOTICES ═══════════════════════════════════════════════════

export function NoticeBoardPage() {
  return <GenericCrudPage
    title="Notice Board" breadcrumbs={[{ label: 'Communicate' }, { label: 'Notice Board' }]}
    apiPath="/api/v1/notifications"
    addLabel="Publish Notice"
    columns={[
      { label: 'Title', key: 'title' },
      { label: 'Message', key: 'message' },
    ]}
    formFields={[
      { key: 'title', label: 'Notice Title', required: true },
      { key: 'message', label: 'Notice Message', type: 'textarea', required: true },
    ]}
    mockData={[{ id: 1, title: 'Summer Vacation Announcement', message: 'School will remain closed from July 1st to July 15th.' }]}
  />;
}

// ═══ SYSTEM SETTINGS ═════════════════════════════════════════════════════════

export function GeneralSettingsPage() {
  return <GenericCrudPage
    title="General Settings" breadcrumbs={[{ label: 'System Settings' }, { label: 'General' }]}
    apiPath="/api/v1/admin/settings"
    addLabel="Update Settings"
    columns={[
      { label: 'Setting Name', key: 'key' },
      { label: 'Value', key: 'value' },
    ]}
    formFields={[
      { key: 'key', label: 'Setting Name', required: true },
      { key: 'value', label: 'Setting Value', required: true },
    ]}
    mockData={[
      { id: 1, key: 'School Name', value: 'SAC College' },
      { id: 2, key: 'Academic Year', value: '2026' },
    ]}
  />;
}

// ═══ ROLES ═══════════════════════════════════════════════════════════════════

export function RolesPage() {
  return <GenericCrudPage
    title="Roles" breadcrumbs={[{ label: 'Role & Permissions' }, { label: 'Roles' }]}
    apiPath="/api/v1/roles"
    addLabel="Add Role"
    columns={[{ label: 'Role Name', key: 'name' }]}
    formFields={[{ key: 'name', label: 'Role Name', required: true }]}
    mockData={[
      { id: 1, name: 'Super admin' },
      { id: 2, name: 'Admin' },
      { id: 3, name: 'Teacher' },
      { id: 4, name: 'Student' },
      { id: 5, name: 'Parents' },
    ]}
  />;
}

// ═══ ADDED SUB-MODULES ════════════════════════════════════════════════════════

export function BulkStudentUploadPage() {
  return (
    <div className="white_card" style={{ padding: 24 }}>
      <div className="white_card_header" style={{ paddingLeft: 0 }}>
        <h4>Bulk Student Upload</h4>
      </div>
      <div className="white_card_body">
        <form onSubmit={e => { e.preventDefault(); alert("Bulk students uploaded successfully!"); }}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Select CSV File</label>
                <input type="file" className="form-control" accept=".csv" required style={{ border: '1px solid #ddd', padding: 8, borderRadius: 4, width: '100%' }} />
              </div>
            </div>
          </div>
          <button type="submit" className="primary_btn" style={{ marginTop: 16 }}>Upload CSV</button>
        </form>
      </div>
    </div>
  );
}

export function FeeCarryForwardPage() {
  return <GenericCrudPage
    title="Fee Carry Forward" breadcrumbs={[{ label: 'Fees' }, { label: 'Carry Forward' }]}
    apiPath="/api/v1/fees/carry-forward"
    addLabel="Carry Forward"
    columns={[
      { label: 'Student', key: 'studentName' },
      { label: 'Carry Forward Amount (₹)', key: 'amount' }
    ]}
    formFields={[
      { key: 'studentName', label: 'Student Name', required: true },
      { key: 'amount', label: 'Amount (₹)', type: 'number', required: true }
    ]}
    mockData={[{ id: 1, studentName: 'Rahul Kumar', amount: 1500 }]}
  />;
}

export function FeeInstallmentsPage() {
  return <GenericCrudPage
    title="Fee Installments" breadcrumbs={[{ label: 'Fees' }, { label: 'Installments' }]}
    apiPath="/api/v1/fees/installments"
    addLabel="Add Installment Plan"
    columns={[
      { label: 'Plan Name', key: 'name' },
      { label: 'Installments Count', key: 'count' },
      { label: 'Amount Percentage (%)', key: 'percent' }
    ]}
    formFields={[
      { key: 'name', label: 'Plan Name', required: true },
      { key: 'count', label: 'Installments Count', type: 'number', required: true },
      { key: 'percent', label: 'Amount Percentage (%)', type: 'number', required: true }
    ]}
    mockData={[{ id: 1, name: 'Term Installment', count: 3, percent: 33.3 }]}
  />;
}

export function FeeInvoiceSettingsPage() {
  return <GenericCrudPage
    title="Invoice Settings" breadcrumbs={[{ label: 'Fees' }, { label: 'Invoice Settings' }]}
    apiPath="/api/v1/fees/invoice-settings"
    addLabel="Save Settings"
    columns={[
      { label: 'Setting Name', key: 'key' },
      { label: 'Setting Value', key: 'value' }
    ]}
    formFields={[
      { key: 'key', label: 'Setting Key', required: true },
      { key: 'value', label: 'Value', required: true }
    ]}
    mockData={[
      { id: 1, key: 'Invoice Prefix', value: 'INV-2026-' },
      { id: 2, key: 'Due Days Limit', value: '15' }
    ]}
  />;
}

export function AbsentNotificationsPage() {
  return <GenericCrudPage
    title="Absent Notifications" breadcrumbs={[{ label: 'Attendance' }, { label: 'Notifications' }]}
    apiPath="/api/v1/attendance/notifications"
    addLabel="Schedule Notification"
    columns={[
      { label: 'Notification Name', key: 'name' },
      { label: 'Recipient Role', key: 'role' },
      { label: 'Status', render: () => <Badge type="success">Active</Badge> }
    ]}
    formFields={[
      { key: 'name', label: 'Notification Name', required: true },
      { key: 'role', label: 'Recipient Role', required: true }
    ]}
    mockData={[{ id: 1, name: 'Daily Absentees SMS', role: 'Parents' }]}
  />;
}

export function BookBankPage() {
  return <GenericCrudPage
    title="Book Bank" breadcrumbs={[{ label: 'Library' }, { label: 'Book Bank' }]}
    apiPath="/api/v1/library/book-bank"
    addLabel="Add Book to Bank"
    columns={[
      { label: 'Book Title', key: 'title' },
      { label: 'Contributor', key: 'contributor' }
    ]}
    formFields={[
      { key: 'title', label: 'Book Title', required: true },
      { key: 'contributor', label: 'Contributor', required: true }
    ]}
    mockData={[{ id: 1, title: 'Organic Chemistry', contributor: 'Pass-out Batch 2025' }]}
  />;
}

export function SendEmailPage() {
  return (
    <div className="white_card" style={{ padding: 24 }}>
      <div className="white_card_header" style={{ paddingLeft: 0 }}>
        <h4>Send Email</h4>
      </div>
      <div className="white_card_body">
        <form onSubmit={e => { e.preventDefault(); alert("Email Sent!"); }}>
          <div className="form-group">
            <label>Subject</label>
            <input type="text" className="form-control" placeholder="Email Subject" required style={{ border: '1px solid #ddd', padding: 8, borderRadius: 4, width: '100%', marginBottom: 12 }} />
          </div>
          <div className="form-group">
            <label>Recipients</label>
            <input type="text" className="form-control" placeholder="All, Parents, Teachers, Students" required style={{ border: '1px solid #ddd', padding: 8, borderRadius: 4, width: '100%', marginBottom: 12 }} />
          </div>
          <div className="form-group">
            <label>Message Content</label>
            <textarea className="form-control" rows={5} placeholder="Write email text..." required style={{ border: '1px solid #ddd', padding: 8, borderRadius: 4, width: '100%', marginBottom: 12 }} />
          </div>
          <button type="submit" className="primary_btn">Send Email</button>
        </form>
      </div>
    </div>
  );
}

export function SendSmsPage() {
  return (
    <div className="white_card" style={{ padding: 24 }}>
      <div className="white_card_header" style={{ paddingLeft: 0 }}>
        <h4>Send SMS</h4>
      </div>
      <div className="white_card_body">
        <form onSubmit={e => { e.preventDefault(); alert("SMS Queue Started!"); }}>
          <div className="form-group">
            <label>Recipients</label>
            <input type="text" className="form-control" placeholder="All Parents, Teachers..." required style={{ border: '1px solid #ddd', padding: 8, borderRadius: 4, width: '100%', marginBottom: 12 }} />
          </div>
          <div className="form-group">
            <label>SMS Message</label>
            <textarea className="form-control" maxLength={160} rows={3} placeholder="Write SMS message (max 160 chars)..." required style={{ border: '1px solid #ddd', padding: 8, borderRadius: 4, width: '100%', marginBottom: 12 }} />
          </div>
          <button type="submit" className="primary_btn">Send SMS</button>
        </form>
      </div>
    </div>
  );
}

export function CmsEventsPage() {
  return <GenericCrudPage
    title="Events" breadcrumbs={[{ label: 'Communicate' }, { label: 'Events' }]}
    apiPath="/api/v1/cms/events"
    addLabel="Add Event"
    columns={[
      { label: 'Event Title', key: 'title' },
      { label: 'Date', key: 'date' },
      { label: 'Location', key: 'location' }
    ]}
    formFields={[
      { key: 'title', label: 'Event Title', required: true },
      { key: 'date', label: 'Event Date', type: 'date', required: true },
      { key: 'location', label: 'Location', required: true }
    ]}
    mockData={[{ id: 1, title: 'Annual Cultural Fest', date: '2026-11-20', location: 'Main Auditorium' }]}
  />;
}

export function PhoneCallLogsPage() {
  return <GenericCrudPage
    title="Phone Call Logs" breadcrumbs={[{ label: 'Communicate' }, { label: 'Phone Logs' }]}
    apiPath="/api/v1/communicate/phone-logs"
    addLabel="Log Call"
    columns={[
      { label: 'Phone', key: 'phone' },
      { label: 'Call Recipient', key: 'name' },
      { label: 'Duration (Mins)', key: 'duration' }
    ]}
    formFields={[
      { key: 'phone', label: 'Phone Number', required: true },
      { key: 'name', label: 'Name', required: true },
      { key: 'duration', label: 'Duration (Mins)', type: 'number', required: true }
    ]}
    mockData={[{ id: 1, phone: '+91 9998887776', name: 'Ramesh Kumar (Parent)', duration: 5 }]}
  />;
}

export function PostalReceivePage() {
  return <GenericCrudPage
    title="Postal Receive" breadcrumbs={[{ label: 'Communicate' }, { label: 'Postal Receive' }]}
    apiPath="/api/v1/admin/postal"
    addLabel="Receive Entry"
    columns={[
      { label: 'From Title', key: 'fromTitle' },
      { label: 'Reference No', key: 'referenceNo' },
      { label: 'Date', key: 'date' }
    ]}
    formFields={[
      { key: 'fromTitle', label: 'From Title', required: true },
      { key: 'referenceNo', label: 'Reference Number', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true }
    ]}
    mockData={[{ id: 1, fromTitle: 'Board of Education', referenceNo: 'BOE-9021', date: '2026-06-22' }]}
  />;
}

export function PostalDispatchPage() {
  return <GenericCrudPage
    title="Postal Dispatch" breadcrumbs={[{ label: 'Communicate' }, { label: 'Postal Dispatch' }]}
    apiPath="/api/v1/admin/postal"
    addLabel="Dispatch Entry"
    columns={[
      { label: 'To Title', key: 'toTitle' },
      { label: 'Reference No', key: 'referenceNo' },
      { label: 'Date', key: 'date' }
    ]}
    formFields={[
      { key: 'toTitle', label: 'To Title', required: true },
      { key: 'referenceNo', label: 'Reference Number', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true }
    ]}
    mockData={[{ id: 1, toTitle: 'KVS Regional Office', referenceNo: 'KVS-OUT-302', date: '2026-06-23' }]}
  />;
}

function SimpleReportPage({ title }) {
  return (
    <div className="white_card" style={{ padding: 24 }}>
      <h4>{title}</h4>
      <p style={{ color: '#666', marginBottom: 20 }}>Generated reports and analytical summary data.</p>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1, padding: 20, background: '#f9f9f9', borderRadius: 8 }}>
          <h5 style={{ fontWeight: 600 }}>Total Records</h5>
          <span style={{ fontSize: 24, fontWeight: 700 }}>120</span>
        </div>
        <div style={{ flex: 1, padding: 20, background: '#f9f9f9', borderRadius: 8 }}>
          <h5 style={{ fontWeight: 600 }}>Status</h5>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#28a745' }}>Active</span>
        </div>
      </div>
    </div>
  );
}

export function StudentReportPage() { return <SimpleReportPage title="Student Report" />; }
export function AttendanceReportPage() { return <SimpleReportPage title="Attendance Report" />; }
export function FeesReportPage() { return <SimpleReportPage title="Fees Report" />; }
export function ExamReportPage() { return <SimpleReportPage title="Exam Report" />; }
export function HrReportPage() { return <SimpleReportPage title="HR Report" />; }
export function AccountReportPage() { return <SimpleReportPage title="Account Report" />; }
export function UserLogReportPage() { return <SimpleReportPage title="User Log Report" />; }

export function VideoWatchPage() {
  return <GenericCrudPage
    title="Video Watch" breadcrumbs={[{ label: 'Modules' }, { label: 'Video Watch' }]}
    apiPath="/api/v1/videos"
    addLabel="Add Video link"
    columns={[
      { label: 'Video Title', key: 'title' },
      { label: 'URL', key: 'videoUrl' }
    ]}
    formFields={[
      { key: 'title', label: 'Video Title', required: true },
      { key: 'videoUrl', label: 'Video Link URL', required: true }
    ]}
    mockData={[{ id: 1, title: 'Introduction to Trigonometry', videoUrl: 'https://youtube.com/watch?v=trig1' }]}
  />;
}

export function WalletPage() {
  return <GenericCrudPage
    title="My Wallet" breadcrumbs={[{ label: 'Modules' }, { label: 'Wallet' }]}
    apiPath="/api/v1/wallet/settings"
    addLabel="Record Transaction"
    columns={[
      { label: 'Wallet Balance (₹)', key: 'balance' },
      { label: 'Last Transaction', key: 'lastTx' }
    ]}
    formFields={[
      { key: 'balance', label: 'Balance Amount', type: 'number', required: true },
      { key: 'lastTx', label: 'Transaction Details', required: true }
    ]}
    mockData={[{ id: 1, balance: 2500, lastTx: 'Recharged 1000 INR via UPI' }]}
  />;
}

export function DownloadCenterPage() {
  return <GenericCrudPage
    title="Download Center" breadcrumbs={[{ label: 'Modules' }, { label: 'Download Center' }]}
    apiPath="/api/v1/downloads"
    addLabel="Upload Content"
    columns={[
      { label: 'Content Title', key: 'title' },
      { label: 'File Type', key: 'contentType' },
      { label: 'Download Link', key: 'fileUrl' }
    ]}
    formFields={[
      { key: 'title', label: 'Content Title', required: true },
      { key: 'contentType', label: 'Content Type', required: true },
      { key: 'fileUrl', label: 'File Link', required: true }
    ]}
    mockData={[{ id: 1, title: 'Mathematics Syllabus 2026', contentType: 'Syllabus', fileUrl: 'syllabus_math.pdf' }]}
  />;
}

export function ChatPage() {
  return (
    <div className="white_card" style={{ padding: 24 }}>
      <h4>Active Chats</h4>
      <p style={{ color: '#666', marginBottom: 20 }}>Connect with parents, teachers, and school administrators.</p>
      <div style={{ display: 'flex', gap: 20, height: 400 }}>
        <div style={{ width: 250, borderRight: '1px solid #eee', paddingRight: 15 }}>
          <h5 style={{ fontWeight: 600, fontSize: 13, textTransform: 'uppercase', color: '#888' }}>Contacts</h5>
          <div style={{ padding: 10, background: '#f5f5f5', borderRadius: 4, cursor: 'pointer', marginBottom: 8 }}>
            <strong>Dr. Anita Sharma</strong>
            <div style={{ fontSize: 11, color: '#666' }}>Teacher</div>
          </div>
          <div style={{ padding: 10, borderRadius: 4, cursor: 'pointer' }}>
            <strong>Suresh Nair</strong>
            <div style={{ fontSize: 11, color: '#666' }}>Admin</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: 10, background: '#fafafa', borderRadius: 6, marginBottom: 15, overflowY: 'auto' }}>
            <div style={{ background: '#e1ffc7', padding: 8, borderRadius: 6, margin: '5px 0', alignSelf: 'flex-start', maxWidth: '70%' }}>
              Hello! Is the homework syllabus completed?
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="text" className="form-control" placeholder="Type a message..." style={{ flex: 1, border: '1px solid #ddd', padding: 8, borderRadius: 4 }} />
            <button className="primary_btn">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LmsCoursesPage() {
  return <GenericCrudPage
    title="LMS / Courses" breadcrumbs={[{ label: 'Modules' }, { label: 'LMS / Courses' }]}
    apiPath="/api/v1/cms/courses"
    addLabel="Add Course"
    columns={[
      { label: 'Course Title', key: 'title' },
      { label: 'Description', key: 'description' }
    ]}
    formFields={[
      { key: 'title', label: 'Course Title', required: true },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]}
    mockData={[{ id: 1, title: 'Physics Class XI - Mechanics', description: 'Elementary concepts of linear mechanics.' }]}
  />;
}

export function AlumniPage() {
  return <GenericCrudPage
    title="Alumni Directory" breadcrumbs={[{ label: 'Modules' }, { label: 'Alumni' }]}
    apiPath="/api/v1/alumni"
    addLabel="Add Alumni Profile"
    columns={[
      { label: 'Name', key: 'name' },
      { label: 'Graduation Year', key: 'gradYear' },
      { label: 'Occupation', key: 'occupation' }
    ]}
    formFields={[
      { key: 'name', label: 'Full Name', required: true },
      { key: 'gradYear', label: 'Graduation Year', type: 'number', required: true },
      { key: 'occupation', label: 'Occupation', required: true }
    ]}
    mockData={[{ id: 1, name: 'Siddharth Roy', gradYear: 2024, occupation: 'Software Engineer at Google' }]}
  />;
}

export function ClubsPage() {
  return <GenericCrudPage
    title="Clubs & Activities" breadcrumbs={[{ label: 'Modules' }, { label: 'Clubs' }]}
    apiPath="/api/v1/clubs"
    addLabel="Create Club"
    columns={[
      { label: 'Club Name', key: 'name' },
      { label: 'Leader/Teacher', key: 'leader' }
    ]}
    formFields={[
      { key: 'name', label: 'Club Name', required: true },
      { key: 'leader', label: 'Club Leader / Teacher', required: true }
    ]}
    mockData={[{ id: 1, name: 'Robotics Club', leader: 'Mr. Suresh Nair' }]}
  />;
}

export function UserForumPage() {
  return <GenericCrudPage
    title="User Forum" breadcrumbs={[{ label: 'Modules' }, { label: 'Forum' }]}
    apiPath="/api/v1/forum"
    addLabel="New Thread"
    columns={[
      { label: 'Thread Title', key: 'title' },
      { label: 'Author', key: 'author' }
    ]}
    formFields={[
      { key: 'title', label: 'Thread Title', required: true },
      { key: 'author', label: 'Author', required: true }
    ]}
    mockData={[{ id: 1, title: 'Preparations for Science Exhibition 2026', author: 'Rahul Kumar' }]}
  />;
}

export function VisitorsPage() {
  return <GenericCrudPage
    title="Visitors Log" breadcrumbs={[{ label: 'Communicate' }, { label: 'Visitors' }]}
    apiPath="/api/v1/admin/visitors"
    addLabel="Add Log"
    columns={[
      { label: 'Visitor Name', key: 'name' },
      { label: 'Purpose', key: 'purpose' },
      { label: 'Date', key: 'date' }
    ]}
    formFields={[
      { key: 'name', label: 'Visitor Name', required: true },
      { key: 'purpose', label: 'Purpose of Visit', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true }
    ]}
    mockData={[{ id: 1, name: 'Anil Deshmukh', purpose: 'Parent Teacher Meeting', date: '2026-06-23' }]}
  />;
}

export function CanteenPage() {
  return <GenericCrudPage
    title="Canteen Management" breadcrumbs={[{ label: 'Modules' }, { label: 'Canteen' }]}
    apiPath="/api/v1/canteen/items"
    addLabel="Add Food Item"
    columns={[
      { label: 'Food Name', key: 'name' },
      { label: 'Price (₹)', key: 'price' },
      { label: 'Stock Status', render: r => <Badge type={r.stock > 0 ? 'success' : 'danger'}>{r.stock > 0 ? 'In Stock' : 'Out of Stock'}</Badge> }
    ]}
    formFields={[
      { key: 'name', label: 'Food Item Name', required: true },
      { key: 'price', label: 'Price (₹)', type: 'number', required: true },
      { key: 'stock', label: 'Initial Stock', type: 'number', required: true }
    ]}
    mockData={[{ id: 1, name: 'Veg Sandwich', price: 40, stock: 50 }, { id: 2, name: 'Mango Juice', price: 25, stock: 30 }]}
  />;
}

function SimpleSettingsPage({ title }) {
  return (
    <div className="white_card" style={{ padding: 24 }}>
      <h4>{title}</h4>
      <p style={{ color: '#666', marginBottom: 20 }}>Configure system properties and integration keys.</p>
      <form onSubmit={e => { e.preventDefault(); alert("Settings updated!"); }}>
        <div className="form-group">
          <label>Enable Service / API Status</label>
          <select className="form-control" style={{ border: '1px solid #ddd', padding: 8, borderRadius: 4, width: '100%', marginBottom: 12 }}>
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>
        <div className="form-group">
          <label>API Key / Configuration Payload</label>
          <input type="password" className="form-control" value="••••••••••••••••••••••••" readOnly style={{ border: '1px solid #ddd', padding: 8, borderRadius: 4, width: '100%', marginBottom: 12 }} />
        </div>
        <button type="submit" className="primary_btn">Save Configuration</button>
      </form>
    </div>
  );
}

export function EmailSettingsPage() { return <SimpleSettingsPage title="Email Integration Settings" />; }
export function SmsSettingsPage() { return <SimpleSettingsPage title="SMS Gateway Settings" />; }
export function PaymentGatewayPage() { return <SimpleSettingsPage title="Payment Gateway Integration" />; }
export function SocialMediaPage() { return <SimpleSettingsPage title="Social Media Branding Links" />; }
export function MaintenancePage() { return <SimpleSettingsPage title="System Maintenance Settings" />; }
export function BackupPage() { return <SimpleSettingsPage title="Database Backup & Export Tools" />; }

export function PermissionsPage() {
  return <GenericCrudPage
    title="Permissions" breadcrumbs={[{ label: 'Role & Permissions' }, { label: 'Permissions' }]}
    apiPath="/api/v1/permissions/my"
    addLabel="Add Custom Permission"
    columns={[{ label: 'Permission Name', key: 'name' }]}
    formFields={[{ key: 'name', label: 'Permission Name', required: true }]}
    mockData={[
      { id: 1, name: 'students.admit' },
      { id: 2, name: 'academics.classes.create' },
      { id: 3, name: 'fees.collect' }
    ]}
  />;
}

export function CustomMenusPage() {
  return <GenericCrudPage
    title="Custom Menus" breadcrumbs={[{ label: 'Role & Permissions' }, { label: 'Custom Menus' }]}
    apiPath="/api/v1/menus/sidebar"
    addLabel="Add Custom Menu Item"
    columns={[
      { label: 'Menu Title', key: 'title' },
      { label: 'URL Path', key: 'path' }
    ]}
    formFields={[
      { key: 'title', label: 'Menu Title', required: true },
      { key: 'path', label: 'URL Path', required: true }
    ]}
    mockData={[{ id: 1, title: 'Alumni Event Portal', path: '/alumni/portal' }]}
  />;
}

function SimpleFrontCmsPage({ title }) {
  return (
    <div className="white_card" style={{ padding: 24 }}>
      <h4>{title}</h4>
      <p style={{ color: '#666', marginBottom: 20 }}>Manage front website text, images, and visual elements.</p>
      <form onSubmit={e => { e.preventDefault(); alert("CMS Section Saved!"); }}>
        <div className="form-group">
          <label>Header / Title Text</label>
          <input type="text" className="form-control" defaultValue="Welcome to SAC College ERP" style={{ border: '1px solid #ddd', padding: 8, borderRadius: 4, width: '100%', marginBottom: 12 }} />
        </div>
        <div className="form-group">
          <label>Description Body</label>
          <textarea className="form-control" rows={4} defaultValue="High standard education modules integrated seamlessly." style={{ border: '1px solid #ddd', padding: 8, borderRadius: 4, width: '100%', marginBottom: 12 }} />
        </div>
        <button type="submit" className="primary_btn">Publish Section</button>
      </form>
    </div>
  );
}

export function FrontHomePage() { return <SimpleFrontCmsPage title="Front Page Banner Settings" />; }
export function FrontAboutPage() { return <SimpleFrontCmsPage title="About Us Page CMS" />; }
export function FrontContactPage() { return <SimpleFrontCmsPage title="Contact Details & Address CMS" />; }
export function FrontEventsPage() { return <SimpleFrontCmsPage title="Front Website Events CMS" />; }
export function FrontNoticesPage() { return <SimpleFrontCmsPage title="Front Website Notice Carousel" />; }
export function FrontGalleryPage() { return <SimpleFrontCmsPage title="Media & Image Gallery Manager" />; }
export function FrontSlidersPage() { return <SimpleFrontCmsPage title="Home Banner Sliders Manager" />; }
export function FrontTestimonialsPage() { return <SimpleFrontCmsPage title="Student / Parent Testimonials CMS" />; }
