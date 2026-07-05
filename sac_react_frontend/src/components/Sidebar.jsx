import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../contexts/AuthContext';

// ─── Full InfixEdu / SAC ERP Menu Structure ──────────────────────────────────
// Mirrors the original PHP `sm_menus` + `staff.blade.php` + `student.blade.php`
// section separators match `menu_separator` in original sidebar

const ADMIN_MENU = [
  // ── DASHBOARD ──
  {
    section: 'dashboard_section', label: 'Dashboard',
    items: [
      { label: 'Dashboard', icon: 'ti-home', path: '/dashboard' },
    ]
  },
  // ── ACADEMICS ──
  {
    section: 'academics_section', label: 'Academics',
    items: [
      {
        label: 'Academics', icon: 'ti-book', children: [
          { label: 'Classes', path: '/academics/classes' },
          { label: 'Sections', path: '/academics/sections' },
          { label: 'Subjects', path: '/academics/subjects' },
          { label: 'Class Routine', path: '/academics/class-routine' },
          { label: 'Assign Subjects', path: '/academics/assign-subjects' },
          { label: 'Class Rooms', path: '/academics/classrooms' },
          { label: 'Academic Year', path: '/academics/academic-year' },
          { label: 'Shifts', path: '/academics/shifts' },
        ]
      },
      {
        label: 'Lesson Plan', icon: 'ti-agenda', children: [
          { label: 'Lesson Plans', path: '/lesson/plans' },
          { label: 'Lesson Topics', path: '/lesson/topics' },
        ]
      },
      {
        label: 'Homework', icon: 'ti-pencil-alt', children: [
          { label: 'All Homework', path: '/homework/list' },
          { label: 'Add Homework', path: '/homework/create' },
          { label: 'Submit Assignment', path: '/homework/submit' },
        ]
      },
      { label: 'LMS Workspace', icon: 'ti-cup', path: '/modules/lms' },
    ]
  },
  // ── STUDENT INFORMATION ──
  {
    section: 'student_section', label: 'Student Information',
    items: [
      {
        label: 'Student Info', icon: 'ti-user', children: [
          { label: 'All Students', path: '/students' },
          { label: 'Admit Student', path: '/students/create' },
          { label: 'Student Categories', path: '/students/categories' },
          { label: 'Student Groups', path: '/students/groups' },
          { label: 'Bulk Student Upload', path: '/students/bulk-upload' },
          { label: 'Student Documents', path: '/students/documents' },
          { label: 'Student ID Cards', path: '/students/id-cards' },
          { label: 'Transfer Certificates', path: '/students/transfer-certificates' },
          { label: 'Promotion', path: '/students/promotion' },
          { label: 'Student Timeline', path: '/students/timeline' },
        ]
      },
      {
        label: 'Parent', icon: 'ti-id-badge', children: [
          { label: 'All Parents', path: '/parents' },
          { label: 'Add Parent', path: '/parents/create' },
        ]
      },
    ]
  },
  // ── TEACHER ──
  {
    section: 'teacher_section', label: 'Teacher',
    items: [
      {
        label: 'Teacher', icon: 'ti-blackboard', children: [
          { label: 'All Teachers', path: '/teachers' },
          { label: 'Add Teacher', path: '/teachers/create' },
          { label: 'Teacher Attendance', path: '/teachers/attendance' },
          { label: 'Teacher Evaluation', path: '/teachers/evaluation' },
          { label: 'Assign Class Teacher', path: '/academics/assign-class-teacher' },
        ]
      },
    ]
  },
  // ── EXAMINATION ──
  {
    section: 'exam_section', label: 'Examination',
    items: [
      {
        label: 'Exam', icon: 'ti-clipboard', children: [
          { label: 'Exam Types', path: '/examination/types' },
          { label: 'Exam Setup', path: '/examination/setup' },
          { label: 'Exam Schedules', path: '/examination/schedules' },
          { label: 'Marks Entry', path: '/examination/marks' },
          { label: 'Results', path: '/examination/results' },
          { label: 'Merit List', path: '/examination/merit-list' },
          { label: 'Seat Plans', path: '/examination/seat-plans' },
          { label: 'Admit Cards', path: '/examination/admit-cards' },
          { label: 'Marks Grades', path: '/examination/grades' },
        ]
      },
      {
        label: 'Online Exam', icon: 'ti-write', children: [
          { label: 'Question Banks', path: '/online-exam/questions' },
          { label: 'Question Groups', path: '/online-exam/question-groups' },
          { label: 'Online Exams', path: '/online-exam/list' },
          { label: 'Exam Results', path: '/online-exam/results' },
        ]
      },
    ]
  },
  // ── FEES COLLECTION ──
  {
    section: 'fees_section', label: 'Fees Collection',
    items: [
      {
        label: 'Fees', icon: 'ti-money', children: [
          { label: 'Fee Types', path: '/fees/types' },
          { label: 'Fee Assign', path: '/fees/assign' },
          { label: 'Fee Invoice', path: '/fees/invoice' },
          { label: 'Fee Payments', path: '/fees/payments' },
          { label: 'Fee Discounts', path: '/fees/discounts' },
          { label: 'Fee Carry Forward', path: '/fees/carry-forward' },
          { label: 'Installments', path: '/fees/installments' },
          { label: 'Invoice Settings', path: '/fees/invoice-settings' },
        ]
      },
    ]
  },
  // ── ATTENDANCE ──
  {
    section: 'attendance_section', label: 'Attendance',
    items: [
      {
        label: 'Attendance', icon: 'ti-check-box', children: [
          { label: 'Student Attendance', path: '/attendance/students' },
          { label: 'Staff Attendance', path: '/attendance/staff' },
          { label: 'Attendance Reports', path: '/attendance/reports' },
          { label: 'Absent Notifications', path: '/attendance/notifications' },
        ]
      },
    ]
  },
  // ── LIBRARY ──
  {
    section: 'library_section', label: 'Library',
    items: [
      {
        label: 'Library', icon: 'ti-archive', children: [
          { label: 'All Books', path: '/library/books' },
          { label: 'Book Categories', path: '/library/categories' },
          { label: 'Issue Book', path: '/library/issue' },
          { label: 'Return Book', path: '/library/return' },
          { label: 'Library Members', path: '/library/members' },
          { label: 'Book Bank', path: '/library/book-bank' },
        ]
      },
    ]
  },
  // ── TRANSPORT ──
  {
    section: 'transport_section', label: 'Transport',
    items: [
      {
        label: 'Transport', icon: 'ti-car', children: [
          { label: 'Routes', path: '/transport/routes' },
          { label: 'Vehicles', path: '/transport/vehicles' },
          { label: 'Assign Vehicles', path: '/transport/assign' },
        ]
      },
    ]
  },
  // ── DORMITORY ──
  {
    section: 'dormitory_section', label: 'Dormitory',
    items: [
      {
        label: 'Dormitory', icon: 'ti-layout-sidebar-left', children: [
          { label: 'Hostels', path: '/dormitory/hostels' },
          { label: 'Room Types', path: '/dormitory/room-types' },
          { label: 'Rooms', path: '/dormitory/rooms' },
          { label: 'Room Allocation', path: '/dormitory/allocation' },
          { label: 'Hostel Meals', path: '/dormitory/meals' },
          { label: 'Hostel Fees', path: '/dormitory/fees' },
          { label: 'Visitors', path: '/dormitory/visitors' },
        ]
      },
    ]
  },
  // ── HUMAN RESOURCE ──
  {
    section: 'hr_section', label: 'Human Resource',
    items: [
      {
        label: 'Human Resource', icon: 'ti-briefcase', children: [
          { label: 'All Staff', path: '/hr/staff' },
          { label: 'Departments', path: '/hr/departments' },
          { label: 'Designations', path: '/hr/designations' },
          { label: 'Leave Types', path: '/hr/leave-types' },
          { label: 'Leave Requests', path: '/hr/leave-requests' },
          { label: 'Payroll', path: '/hr/payroll' },
          { label: 'Salary Templates', path: '/hr/salary-templates' },
        ]
      },
    ]
  },
  // ── ACCOUNTS ──
  {
    section: 'accounts_section', label: 'Accounts',
    items: [
      {
        label: 'Accounts', icon: 'ti-bar-chart', children: [
          { label: 'Chart of Accounts', path: '/accounts/chart' },
          { label: 'Income', path: '/accounts/income' },
          { label: 'Expenses', path: '/accounts/expenses' },
          { label: 'Bank Accounts', path: '/accounts/banks' },
          { label: 'Bank Statements', path: '/accounts/bank-statements' },
          { label: 'Amount Transfer', path: '/accounts/transfer' },
        ]
      },
    ]
  },
  // ── INVENTORY ──
  {
    section: 'inventory_section', label: 'Inventory',
    items: [
      {
        label: 'Inventory', icon: 'ti-package', children: [
          { label: 'Items', path: '/inventory/items' },
          { label: 'Item Categories', path: '/inventory/categories' },
          { label: 'Item Stores', path: '/inventory/stores' },
          { label: 'Receive Items', path: '/inventory/receive' },
          { label: 'Issue Items', path: '/inventory/issue' },
          { label: 'Sell Items', path: '/inventory/sell' },
          { label: 'Suppliers', path: '/inventory/suppliers' },
        ]
      },
    ]
  },
  // ── COMMUNICATE ──
  {
    section: 'communicate_section', label: 'Communicate',
    items: [
      {
        label: 'Communicate', icon: 'ti-comment-alt', children: [
          { label: 'Notice Board', path: '/communicate/notice-board' },
          { label: 'Send Email', path: '/communicate/email' },
          { label: 'Send SMS', path: '/communicate/sms' },
          { label: 'Events', path: '/communicate/events' },
          { label: 'Phone Call Logs', path: '/communicate/phone-logs' },
          { label: 'Postal Receive', path: '/communicate/postal-receive' },
          { label: 'Postal Dispatch', path: '/communicate/postal-dispatch' },
        ]
      },
    ]
  },
  // ── REPORTS ──
  {
    section: 'report_section', label: 'Reports',
    items: [
      {
        label: 'Reports', icon: 'ti-pie-chart', children: [
          { label: 'Student Report', path: '/reports/students' },
          { label: 'Attendance Report', path: '/reports/attendance' },
          { label: 'Fees Report', path: '/reports/fees' },
          { label: 'Exam Report', path: '/reports/examination' },
          { label: 'HR Report', path: '/reports/hr' },
          { label: 'Account Report', path: '/reports/accounts' },
          { label: 'User Log Report', path: '/reports/user-logs' },
        ]
      },
    ]
  },
  // ── MODULES ──
  {
    section: 'module_section', label: 'Modules',
    items: [
      { label: 'Video Watch', icon: 'ti-video-camera', path: '/modules/video-watch' },
      { label: 'Wallet', icon: 'ti-wallet', path: '/modules/wallet' },
      { label: 'Download Center', icon: 'ti-download', path: '/modules/downloads' },
      { label: 'Chat', icon: 'ti-comments', path: '/modules/chat' },
      { label: 'Alumni', icon: 'ti-crown', path: '/modules/alumni' },
      { label: 'Clubs & Activities', icon: 'ti-flag', path: '/modules/clubs' },
      { label: 'User Forum', icon: 'ti-comment', path: '/modules/forum' },
      { label: 'Visitors', icon: 'ti-eye', path: '/communicate/visitors' },
      { label: 'Canteen', icon: 'ti-cup', path: '/modules/canteen' },
    ]
  },
  // ── SYSTEM SETTINGS ──
  {
    section: 'settings_section', label: 'System Settings',
    items: [
      {
        label: 'System Settings', icon: 'ti-settings', children: [
          { label: 'General Settings', path: '/settings/general' },
          { label: 'School Settings', path: '/settings/school' },
          { label: 'Email Settings', path: '/settings/email' },
          { label: 'SMS Settings', path: '/settings/sms' },
          { label: 'Payment Gateway', path: '/settings/payment' },
          { label: 'Social Media', path: '/settings/social' },
          { label: 'Maintenance', path: '/settings/maintenance' },
          { label: 'Backup', path: '/settings/backup' },
        ]
      },
      {
        label: 'Role & Permissions', icon: 'ti-shield', children: [
          { label: 'Roles', path: '/roles' },
          { label: 'Permissions', path: '/roles/permissions' },
          { label: 'Custom Menus', path: '/roles/custom-menus' },
        ]
      },
      {
        label: 'Front Settings', icon: 'ti-desktop', children: [
          { label: 'Home Page', path: '/front/home' },
          { label: 'About Page', path: '/front/about' },
          { label: 'Contact Page', path: '/front/contact' },
          { label: 'Events Page', path: '/front/events' },
          { label: 'Notices Page', path: '/front/notices' },
          { label: 'Photo Gallery', path: '/front/gallery' },
          { label: 'Sliders', path: '/front/sliders' },
          { label: 'Testimonials', path: '/front/testimonials' },
        ]
      },
    ]
  },
];

