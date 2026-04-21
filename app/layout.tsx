import type { Metadata } from 'next'
import { Google_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/hooks/use-auth'
import { Toaster } from '@/components/ui/toaster'

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
    icon: '/autocation-tab-icon.svg',
    shortcut: '/autocation-tab-icon.svg',
    apple: '/autocation-tab-icon.svg',
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
