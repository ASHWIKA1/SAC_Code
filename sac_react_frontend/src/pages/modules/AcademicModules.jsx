// ─── ACADEMICS & DIRECTORY MODULE PAGES ─────────────────────────────────────────
// Bound to Java Spring Boot REST controllers in sac_spring_boot.
// Uses correct DTO field keys for seamless backend CRUD integration.

import React from 'react';
import GenericCrudPage from '../../components/GenericCrudPage';
import { Badge } from '../../components/UI';

// ═══ ACADEMICS ══════════════════════════════════════════════════════════════

export function ClassesPage() {
  return <GenericCrudPage
    title="Classes" breadcrumbs={[{ label: 'Academics' }, { label: 'Classes' }]}
    apiPath="/api/v1/academics/classes"
    addLabel="Add Class"
    searchPlaceholder="Search classes..."
    columns={[
      { label: 'Class Name', key: 'className' },
      { label: 'Pass Mark', key: 'passMark' },
      { label: 'Status', render: () => <Badge type="success">Active</Badge> },
    ]}
    formFields={[
      { key: 'className', label: 'Class Name', placeholder: 'e.g. Class 10', required: true },
      { key: 'passMark', label: 'Pass Mark', type: 'number', placeholder: 'e.g. 40', required: true },
    ]}
    mockData={[
      { id: 1, className: 'Class 1',  passMark: 40.0 },
      { id: 2, className: 'Class 2',  passMark: 40.0 },
      { id: 3, className: 'Class 6',  passMark: 40.0 },
      { id: 4, className: 'Class 10', passMark: 40.0 },
      { id: 5, className: 'Class 11', passMark: 40.0 },
      { id: 6, className: 'Class 12', passMark: 40.0 },
    ]}
  />;
}

export function SectionsPage() {
  return <GenericCrudPage
    title="Sections" breadcrumbs={[{ label: 'Academics' }, { label: 'Sections' }]}
    apiPath="/api/v1/academics/sections"
    addLabel="Add Section"
    searchPlaceholder="Search sections..."
    columns={[
      { label: 'Section Name', key: 'sectionName' },
      { label: 'Status', render: () => <Badge type="success">Active</Badge> },
    ]}
    formFields={[
      { key: 'sectionName', label: 'Section Name', placeholder: 'e.g. Section A', required: true },
    ]}
    mockData={[
      { id: 1, sectionName: 'Section A' },
      { id: 2, sectionName: 'Section B' },
      { id: 3, sectionName: 'Section C' },
    ]}
  />;
}

export function SubjectsPage() {
  return <GenericCrudPage
    title="Subjects" breadcrumbs={[{ label: 'Academics' }, { label: 'Subjects' }]}
    apiPath="/api/v1/academics/subjects"
    addLabel="Add Subject"
    searchPlaceholder="Search subjects..."
    columns={[
      { label: 'Subject Name', key: 'subjectName' },
      { label: 'Subject Code', key: 'subjectCode' },
      { label: 'Subject Type', render: r => <Badge type="info">{r.subjectType === 'T' ? 'Theory' : 'Practical'}</Badge> },
      { label: 'Status', render: () => <Badge type="success">Active</Badge> },
    ]}
    formFields={[
      { key: 'subjectName', label: 'Subject Name', required: true, placeholder: 'e.g. Mathematics' },
      { key: 'subjectCode', label: 'Subject Code', required: true, placeholder: 'e.g. MATH' },
      { key: 'subjectType', label: 'Subject Type', type: 'select', required: true, options: [
        { value: 'T', label: 'Theory' },
        { value: 'P', label: 'Practical' },
      ]},
    ]}
    mockData={[
      { id: 1, subjectName: 'Mathematics',   subjectCode: 'MATH', subjectType: 'T' },
      { id: 2, subjectName: 'Science',       subjectCode: 'SCI',  subjectType: 'T' },
      { id: 3, subjectName: 'English',       subjectCode: 'ENG',  subjectType: 'T' },
      { id: 4, subjectName: 'Social Science',subjectCode: 'SSC',  subjectType: 'T' },
      { id: 5, subjectName: 'Sanskrit',      subjectCode: 'SKT',  subjectType: 'T' },
      { id: 6, subjectName: 'Computer Sci',  subjectCode: 'CS',   subjectType: 'P' },
    ]}
  />;
}

export function AcademicYearPage() {
  return <GenericCrudPage
    title="Academic Year" breadcrumbs={[{ label: 'Academics' }, { label: 'Academic Year' }]}
    apiPath="/api/v1/academics/years"
    addLabel="Add Academic Year"
    searchPlaceholder="Search academic years..."
    columns={[
      { label: 'Year Title', key: 'year' },
      { label: 'Title', key: 'title' },
      { label: 'Status', render: () => <Badge type="success">Active</Badge> },
    ]}
    formFields={[
      { key: 'year', label: 'Year Title (e.g. 2026)', required: true, placeholder: '2026' },
      { key: 'title', label: 'Title', required: true, placeholder: 'Jan-Dec' },
    ]}
    mockData={[
      { id: 1, year: '2026', title: 'Jan-Dec' },
      { id: 2, year: '2027', title: 'Jan-Dec' },
    ]}
  />;
}