const SUPER_ADMIN_MENU = [
  {
    section: 'superadmin_section', label: 'Super Admin',
    items: [
      { label: 'Super Admin Dashboard', icon: 'ti-home', path: '/superadmin/dashboard' },
      {
        label: 'Schools / Tenants', icon: 'ti-layers', children: [
          { label: 'All Schools', path: '/superadmin/schools' },
          { label: 'Add School', path: '/superadmin/schools/create' },
          { label: 'School Packages', path: '/superadmin/packages' },
        ]
      },
      { label: 'Module Manager', icon: 'ti-plug', path: '/superadmin/modules' },
      { label: 'Add-Ons', icon: 'ti-puzzle', path: '/superadmin/addons' },
      { label: 'Subscriptions', icon: 'ti-credit-card', path: '/superadmin/subscriptions' },
      { label: 'Announcements', icon: 'ti-bell', path: '/superadmin/announcements' },
      { label: 'Audit Logs', icon: 'ti-list', path: '/superadmin/audit-logs' },
      { label: 'Super Admin Settings', icon: 'ti-settings', path: '/superadmin/settings' },
    ]
  },
];

const ULTRA_SUPER_ADMIN_MENU = [
  {
    section: 'ultra_section', label: 'Ultra Super Admin',
    items: [
      { label: 'Ultra Dashboard', icon: 'ti-crown', path: '/ultra/dashboard' },
      { label: 'All Super Admins', icon: 'ti-user', path: '/ultra/super-admins' },
      { label: 'Global Settings', icon: 'ti-world', path: '/ultra/global-settings' },
      { label: 'License Manager', icon: 'ti-key', path: '/ultra/licenses' },
      { label: 'System Health', icon: 'ti-pulse', path: '/ultra/health' },
    ]
  },
];

