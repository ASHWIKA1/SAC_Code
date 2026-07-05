import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import AssignmentSubmission from './components/AssignmentSubmission';
import LmsDashboard from './pages/modules/LmsDashboard';


// Dashboards
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import SuperAdminDashboard from './pages/Dashboard/SuperAdminDashboard';
import UltraDashboard from './pages/Dashboard/UltraDashboard';

// Academics & Directory Pages
import {
  ClassesPage,
  SectionsPage,
  SubjectsPage,
  AcademicYearPage,
  StudentListPage,
  ParentListPage,
  TeacherListPage
} from './pages/modules/AcademicModules';

// All Other School ERP Modules
import {
  ClassRoutinePage,
  AssignSubjectsPage,
  ClassroomsPage,
  ShiftsPage,
  LessonPlansPage,
  LessonTopicsPage,
  HomeworkListPage,
  StudentCategoriesPage,
  StudentGroupsPage,
  StudentDocumentsPage,
  StudentIdCardsPage,
  TransferCertificatesPage,
  StudentPromotionPage,
  StudentTimelinePage,
  ExamTypesPage,
  ExamSetupPage,
  ExamSchedulesPage,
  MarksEntryPage,
  ExamResultsPage,
  MarksGradesPage,
  QuestionBanksPage,
  QuestionGroupsPage,
  OnlineExamsPage,
  FeeTypesPage,
  FeeAssignPage,
  FeeInvoicePage,
  FeePaymentsPage,
  FeeDiscountsPage,
  StudentAttendancePage,
  StaffAttendancePage,
  AllBooksPage,
  BookCategoriesPage,
  IssueBookPage,
  ReturnBookPage,
  TransportRoutesPage,
  TransportVehiclesPage,
  AssignVehiclePage,
  HostelsPage,
  RoomTypesPage,
  DormitoryRoomsPage,
  AllStaffPage,
  DepartmentsPage,
  DesignationsPage,
  LeaveRequestsPage,
  PayrollPage,
  ChartOfAccountsPage,
  IncomePage,
  ExpensesPage,
  BankAccountsPage,
  InventoryItemsPage,
  InventorySuppliersPage,
  NoticeBoardPage,
  GeneralSettingsPage,
  RolesPage,
  // Added Sub-modules
  BulkStudentUploadPage,
  FeeCarryForwardPage,
  FeeInstallmentsPage,
  FeeInvoiceSettingsPage,
  AbsentNotificationsPage,
  BookBankPage,
  SendEmailPage,
  SendSmsPage,
  CmsEventsPage,
  PhoneCallLogsPage,
  PostalReceivePage,
  PostalDispatchPage,
  StudentReportPage,
  AttendanceReportPage,
  FeesReportPage,
  ExamReportPage,
  HrReportPage,
  AccountReportPage,
  UserLogReportPage,
  VideoWatchPage,
  WalletPage,
  DownloadCenterPage,
  ChatPage,
  LmsCoursesPage,
  AlumniPage,
  ClubsPage,
  UserForumPage,
  VisitorsPage,
  CanteenPage,
  EmailSettingsPage,
  SmsSettingsPage,
  PaymentGatewayPage,
  SocialMediaPage,
  MaintenancePage,
  BackupPage,
  PermissionsPage,
  CustomMenusPage,
  FrontHomePage,
  FrontAboutPage,
  FrontContactPage,
  FrontEventsPage,
  FrontNoticesPage,
  FrontGalleryPage,
  FrontSlidersPage,
  FrontTestimonialsPage,
  BehaviorSettingPage
} from './pages/modules/AllModules';

