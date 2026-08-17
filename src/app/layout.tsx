import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
export const metadata: Metadata = { title: 'MoneyPrinterTurbo Studio', description: 'Create short-form videos with AI-powered scripts and media.' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="bg-background"><body className={`${inter.variable} ${mono.variable} font-sans`}>{children}</body></html> }