const TEACHER_MENU = [
  {
    section: 'teacher_panel', label: 'Teacher Panel',
    items: [
      { label: 'Dashboard', icon: 'ti-home', path: '/teacher/dashboard' },
      { label: 'My Classes', icon: 'ti-blackboard', path: '/teacher/classes' },
      {
        label: 'Attendance', icon: 'ti-check-box', children: [
          { label: 'Mark Attendance', path: '/teacher/attendance/mark' },
          { label: 'Attendance List', path: '/teacher/attendance/list' },
        ]
      },
      {
        label: 'Homework', icon: 'ti-pencil-alt', children: [
          { label: 'Assign Homework', path: '/teacher/homework/create' },
          { label: 'Homework List', path: '/teacher/homework' },
        ]
      },
      { label: 'LMS Workspace', icon: 'ti-cup', path: '/modules/lms' },
      {
        label: 'Lesson Plan', icon: 'ti-agenda', children: [
          { label: 'My Lesson Plans', path: '/teacher/lesson' },
          { label: 'Add Lesson Plan', path: '/teacher/lesson/create' },
        ]
      },
      { label: 'Marks Entry', icon: 'ti-write', path: '/teacher/marks' },
      { label: 'My Students', icon: 'ti-user', path: '/teacher/students' },
      { label: 'My Profile', icon: 'ti-id-badge', path: '/teacher/profile' },
      { label: 'Notice Board', icon: 'ti-comment-alt', path: '/teacher/notice-board' },
    ]
  },
];

