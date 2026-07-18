import { createBrowserRouter } from 'react-router-dom'
import AppShell from './AppShell'
import HomePage from './HomePage'
import LessonPage from './LessonPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'lesson/:slug', element: <LessonPage /> },
    ],
  },
])
