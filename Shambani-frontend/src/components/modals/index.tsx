/**
 * ECONNECT Modal System - Centralized Export
 *
 * All modals use consistent BaseModal styling with:
 * - Glass morphism effects
 * - ECONNECT blue/purple gradients
 * - framer-motion animations
 * - Responsive design
 * - Accessibility support
 *
 * Quick Start:
 * import { ViewProfileModal, SendMessageModal } from './components/modals';
 *
 * Documentation: See README.md for complete guide
 * Quick Reference: See QUICK-REFERENCE.md for examples
 */

// ============================================
// 🎨 BASE MODAL COMPONENTS
// ============================================
export {
  BaseModal,
  ModalFooter,
  ModalCancelButton,
  ModalSubmitButton,
  ModalGlassCard,
} from "./BaseModal";

export type { BaseModalProps } from "./BaseModal";

// ============================================
// 👨‍🎓 STUDENT MODALS
// ============================================

// Profile Management
export { ViewProfileModal } from "./ViewProfileModal";
// Additional modals: EditProfileModal, ChangePasswordModal (create as needed)

// Student Academic
export { UpdateClassModal } from "./UpdateClassModal";
export { UpdateTalentsModal } from "./UpdateTalentsModal";
// Additional modals: ViewGradesModal, ViewReportCardModal (create as needed)

// Student Submissions
export { AssignmentSubmissionModal } from "./AssignmentSubmissionModal";
// Additional modals: ViewSubmissionHistoryModal (create as needed)

// ============================================
// 📚 ACADEMIC MODALS
// ============================================

// Assignments
export { CreateAssignmentModal } from "./CreateAssignmentModal";
export { GradeAssignmentModal } from "./GradeAssignmentModal";
// Additional modals: EditAssignmentModal, DeleteAssignmentModal (create as needed)

// Exams & Grades
// To create: CreateExamModal, GradeExamModal, ViewGradeSheetModal

// Attendance
// To create: MarkAttendanceModal, ViewAttendanceReportModal

// ============================================
// 💬 COMMUNICATION MODALS
// ============================================

// Messaging
export { SendMessageModal } from "./SendMessageModal";
export { ViewMessageModal } from "./ViewMessageModal";
// Additional modals: ReplyMessageModal, ForwardMessageModal (create as needed)

// Announcements
export { ComposeAnnouncementModal } from "./ComposeAnnouncementModal";
// Additional modals: ViewAnnouncementModal, EditAnnouncementModal (create as needed)

// Notifications
// To create: ViewNotificationModal, ManageNotificationSettingsModal

// ============================================
// 👥 MANAGEMENT MODALS
// ============================================

// User Management
// To create: AddUserModal, EditUserModal, ApproveUserModal, DeactivateUserModal

// Student Transfer
// To create: TransferStudentModal, ViewTransferRequestModal, ApproveTransferModal

// School Management
// To create: AddSchoolModal, EditSchoolModal, ViewSchoolDetailsModal

// ============================================
// 💰 PAYMENT & FINANCIAL MODALS
// ============================================

// Payments
// To create: RecordPaymentModal, ViewPaymentDetailsModal, PaymentHistoryModal

// Certificates & CTM
// To create: GenerateCertificateModal, ViewCertificateModal, IssueCertificateModal

// Revenue Tracking
// To create: ViewRevenueAnalyticsModal, DownloadFinancialReportModal

// ============================================
// 🎭 EVENT & TALENT MODALS
// ============================================

// Events
// To create: CreateEventModal, ViewEventModal, EditEventModal, RegisterEventModal

// Talent Management
// To create: AddTalentCategoryModal, ViewTalentPortfolioModal, UpdateTalentStatusModal

// CTM Program
// To create: EnrollCTMModal, ViewCTMDetailsModal, ManageCTMActivitiesModal

// ============================================
// 📊 REPORTS & ANALYTICS MODALS
// ============================================

// Academic Reports
// To create: ViewReportCardModal, DownloadTranscriptModal, GenerateProgressReportModal

// Analytics
// To create: ViewAnalyticsDashboardModal, CustomReportBuilderModal

// Data Export
// To create: ExportDataModal, ScheduleReportModal

// ============================================
// ⚙️ ADMINISTRATIVE MODALS
// ============================================

// Terms & Policies
export { ViewTermsModal } from "./ViewTermsModal";
// Additional modals: UpdateTermsModal, ViewPrivacyPolicyModal (create as needed)

// Settings
// To create: ProfileSettingsModal, NotificationSettingsModal, SecuritySettingsModal

// Help & Support
// To create: HelpCenterModal, SubmitFeedbackModal, ReportIssueModal

// ============================================
// 📝 NOTES FOR DEVELOPERS
// ============================================

/*
Creating New Modals:
1. Import BaseModal components from './BaseModal'
2. Follow the ECONNECT design system (blue/purple gradients)
3. Use ModalGlassCard for content sections
4. Add motion animations with staggered delays
5. Include success states for form submissions
6. Export modal from this index file
7. Update README.md with usage example

Design Guidelines:
- Icon gradients: from-[color]-500 to-[color]-600
- Primary actions: from-blue-600 to-purple-600
- Success: from-green-600 to-emerald-600
- Warning: from-orange-600 to-yellow-600
- Error: from-red-600 to-rose-600
- Info: from-cyan-600 to-blue-600

Animation Pattern:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>

Size Options:
- sm: max-w-md (small confirmations)
- md: max-w-2xl (forms, default)
- lg: max-w-4xl (detailed views)
- xl: max-w-6xl (complex forms)
- full: max-w-[95vw] (data tables)
*/