const STUDENT_MENU = [
  {
    section: 'student_panel', label: 'Student Panel',
    items: [
      { label: 'Dashboard', icon: 'ti-home', path: '/student/dashboard' },
      { label: 'My Attendance', icon: 'ti-check-box', path: '/student/attendance' },
      { label: 'My Results', icon: 'ti-bar-chart', path: '/student/results' },
      { label: 'My Fees', icon: 'ti-money', path: '/student/fees' },
      { label: 'Submit Assignment', icon: 'ti-pencil-alt', path: '/homework/submit' },
      { label: 'LMS Workspace', icon: 'ti-cup', path: '/modules/lms' },
      { label: 'Online Exam', icon: 'ti-write', path: '/student/online-exam' },
      { label: 'Notice Board', icon: 'ti-comment-alt', path: '/student/notice-board' },
      { label: 'Video Watch', icon: 'ti-video-camera', path: '/student/videos' },
      { label: 'Downloads', icon: 'ti-download', path: '/student/downloads' },
      { label: 'My Wallet', icon: 'ti-wallet', path: '/student/wallet' },
      { label: 'My Profile', icon: 'ti-id-badge', path: '/student/profile' },
    ]
  },
];

const PARENT_MENU = [
  {
    section: 'parent_panel', label: 'Parent Panel',
    items: [
      { label: 'Dashboard', icon: 'ti-home', path: '/parent/dashboard' },
      { label: "Child's Attendance", icon: 'ti-check-box', path: '/parent/attendance' },
      { label: "Child's Results", icon: 'ti-bar-chart', path: '/parent/results' },
      { label: "Child's Fees", icon: 'ti-money', path: '/parent/fees' },
      { label: 'LMS Workspace', icon: 'ti-cup', path: '/modules/lms' },
      { label: 'Notice Board', icon: 'ti-comment-alt', path: '/parent/notice-board' },
      { label: 'My Profile', icon: 'ti-id-badge', path: '/parent/profile' },
    ]
  },
];

