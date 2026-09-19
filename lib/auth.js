import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import db from "@/lib/db"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error("No user found")
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordMatch) {
          throw new Error("Incorrect password")
        }

        return user
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}