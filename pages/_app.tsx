import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import { CacheProvider, EmotionCache } from '@emotion/react'
import createEmotionCache from '../utils/createEmotionCache'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../styles/theme'
import GlobalStyles from '../styles/GlobalStyles'
import { ColorSchemeProvider } from '../contexts/ColorSchemeContext'
import Layout from '../components/Layout'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function App({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <ColorSchemeProvider>
          <GlobalStyles />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Analytics />
        </ColorSchemeProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
