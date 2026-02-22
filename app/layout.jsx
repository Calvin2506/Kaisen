import { Inter } from "next/font/google"
import "./globals.css"
import AuthSessionProvider from "@/components/SessionProvider"
import NavbarWrapper from "@/components/NavbarWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Kaisen",
  description: "Track, analyze and reduce your subscriptions",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthSessionProvider>
          <NavbarWrapper />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}