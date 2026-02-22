import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import db from "@/lib/db"

const authOptions = {
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

        // find user in database
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error("No user found with this email")
        }

        // compare password with encrypted password in DB
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
        session.user.name = token.name
        session.user.email = token.email
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }