import { DM_Sans, DM_Serif_Display } from "next/font/google"
import "./globals.css"
import AuthSessionProvider from "@/components/SessionProvider"
import NavbarWrapper from "@/components/NavbarWrapper"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
})

export const metadata = {
  title: "Kaisen",
  description: "Track, analyze and reduce your subscriptions",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased`}>
        <AuthSessionProvider>
          <NavbarWrapper />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}