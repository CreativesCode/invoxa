import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AcceptInvitePage } from '../../features/auth/AcceptInvitePage'
import { ForgotPasswordPage } from '../../features/auth/ForgotPasswordPage'
import { HomeRedirect } from '../../features/auth/HomeRedirect'
import { LoginPage } from '../../features/auth/LoginPage'
import { ProtectedRoute } from '../../features/auth/ProtectedRoute'
import { RoleRoute } from '../../features/auth/RoleRoute'
import { AdminDashboardPage } from '../../features/admin/dashboard/AdminDashboardPage'
import { AdminInvoiceRequestsPage } from '../../features/admin/invoice-requests/AdminInvoiceRequestsPage'
import { AdminInvoiceDetailPage } from '../../features/admin/invoices/AdminInvoiceDetailPage'
import { AdminInvoicesListPage } from '../../features/admin/invoices/AdminInvoicesListPage'
import { AdminNumberChangeRequestsPage } from '../../features/admin/invoice-number-requests/AdminNumberChangeRequestsPage'
import { AssignMemberPage } from '../../features/admin/projects/AssignMemberPage'
import { EditAssignmentPage } from '../../features/admin/projects/EditAssignmentPage'
import { NewProjectPage } from '../../features/admin/projects/NewProjectPage'
import { ProjectDetailPage } from '../../features/admin/projects/ProjectDetailPage'
import { ProjectMembersPage } from '../../features/admin/projects/ProjectMembersPage'
import { ProjectsListPage } from '../../features/admin/projects/ProjectsListPage'
import { InviteUserPage } from '../../features/admin/users/InviteUserPage'
import { UserDetailPage } from '../../features/admin/users/UserDetailPage'
import { UsersListPage } from '../../features/admin/users/UsersListPage'
import { BillingProfilePage } from '../../features/user/billing-profile/BillingProfilePage'
import { UserDashboardPage } from '../../features/user/dashboard/UserDashboardPage'
import { NotificationsPage } from '../../features/notifications/NotificationsPage'
import { MyNumberChangeRequestsPage } from '../../features/user/invoice-number-requests/MyNumberChangeRequestsPage'
import { InvoiceDetailPage } from '../../features/user/invoices/InvoiceDetailPage'
import { InvoicesListPage } from '../../features/user/invoices/InvoicesListPage'
import { NewInvoicePage } from '../../features/user/invoices/NewInvoicePage'
import { NewTaskPage } from '../../features/user/tasks/NewTaskPage'
import { TaskDetailPage } from '../../features/user/tasks/TaskDetailPage'
import { TasksListPage } from '../../features/user/tasks/TasksListPage'

function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <RoleRoute role="admin">{children}</RoleRoute>
    </ProtectedRoute>
  )
}

function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <RoleRoute role="user">{children}</RoleRoute>
    </ProtectedRoute>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Legacy URL — landing now lives at "/" for SEO. */}
        <Route path="/landing" element={<Navigate to="/" replace />} />

        {/* Public auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/accept-invite" element={<AcceptInvitePage />} />

        {/* Root — redirects by session/role/platform (HomeRedirect handles unauth too) */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Admin area */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UsersListPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <AdminRoute>
              <InviteUserPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <AdminRoute>
              <UserDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <AdminRoute>
              <ProjectsListPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <AdminRoute>
              <NewProjectPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects/:id"
          element={
            <AdminRoute>
              <ProjectDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects/:id/members"
          element={
            <AdminRoute>
              <ProjectMembersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects/:id/members/new"
          element={
            <AdminRoute>
              <AssignMemberPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects/:id/members/:userId"
          element={
            <AdminRoute>
              <EditAssignmentPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/invoices"
          element={
            <AdminRoute>
              <AdminInvoicesListPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/invoices/:id"
          element={
            <AdminRoute>
              <AdminInvoiceDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/invoice-requests"
          element={
            <AdminRoute>
              <AdminInvoiceRequestsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/invoice-number-requests"
          element={
            <AdminRoute>
              <AdminNumberChangeRequestsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <AdminRoute>
              <NotificationsPage />
            </AdminRoute>
          }
        />

        {/* User area */}
        <Route
          path="/app/dashboard"
          element={
            <UserRoute>
              <UserDashboardPage />
            </UserRoute>
          }
        />
        <Route
          path="/app/billing-profile"
          element={
            <UserRoute>
              <BillingProfilePage />
            </UserRoute>
          }
        />
        <Route
          path="/app/tasks"
          element={
            <UserRoute>
              <TasksListPage />
            </UserRoute>
          }
        />
        <Route
          path="/app/tasks/new"
          element={
            <UserRoute>
              <NewTaskPage />
            </UserRoute>
          }
        />
        <Route
          path="/app/tasks/:id"
          element={
            <UserRoute>
              <TaskDetailPage />
            </UserRoute>
          }
        />
        <Route
          path="/app/invoices"
          element={
            <UserRoute>
              <InvoicesListPage />
            </UserRoute>
          }
        />
        <Route
          path="/app/invoices/new"
          element={
            <UserRoute>
              <NewInvoicePage />
            </UserRoute>
          }
        />
        <Route
          path="/app/invoices/:id"
          element={
            <UserRoute>
              <InvoiceDetailPage />
            </UserRoute>
          }
        />
        <Route
          path="/app/invoice-number-requests"
          element={
            <UserRoute>
              <MyNumberChangeRequestsPage />
            </UserRoute>
          }
        />
        <Route
          path="/app/notifications"
          element={
            <UserRoute>
              <NotificationsPage />
            </UserRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