// ═══ STUDENT DIRECTORY ═══════════════════════════════════════════════════════

export function StudentListPage() {
  return <GenericCrudPage
    title="All Students" breadcrumbs={[{ label: 'Student Info' }, { label: 'All Students' }]}
    apiPath="/api/v1/students"
    addLabel="+ Admit Student"
    searchPlaceholder="Search by first/last name, admission number..."
    columns={[
      { label: 'Photo', render: r => (
        <div className="student-avatar">{(r.firstName?.[0] || 'S') + (r.lastName?.[0] || '')}</div>
      )},
      { label: 'Name', render: r => <div><strong>{r.firstName} {r.lastName}</strong><div style={{fontSize:11,color:'#aaa'}}>Roll: {r.rollNo || 'N/A'}</div></div> },
      { label: 'Admission No', key: 'admissionNo' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'mobile' },
      { label: 'Status', render: r => <Badge type={r.activeStatus === 1 ? 'success' : 'danger'}>{r.activeStatus === 1 ? 'Active' : 'Inactive'}</Badge> },
    ]}
    formFields={[
      { key: 'firstName', label: 'First Name', required: true, placeholder: 'First Name' },
      { key: 'lastName', label: 'Last Name', required: true, placeholder: 'Last Name' },
      { key: 'admissionNo', label: 'Admission Number', required: true, placeholder: 'e.g. ADM1001' },
      { key: 'rollNo', label: 'Roll Number', type: 'number', placeholder: 'e.g. 1' },
      { key: 'email', label: 'Email Address', type: 'email', placeholder: 'student@school.com' },
      { key: 'mobile', label: 'Mobile Phone', placeholder: '+91 9876543210' },
      { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
    ]}
    mockData={[
      { id: 1, firstName: 'Rahul', lastName: 'Kumar', admissionNo: 'ADM1001', rollNo: 1, email: 'rahul@email.com', mobile: '9876543210', activeStatus: 1 },
      { id: 2, firstName: 'Sneha', lastName: 'Rao',   admissionNo: 'ADM1002', rollNo: 4, email: 'sneha@email.com', mobile: '9823456789', activeStatus: 1 },
      { id: 3, firstName: 'Arjun', lastName: 'Singh', admissionNo: 'ADM1003', rollNo: 12, email: 'arjun@email.com', mobile: '9712345678', activeStatus: 1 },
    ]}
  />;
}

export function ParentListPage() {
  return <GenericCrudPage
    title="All Parents" breadcrumbs={[{ label: 'Student Info' }, { label: 'Parents' }]}
    apiPath="/api/v1/parents"
    addLabel="Add Parent"
    searchPlaceholder="Search parents..."
    columns={[
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'phone' },
      { label: 'Status', render: () => <Badge type="success">Active</Badge> },
    ]}
    formFields={[
      { key: 'name', label: 'Full Name', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Phone', required: true },
    ]}
    mockData={[
      { id: 1, name: 'Ramesh Kumar',  email: 'ramesh@email.com', phone: '9876543200' },
      { id: 2, name: 'Lakshmi Rao',   email: 'lakshmi@email.com', phone: '9823456780' },
    ]}
  />;
}

// ═══ HR & STAFF DIRECTORY ════════════════════════════════════════════════════

export function TeacherListPage() {
  return <GenericCrudPage
    title="All Teachers" breadcrumbs={[{ label: 'Teacher' }, { label: 'All Teachers' }]}
    apiPath="/api/v1/hr/staffs"
    addLabel="Add Teacher"
    searchPlaceholder="Search staff..."
    columns={[
      { label: 'Photo', render: r => <div className="student-avatar">{r.fullName?.slice(0,2).toUpperCase()}</div> },
      { label: 'Name', render: r => <div><strong>{r.fullName}</strong></div> },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'mobile' },
      { label: 'Basic Salary', key: 'basicSalary' },
      { label: 'Status', render: r => <Badge type={r.activeStatus === 1 ? 'success' : 'danger'}>{r.activeStatus === 1 ? 'Active' : 'Inactive'}</Badge> },
    ]}
    formFields={[
      { key: 'fullName', label: 'Full Name', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'mobile', label: 'Phone Number', required: true },
      { key: 'basicSalary', label: 'Basic Salary (₹)', type: 'number' },
      { key: 'contractType', label: 'Contract Type', type: 'select', options: [
        { value: 'Permanent', label: 'Permanent' },
        { value: 'Provision', label: 'Provision' },
      ]},
    ]}
    mockData={[
      { id: 1, fullName: 'Dr. Anita Sharma',  email: 'anita@school.com',  mobile: '9811223344', basicSalary: 45000, activeStatus: 1 },
      { id: 2, fullName: 'Mr. Suresh Nair',   email: 'suresh@school.com',  mobile: '9833445566', basicSalary: 38000, activeStatus: 1 },
      { id: 3, fullName: 'Ms. Kavitha Menon', email: 'kavitha@school.com', mobile: '9855667788', basicSalary: 35000, activeStatus: 1 },
    ]}
  />;
}