function getMenuForRole(role) {
  switch (role) {
    case ROLES.ULTRA_SUPER_ADMIN: return [...ULTRA_SUPER_ADMIN_MENU, ...SUPER_ADMIN_MENU, ...ADMIN_MENU];
    case ROLES.SUPER_ADMIN:       return [...SUPER_ADMIN_MENU, ...ADMIN_MENU];
    case ROLES.ADMIN:             return ADMIN_MENU;
    case ROLES.TEACHER:           return TEACHER_MENU;
    case ROLES.STUDENT:           return STUDENT_MENU;
    case ROLES.PARENT:            return PARENT_MENU;
    default:                      return ADMIN_MENU;
  }
}

// ─── Single Menu Item (leaf node) ────────────────────────────────────────────
function MenuItem({ item }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <li className={isActive ? 'mm-active' : ''}>
      <a onClick={() => navigate(item.path)} style={{ cursor: 'pointer' }}>
        <div className="nav_icon_small"><span className={item.icon || 'ti-minus'} /></div>
        <div className="nav_title"><span>{item.label}</span></div>
      </a>
    </li>
  );
}

// ─── Collapsible Sub-Menu Group ───────────────────────────────────────────────
function MenuGroup({ item }) {
  const location = useLocation();
  const isChildActive = item.children?.some(c => location.pathname.startsWith(c.path));
  const [open, setOpen] = useState(isChildActive);
  const navigate = useNavigate();

  return (
    <li className={`has-submenu ${open ? 'open' : ''} ${isChildActive ? 'mm-active' : ''}`}>
      <div className="menu-link" onClick={() => setOpen(o => !o)}>
        <div className="nav_icon_small"><span className={item.icon || 'ti-menu'} /></div>
        <div className="nav_title"><span>{item.label}</span></div>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#aaa', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
      </div>
      <ul className={`submenu ${open ? 'open' : ''}`}>
        {item.children.map(child => (
          <li key={child.path} className={location.pathname === child.path ? 'mm-active' : ''}>
            <a onClick={() => navigate(child.path)} style={{ cursor: 'pointer' }}>
              <span className="ti-minus" style={{ marginRight: 8, fontSize: 10 }} />
              {child.label}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

// ─── Main Sidebar Component ───────────────────────────────────────────────────
export default function Sidebar({ isOpen }) {
  const { user } = useAuth();
  const menu = getMenuForRole(user?.role);

  return (
    <nav id="sidebar" className={isOpen ? 'open' : ''}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'linear-gradient(90deg,#7C32FF,#C738D8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0
        }}>SAC</div>
        <div>
          <div className="brand-name">SAC ERP</div>
          <div className="brand-sub">developed by TIS</div>
        </div>
      </div>

      {/* Menu */}
      <ul className="sidebar_menu">
        {menu.map((section) => (
          <React.Fragment key={section.section}>
            <li>
              <span className="menu_separator">{section.label}</span>
            </li>
            {section.items.map((item) =>
              item.children
                ? <MenuGroup key={item.label} item={item} />
                : <MenuItem key={item.path} item={item} />
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
}
