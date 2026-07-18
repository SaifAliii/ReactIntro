import { theme, type ThemeConfig } from 'antd'

/**
 * Central AntD theme. Keeps the dark palette in sync with the Tailwind tokens
 * defined in `src/index.css`. Change colors here + there and the whole app follows.
 */
export const antdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#8b5cf6',
    colorInfo: '#8b5cf6',
    colorBgBase: '#0b0f1a',
    colorBgContainer: '#121829',
    colorBgElevated: '#1a2236',
    colorBorder: '#26304a',
    colorBorderSecondary: '#1e263c',
    colorText: '#e7ecf5',
    colorTextSecondary: '#b7c0d6',
    colorTextTertiary: '#8a97b3',
    borderRadius: 10,
    fontFamily:
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontSize: 15,
  },
  components: {
    Layout: {
      headerBg: 'rgba(18, 24, 41, 0.7)',
      siderBg: 'rgba(15, 20, 33, 0.6)',
      bodyBg: 'transparent',
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      itemSelectedBg: 'rgba(139, 92, 246, 0.16)',
      itemSelectedColor: '#c4b5fd',
    },
    Card: {
      colorBgContainer: 'rgba(18, 24, 41, 0.6)',
    },
  },
}