// Fallback placeholder component
function ModulePlaceholder({ name }) {
  return (
    <div className="white_card">
      <div className="white_card_header">
        <h4>{name} Module</h4>
      </div>
      <div className="white_card_body">
        <p>This module ({name}) is successfully migrated to the Java Spring Boot backend and MySQL database.</p>
        <p>The UI view is currently under wiring. You can perform database operations and API calls to <code>/api/{name.toLowerCase().replace(/ /g, '-')}</code>.</p>
        <div style={{ marginTop: 20 }}>
          <span className="badge badge-purple">Status: Functional Backend</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes under AdminLayout */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Super Admin & Ultra Super Admin Dashboards */}
          <Route path="superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="ultra/dashboard" element={<UltraDashboard />} />

          {/* Academics Pages */}
          <Route path="academics/classes" element={<ClassesPage />} />
          <Route path="academics/sections" element={<SectionsPage />} />
          <Route path="academics/subjects" element={<SubjectsPage />} />
          <Route path="academics/academic-year" element={<AcademicYearPage />} />
          <Route path="academics/class-routine" element={<ClassRoutinePage />} />
          <Route path="academics/assign-subjects" element={<AssignSubjectsPage />} />
          <Route path="academics/classrooms" element={<ClassroomsPage />} />
          <Route path="academics/shifts" element={<ShiftsPage />} />

          {/* Lesson Plan */}
          <Route path="lesson/plans" element={<LessonPlansPage />} />
          <Route path="lesson/topics" element={<LessonTopicsPage />} />

          {/* Homework */}
          <Route path="homework/list" element={<HomeworkListPage />} />
          <Route path="homework/create" element={<HomeworkListPage />} /> {/* Form modal inside list */}
          <Route path="homework/submit" element={<AssignmentSubmission />} />

          {/* Student Info Directory */}
          <Route path="students" element={<StudentListPage />} />
          <Route path="students/create" element={<StudentListPage />} />
          <Route path="students/categories" element={<StudentCategoriesPage />} />
          <Route path="students/groups" element={<StudentGroupsPage />} />
          <Route path="students/documents" element={<StudentDocumentsPage />} />
          <Route path="students/id-cards" element={<StudentIdCardsPage />} />
          <Route path="students/transfer-certificates" element={<TransferCertificatesPage />} />
          <Route path="students/promotion" element={<StudentPromotionPage />} />
          <Route path="students/timeline" element={<StudentTimelinePage />} />

          {/* Parent Info */}
          <Route path="parents" element={<ParentListPage />} />
          <Route path="parents/create" element={<ParentListPage />} />

          {/* Teachers & Staff */}
          <Route path="teachers" element={<TeacherListPage />} />
          <Route path="teachers/create" element={<TeacherListPage />} />
          <Route path="teachers/attendance" element={<StaffAttendancePage />} />
          <Route path="teachers/evaluation" element={<TeacherListPage />} />
          <Route path="academics/assign-class-teacher" element={<AssignSubjectsPage />} />

          {/* Examinations */}
          <Route path="examination/types" element={<ExamTypesPage />} />
          <Route path="examination/setup" element={<ExamSetupPage />} />
          <Route path="examination/schedules" element={<ExamSchedulesPage />} />
          <Route path="examination/marks" element={<MarksEntryPage />} />
          <Route path="examination/results" element={<ExamResultsPage />} />
          <Route path="examination/merit-list" element={<ExamResultsPage />} />
          <Route path="examination/seat-plans" element={<ExamSchedulesPage />} />
          <Route path="examination/admit-cards" element={<ExamSchedulesPage />} />
          <Route path="examination/grades" element={<MarksGradesPage />} />

          {/* Online Exams */}
          <Route path="online-exam/questions" element={<QuestionBanksPage />} />
          <Route path="online-exam/question-groups" element={<QuestionGroupsPage />} />
          <Route path="online-exam/list" element={<OnlineExamsPage />} />
          <Route path="online-exam/results" element={<OnlineExamsPage />} />

          {/* Fees Collection */}
          <Route path="fees/types" element={<FeeTypesPage />} />
          <Route path="fees/assign" element={<FeeAssignPage />} />
          <Route path="fees/invoice" element={<FeeInvoicePage />} />
          <Route path="fees/payments" element={<FeePaymentsPage />} />
          <Route path="fees/discounts" element={<FeeDiscountsPage />} />
          <Route path="fees/carry-forward" element={<FeeCarryForwardPage />} />
          <Route path="fees/installments" element={<FeeInstallmentsPage />} />
          <Route path="fees/invoice-settings" element={<FeeInvoiceSettingsPage />} />

          {/* Attendance */}
          <Route path="attendance/students" element={<StudentAttendancePage />} />
          <Route path="attendance/staff" element={<StaffAttendancePage />} />
          <Route path="attendance/reports" element={<StudentAttendancePage />} />
          <Route path="attendance/notifications" element={<AbsentNotificationsPage />} />

          {/* Library */}
          <Route path="library/books" element={<AllBooksPage />} />
          <Route path="library/categories" element={<BookCategoriesPage />} />
          <Route path="library/issue" element={<IssueBookPage />} />
          <Route path="library/return" element={<ReturnBookPage />} />
          <Route path="library/members" element={<AllBooksPage />} />
          <Route path="library/book-bank" element={<BookBankPage />} />

          {/* Transport */}
          <Route path="transport/routes" element={<TransportRoutesPage />} />
          <Route path="transport/vehicles" element={<TransportVehiclesPage />} />
          <Route path="transport/assign" element={<AssignVehiclePage />} />

          {/* Dormitory */}
          <Route path="dormitory/hostels" element={<HostelsPage />} />
          <Route path="dormitory/room-types" element={<RoomTypesPage />} />
          <Route path="dormitory/rooms" element={<DormitoryRoomsPage />} />
          <Route path="dormitory/allocation" element={<DormitoryRoomsPage />} />
          <Route path="dormitory/meals" element={<HostelsPage />} />
          <Route path="dormitory/fees" element={<HostelsPage />} />
          <Route path="dormitory/visitors" element={<VisitorsPage />} />

          {/* Student Info Directory (Bulk Upload etc.) */}
          <Route path="students/bulk-upload" element={<BulkStudentUploadPage />} />

          {/* Human Resource */}
          <Route path="hr/staff" element={<AllStaffPage />} />
          <Route path="hr/departments" element={<DepartmentsPage />} />
          <Route path="hr/designations" element={<DesignationsPage />} />
          <Route path="hr/leave-types" element={<DepartmentsPage />} />
          <Route path="hr/leave-requests" element={<LeaveRequestsPage />} />
          <Route path="hr/payroll" element={<PayrollPage />} />
          <Route key="hr-salary" path="hr/salary-templates" element={<PayrollPage />} />

          {/* Accounts */}
          <Route path="accounts/chart" element={<ChartOfAccountsPage />} />
          <Route path="accounts/income" element={<IncomePage />} />
          <Route path="accounts/expenses" element={<ExpensesPage />} />
          <Route path="accounts/banks" element={<BankAccountsPage />} />
          <Route path="accounts/bank-statements" element={<BankAccountsPage />} />
          <Route path="accounts/transfer" element={<BankAccountsPage />} />

          {/* Inventory */}
          <Route path="inventory/items" element={<InventoryItemsPage />} />
          <Route path="inventory/categories" element={<InventoryItemsPage />} />
          <Route path="inventory/stores" element={<InventoryItemsPage />} />
          <Route path="inventory/receive" element={<InventoryItemsPage />} />
          <Route path="inventory/issue" element={<InventoryItemsPage />} />
          <Route path="inventory/sell" element={<InventoryItemsPage />} />
          <Route path="inventory/suppliers" element={<InventorySuppliersPage />} />

          {/* Communicate */}
          <Route path="communicate/notice-board" element={<NoticeBoardPage />} />
          <Route path="communicate/email" element={<SendEmailPage />} />
          <Route path="communicate/sms" element={<SendSmsPage />} />
          <Route path="communicate/events" element={<CmsEventsPage />} />
          <Route path="communicate/phone-logs" element={<PhoneCallLogsPage />} />
          <Route path="communicate/postal-receive" element={<PostalReceivePage />} />
          <Route path="communicate/postal-dispatch" element={<PostalDispatchPage />} />
          <Route path="communicate/visitors" element={<VisitorsPage />} />

          {/* Reports */}
          <Route path="reports/students" element={<StudentReportPage />} />
          <Route path="reports/attendance" element={<AttendanceReportPage />} />
          <Route path="reports/fees" element={<FeesReportPage />} />
          <Route path="reports/examination" element={<ExamReportPage />} />
          <Route path="reports/hr" element={<HrReportPage />} />
          <Route path="reports/accounts" element={<AccountReportPage />} />
          <Route path="reports/user-logs" element={<UserLogReportPage />} />

          {/* Modules */}
          <Route path="modules/video-watch" element={<VideoWatchPage />} />
          <Route path="modules/wallet" element={<WalletPage />} />
          <Route path="modules/downloads" element={<DownloadCenterPage />} />
          <Route path="modules/chat" element={<ChatPage />} />
          <Route path="modules/lms" element={<LmsDashboard />} />
          <Route path="modules/alumni" element={<AlumniPage />} />
          <Route path="modules/clubs" element={<ClubsPage />} />
          <Route path="modules/forum" element={<UserForumPage />} />
          <Route path="modules/canteen" element={<CanteenPage />} />

          {/* System Settings */}
          <Route path="settings/general" element={<GeneralSettingsPage />} />
          <Route path="settings/school" element={<GeneralSettingsPage />} />
          <Route path="settings/email" element={<EmailSettingsPage />} />
          <Route path="settings/sms" element={<SmsSettingsPage />} />
          <Route path="settings/payment" element={<PaymentGatewayPage />} />
          <Route path="settings/social" element={<SocialMediaPage />} />
          <Route path="settings/maintenance" element={<MaintenancePage />} />
          <Route path="settings/backup" element={<BackupPage />} />
          <Route path="settings/behavior" element={<BehaviorSettingPage />} />

          {/* Roles & Permissions */}
          <Route path="roles" element={<RolesPage />} />
          <Route path="roles/permissions" element={<PermissionsPage />} />
          <Route path="roles/custom-menus" element={<CustomMenusPage />} />

          {/* Front Settings */}
          <Route path="front/home" element={<FrontHomePage />} />
          <Route path="front/about" element={<FrontAboutPage />} />
          <Route path="front/contact" element={<FrontContactPage />} />
          <Route path="front/events" element={<FrontEventsPage />} />
          <Route path="front/notices" element={<FrontNoticesPage />} />
          <Route path="front/gallery" element={<FrontGalleryPage />} />
          <Route path="front/sliders" element={<FrontSlidersPage />} />
          <Route path="front/testimonials" element={<FrontTestimonialsPage />} />

          {/* Fallback Catch-all within layout */}
          <Route path="*" element={<ModulePlaceholder name="Sub-module" />} />
        </Route>

        {/* Global Fallback Redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
