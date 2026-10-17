import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { RequireAuth, RequireGuest } from '@/components/layout/RouteGuards'
import { ToastViewport } from '@/components/ui/Toast'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ChatDetailPage, ChatsIndexPage } from '@/pages/app/ChatDetailPage'
import { ChatsScreen } from '@/pages/app/ChatsScreen'
import { ContactsPage } from '@/pages/app/ContactsPage'
import { ProfilePage } from '@/pages/app/ProfilePage'
import { RequestsPage } from '@/pages/app/RequestsPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'

export function App() {
  return (
    <>
      <Routes>
        {/* Public (signed-out) */}
        <Route
          path="/login"
          element={
            <RequireGuest>
              <LoginPage />
            </RequireGuest>
          }
        />
        <Route
          path="/signup"
          element={
            <RequireGuest>
              <SignupPage />
            </RequireGuest>
          }
        />

        {/* App (signed-in) */}
        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/chats" replace />} />

          <Route path="chats" element={<ChatsScreen />}>
            <Route index element={<ChatsIndexPage />} />
            <Route path=":conversationId" element={<ChatDetailPage />} />
          </Route>

          <Route path="requests" element={<RequestsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="profile" element={<ProfilePage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <ToastViewport />
    </>
  )
}
