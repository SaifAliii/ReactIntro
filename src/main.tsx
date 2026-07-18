import { createRoot } from 'react-dom/client'
import { ConfigProvider, App as AntApp } from 'antd'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import './i18n'
import { antdTheme } from './theme/antdTheme'
import { router } from './app/router'

// NOTE: React.StrictMode is intentionally omitted. Several lessons visualize
// exact render counts, and StrictMode's dev-only double-invocation of render
// functions would make those counts jump by two and confuse the lesson.
createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={antdTheme}>
    <AntApp>
      <RouterProvider router={router} />
    </AntApp>
  </ConfigProvider>,
)
