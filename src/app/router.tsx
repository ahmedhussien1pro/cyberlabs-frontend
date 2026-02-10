import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { ROUTES } from '@/lib/constants/routes'

// Layouts
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// Pages - Lazy load for code splitting
import { lazy, Suspense } from 'react'
import { PageLoader } from '@/components/common/PageLoader'

const HomePage = lazy(() => import('@/pages/Homepage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'))

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'))
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'))

// const LabsPage = lazy(() => import('@/pages/labs/LabsPage'))
// const LabDetailPage = lazy(() => import('@/pages/labs/LabDetailPage'))
// const LabPlayerPage = lazy(() => import('@/pages/labs/LabPlayerPage'))

// const CoursesPage = lazy(() => import('@/pages/courses/CoursesPage'))
// const CourseDetailPage = lazy(() => import('@/pages/courses/CourseDetailPage'))
// const LessonPage = lazy(() => import('@/pages/courses/LessonPage'))

// const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'))
// const AboutPage = lazy(() => import('@/pages/AboutPage'))
// const ContactPage = lazy(() => import('@/pages/ContactPage'))
// const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
)

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: (
      <SuspenseWrapper>
        <ForgotPasswordPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: (
      <SuspenseWrapper>
        <ResetPasswordPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.VERIFY_EMAIL,
    element: (
      <SuspenseWrapper>
        <VerifyEmailPage />
      </SuspenseWrapper>
    ),
  },
  // {
  //   path: ROUTES.ABOUT,
  //   element: (
  //     <SuspenseWrapper>
  //       <AboutPage />
  //     </SuspenseWrapper>
  //   ),
  // },
  // {
  //   path: ROUTES.CONTACT,
  //   element: (
  //     <SuspenseWrapper>
  //       <ContactPage />
  //     </SuspenseWrapper>
  //   ),
  // },
  // {
  //   path: ROUTES.LEADERBOARD,
  //   element: (
  //     <SuspenseWrapper>
  //       <LeaderboardPage />
  //     </SuspenseWrapper>
  //   ),
  // },

  // // Protected Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'profile',
            element: (
              <SuspenseWrapper>
                <ProfilePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'settings',
            element: (
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      // {
      //   path: ROUTES.LABS,
      //   element: (
      //     <SuspenseWrapper>
      //       <LabsPage />
      //     </SuspenseWrapper>
      //   ),
      // },
      // {
      //   path: ROUTES.LAB_DETAIL,
      //   element: (
      //     <SuspenseWrapper>
      //       <LabDetailPage />
      //     </SuspenseWrapper>
      //   ),
      // },
      // {
      //   path: ROUTES.LAB_PLAYER,
      //   element: (
      //     <SuspenseWrapper>
      //       <LabPlayerPage />
      //     </SuspenseWrapper>
      //   ),
      // },
      // {
      //   path: ROUTES.COURSES,
      //   element: (
      //     <SuspenseWrapper>
      //       <CoursesPage />
      //     </SuspenseWrapper>
      //   ),
      // },
      // {
      //   path: ROUTES.COURSE_DETAIL,
      //   element: (
      //     <SuspenseWrapper>
      //       <CourseDetailPage />
      //     </SuspenseWrapper>
      //   ),
      // },
      // {
      //   path: ROUTES.LESSON,
      //   element: (
      //     <SuspenseWrapper>
      //       <LessonPage />
      //     </SuspenseWrapper>
      //   ),
      // },
    ],
  },

  // // 404 Not Found
  // {
  //   path: ROUTES.NOT_FOUND,
  //   element: (
  //     <SuspenseWrapper>
  //       <NotFoundPage />
  //     </SuspenseWrapper>
  //   ),
  // },
])

export const AppRouter = () => <RouterProvider router={router} />
