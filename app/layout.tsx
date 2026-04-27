import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/hooks/use-auth'
import type { Metadata } from 'next'
import { Geist_Mono, Google_Sans } from 'next/font/google'
import './globals.css'

const googleSans = Google_Sans({
  subsets: ["latin"],
  variable: "--font-google-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: 'Autocation',
  description: 'AI-powered car contract savings analysis platform.',
  icons: {
    icon: '/autocation-logo.png',
    shortcut: '/autocation-logo.png',
    apple: '/autocation-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${googleSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
